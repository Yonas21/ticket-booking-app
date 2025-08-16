package main
import (
    "encoding/json"
    "io/ioutil"
    "log"

    "github.com/lib/pq"
    _ "github.com/lib/pq"
    "ticket-booking-app/backend/database"
    "ticket-booking-app/backend/models"
)

func main() {
    // Connect to the database
    db, err := database.ConnectToPostgres("ticket_booking")
    if err != nil {
        log.Fatal(err)
    }
    defer db.Close()

    // Clear existing data
    _, err = db.Exec("DELETE FROM bookings")
    if err != nil {
        log.Fatalf("Failed to clear bookings table: %v", err)
    }
    _, err = db.Exec("DELETE FROM trips")
    if err != nil {
        log.Fatalf("Failed to clear trips table: %v", err)
    }
    _, err = db.Exec("DELETE FROM users")
    if err != nil {
        log.Fatalf("Failed to clear users table: %v", err)
    }

    // Read trips.json
    tripsFile, err := ioutil.ReadFile("../src/data/trips.json")
    if err != nil {
        log.Fatalf("Failed to read trips.json: %v", err)
    }

    var trips []models.Trip
    err = json.Unmarshal(tripsFile, &trips)
    if err != nil {
        log.Fatalf("Failed to unmarshal trips.json: %v", err)
    }

    // Insert trips into the database
    for _, trip := range trips {
        reviewsJSON, err := json.Marshal(trip.Reviews)
        if err != nil {
            log.Printf("Failed to marshal reviews: %v", err)
            continue
        }

        _, err = db.Exec(`INSERT INTO trips ("from", "to", date, departure_time, arrival_time, price, seats_available, bus_operator, duration, amenities, intermediate_stops, reviews) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
            trip.From, trip.To, trip.Date, trip.DepartureTime, trip.ArrivalTime, trip.Price, trip.SeatsAvailable, trip.BusOperator, trip.Duration, pq.Array(trip.Amenities), pq.Array(trip.IntermediateStops), reviewsJSON)
        if err != nil {
            log.Printf("Failed to insert trip: %v", err)
        }
    }

    // Read users.json
    usersFile, err := ioutil.ReadFile("../src/data/users.json")
    if err != nil {
        log.Fatalf("Failed to read users.json: %v", err)
    }

    var users []models.User
    err = json.Unmarshal(usersFile, &users)
    if err != nil {
        log.Fatalf("Failed to unmarshal users.json: %v", err)
    }

    // Insert users into the database
    for _, user := range users {
        _, err := db.Exec(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3)`,
            user.Name, user.Email, user.Password)
        if err != nil {
            log.Printf("Failed to insert user: %v", err)
        }
    }

    log.Println("Successfully seeded database")
}
