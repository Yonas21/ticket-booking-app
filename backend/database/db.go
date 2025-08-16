package database

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"os"

	"github.com/lib/pq"
	_ "github.com/lib/pq"
	"ticket-booking-app/backend/models"
)

var DB *sql.DB

func InitDB() {
	dbName := os.Getenv("TEST_DB_NAME")
	if dbName == "" {
		dbName = "ticket_booking"
	}
	connStr := fmt.Sprintf("dbname=%s sslmode=disable", dbName)

	var err error
	DB, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}

	err = DB.Ping()
	if err != nil {
		log.Fatal(err)
	}

	fmt.Printf("Successfully connected to database: %s\n", dbName)
}

func ConnectToPostgres(dbName string) (*sql.DB, error) {
	connStr := fmt.Sprintf("dbname=%s sslmode=disable", dbName)
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return nil, err
	}

	err = db.Ping()
	if err != nil {
		return nil, err
	}

	return db, nil
}

func CreateUser(user models.User) (int, error) {
	var id int
	err := DB.QueryRow("INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id",
		user.Name, user.Email, user.Password).Scan(&id)
	if err != nil {
		return 0, err
	}
	return id, nil
}

func GetUserByEmail(email string) (models.User, error) {
	var user models.User
	row := DB.QueryRow("SELECT id, name, email, password FROM users WHERE email = $1", email)
	err := row.Scan(&user.ID, &user.Name, &user.Email, &user.Password)
	if err != nil {
		return user, err
	}
	return user, nil
}

func GetTripByID(id int) (models.Trip, error) {
	var trip models.Trip
	var seats pq.StringArray
	row := DB.QueryRow(`SELECT id, "from", "to", date, "departure_time", "arrival_time", price, seats, seats_available FROM trips WHERE id = $1`, id)
	err := row.Scan(&trip.ID, &trip.From, &trip.To, &trip.Date, &trip.DepartureTime, &trip.ArrivalTime, &trip.Price, &seats, &trip.SeatsAvailable)
	if err != nil {
		return trip, err
	}
	trip.Seats = []string(seats)
	return trip, nil
}


func SearchTrips(from, to, date string, flexibleDateRange int) ([]models.Trip, error) {
	var trips []models.Trip
	query := `SELECT id, "from", "to", date, departure_time, arrival_time, price, seats_available, bus_operator, duration, amenities, intermediate_stops, reviews, seats FROM trips WHERE LOWER("from") = LOWER($1) AND LOWER("to") = LOWER($2)`
	args := []interface{}{from, to}

	if date != "" {
		if flexibleDateRange > 0 {
			query += ` AND date::date BETWEEN $3::date - $4 * interval '1 day' AND $3::date + $4 * interval '1 day'`
			args = append(args, date, flexibleDateRange)
		} else {
			query += ` AND date::date = $3::date`
			args = append(args, date)
		}
	}

	rows, err := DB.Query(query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var trip models.Trip
		var amenities, intermediateStops, seats pq.StringArray
		var reviewsJSON []byte
		err := rows.Scan(&trip.ID, &trip.From, &trip.To, &trip.Date, &trip.DepartureTime, &trip.ArrivalTime, &trip.Price, &trip.SeatsAvailable, &trip.BusOperator, &trip.Duration, &amenities, &intermediateStops, &reviewsJSON, &seats)
		if err != nil {
			return nil, err
		}
		trip.Amenities = []string(amenities)
		trip.IntermediateStops = []string(intermediateStops)
		trip.Seats = []string(seats)
		json.Unmarshal(reviewsJSON, &trip.Reviews)
		trips = append(trips, trip)
	}

	return trips, nil
}


func CreateTrip(trip models.Trip) (models.Trip, error) {
	var id int
	var seats pq.StringArray = trip.Seats
	err := DB.QueryRow("INSERT INTO trips (\"from\", \"to\", date, \"departure_time\", \"arrival_time\", price, seats, seats_available) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id",
		trip.From, trip.To, trip.Date, trip.DepartureTime, trip.ArrivalTime, trip.Price, pq.Array(seats), trip.SeatsAvailable).Scan(&id)
	if err != nil {
		return trip, err
	}
	trip.ID = id
	return trip, nil
}



func CreateBooking(booking models.Booking) (int, error) {
	var id int
	err := DB.QueryRow("INSERT INTO bookings (user_id, trip_id, seats) VALUES ($1, $2, $3) RETURNING id",
		booking.UserID, booking.TripID, pq.Array(booking.Seats)).Scan(&id)
	if err != nil {
		return 0, err
	}
	return id, nil
}

func UpdateTripSeats(tripID int, newSeats []string, seatsAvailable int) error {
	_, err := DB.Exec("UPDATE trips SET seats = $1, seats_available = $2 WHERE id = $3",
		pq.Array(newSeats), seatsAvailable, tripID)
	return err
}

func GetUserProfile(email string) (models.User, []models.Booking, error) {
	var user models.User
	userRow := DB.QueryRow("SELECT id, name, email FROM users WHERE email = $1", email)
	err := userRow.Scan(&user.ID, &user.Name, &user.Email)
	if err != nil {
		return user, nil, err
	}

	var bookings []models.Booking
	rows, err := DB.Query("SELECT id, user_id, trip_id, seats FROM bookings WHERE user_id = $1", user.ID)
	if err != nil {
		return user, nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var booking models.Booking
		var seats pq.StringArray
		err := rows.Scan(&booking.ID, &booking.UserID, &booking.TripID, &seats)
		if err != nil {
			return user, nil, err
		}
		booking.Seats = []string(seats)
		bookings = append(bookings, booking)
	}

	return user, bookings, nil
}
