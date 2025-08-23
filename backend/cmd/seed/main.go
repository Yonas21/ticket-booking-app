package main

import (
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"time"

	"ticket-booking-app/backend/config"
	"ticket-booking-app/backend/database"

	"github.com/lib/pq"
	_ "github.com/lib/pq"
)

// TripData represents the structure of our trip data
type TripData struct {
	ID                int      `json:"id"`
	From              string   `json:"from"`
	To                string   `json:"to"`
	Date              string   `json:"date"`
	DepartureTime     string   `json:"departureTime"`
	ArrivalTime       string   `json:"arrivalTime"`
	Price             float64  `json:"price"`
	SeatsAvailable    int      `json:"seatsAvailable"`
	BusOperator       string   `json:"busOperator"`
	Duration          string   `json:"duration"`
	Amenities         []string `json:"amenities"`
	IntermediateStops []string `json:"intermediateStops"`
	Reviews           []Review `json:"reviews"`
	Seats             []string `json:"seats"`
	BusType           string   `json:"busType"`
	BusNumber         string   `json:"busNumber"`
	DriverName        string   `json:"driverName"`
	Status            string   `json:"status"`
}

type Review struct {
	Rating   int    `json:"rating"`
	Comment  string `json:"comment"`
	Reviewer string `json:"reviewer"`
}

func main() {
	// Load configuration
	config.LoadConfig()

	// Initialize database
	if err := database.InitDB(); err != nil {
		log.Fatal("Failed to initialize database:", err)
	}
	defer database.CloseDB()

	// Clear existing trips
	clearTrips()

	// Generate trips from today to end of August
	generateTripsFromTodayToEndOfAugust()

	log.Println("Database seeding completed successfully!")
}

func clearTrips() {
	_, err := database.DB.Exec("DELETE FROM trips")
	if err != nil {
		log.Printf("Error clearing trips: %v", err)
		return
	}
	
	// Reset sequence
	_, err = database.DB.Exec("ALTER SEQUENCE trips_id_seq RESTART WITH 1")
	if err != nil {
		log.Printf("Error resetting sequence: %v", err)
		return
	}
	
	log.Println("Cleared existing trips and reset sequence")
}

func generateTripsFromTodayToEndOfAugust() {
	// Ethiopian cities for realistic routes
	cities := []string{
		"Addis Ababa", "Adama", "Hawassa", "Bahir Dar", "Gondar", "Mekelle", 
		"Dessie", "Jimma", "Dire Dawa", "Harar", "Jijiga", "Shashamane",
		"Bishoftu", "Mojo", "Asella", "Nazret", "Debre Markos",
	}

	// Bus operators
	operators := []string{
		"Selam Bus", "Sky Bus", "Ethiopian Bus", "Gonder Bus", "Tikur Abay Bus",
		"Selam Ethiopia", "Abay Bus", "Tana Bus", "Blue Nile Bus", "Omo Bus",
	}

	// Amenities available
	amenities := [][]string{
		{"WiFi", "AC", "USB Charging", "Refreshments"},
		{"AC", "USB Charging"},
		{"WiFi", "AC"},
		{"AC", "Refreshments"},
		{"WiFi", "AC", "USB Charging", "Refreshments", "Entertainment"},
		{"AC"},
	}

	// Intermediate stops for different routes
	routeStops := map[string][]string{
		"Addis Ababa-Adama":     {"Bishoftu", "Mojo"},
		"Addis Ababa-Hawassa":   {"Mojo", "Adama", "Shashamane"},
		"Addis Ababa-Bahir Dar": {"Debre Markos", "Finote Selam"},
		"Addis Ababa-Gondar":    {"Debre Markos", "Finote Selam", "Bahir Dar"},
		"Addis Ababa-Mekelle":   {"Dessie", "Woldiya", "Kombolcha"},
		"Addis Ababa-Dire Dawa": {"Adama", "Awash", "Mieso"},
		"Adama-Hawassa":         {"Shashamane"},
		"Bahir Dar-Gondar":      {"Fogera"},
		"Dessie-Mekelle":        {"Kombolcha", "Woldiya"},
	}

	// Generate trips from today to end of August
	today := time.Now()
	endOfAugust := time.Date(today.Year(), 8, 31, 23, 59, 59, 0, today.Location())

	tripCount := 0
	currentDate := today
	tripID := 1

	for currentDate.Before(endOfAugust) || currentDate.Equal(endOfAugust) {
		// Generate 3-8 trips per day
		dailyTrips := rand.Intn(6) + 3 // 3 to 8 trips
		
		for i := 0; i < dailyTrips; i++ {
			trip := generateRandomTrip(currentDate, tripID, cities, operators, amenities, routeStops)
			insertTrip(trip)
			tripCount++
			tripID++
		}
		
		currentDate = currentDate.AddDate(0, 0, 1) // Next day
	}

	fmt.Printf("Successfully created %d trips from %s to %s\n", 
		tripCount, today.Format("2006-01-02"), endOfAugust.Format("2006-01-02"))
}

func generateRandomTrip(date time.Time, tripID int, cities, operators []string, amenities [][]string, routeStops map[string][]string) TripData {
	// Generate random route
	from := cities[rand.Intn(len(cities))]
	to := cities[rand.Intn(len(cities))]
	
	// Make sure from and to are different
	for to == from {
		to = cities[rand.Intn(len(cities))]
	}

	// Generate departure time (between 6 AM and 10 PM)
	hour := rand.Intn(17) + 6 // 6 to 22
	minute := rand.Intn(4) * 15 // 0, 15, 30, 45
	departureTime := fmt.Sprintf("%02d:%02d", hour, minute)

	// Calculate arrival time (1-8 hours later)
	durationHours := rand.Intn(8) + 1
	arrivalHour := (hour + durationHours) % 24
	arrivalTime := fmt.Sprintf("%02d:%02d", arrivalHour, minute)

	// Generate price based on distance (rough estimate)
	basePrice := 50.0
	distanceMultiplier := float64(durationHours) * 25.0
	price := basePrice + distanceMultiplier + float64(rand.Intn(50))

	// Generate seats
	seatsAvailable := rand.Intn(20) + 10 // 10-30 seats available
	allSeats := generateSeats(40)
	availableSeats := allSeats[:seatsAvailable]

	// Get amenities
	amenitiesList := amenities[rand.Intn(len(amenities))]

	// Get intermediate stops
	routeKey := fmt.Sprintf("%s-%s", from, to)
	stops, exists := routeStops[routeKey]
	if !exists {
		// Generate random stops for unknown routes
		numStops := rand.Intn(3)
		stops = make([]string, numStops)
		for i := 0; i < numStops; i++ {
			stops[i] = cities[rand.Intn(len(cities))]
		}
	}

	// Generate reviews
	reviews := generateReviews()

	return TripData{
		ID:                tripID,
		From:              from,
		To:                to,
		Date:              date.Format("2006-01-02"),
		DepartureTime:     departureTime,
		ArrivalTime:       arrivalTime,
		Price:             price,
		SeatsAvailable:    seatsAvailable,
		BusOperator:       operators[rand.Intn(len(operators))],
		Duration:          fmt.Sprintf("%dh %dm", durationHours, rand.Intn(60)),
		Seats:             availableSeats,
		Amenities:         amenitiesList,
		IntermediateStops: stops,
		Reviews:           reviews,
		BusType:           "Standard Coach",
		BusNumber:         fmt.Sprintf("BUS-%03d", tripID),
		DriverName:        generateRandomName(),
		Status:            "scheduled",
	}
}

func generateReviews() []Review {
	numReviews := rand.Intn(5) // 0-4 reviews
	reviews := make([]Review, numReviews)
	
	for i := 0; i < numReviews; i++ {
		reviews[i] = Review{
			Rating:   rand.Intn(5) + 1, // 1-5 stars
			Comment:  generateRandomComment(),
			Reviewer: generateRandomName(),
		}
	}
	
	return reviews
}

func generateRandomComment() string {
	comments := []string{
		"Great trip, very comfortable!",
		"On time and clean bus.",
		"Good service, would recommend.",
		"Driver was professional and safe.",
		"Comfortable journey, good amenities.",
		"Punctual departure and arrival.",
		"Clean and well-maintained bus.",
		"Friendly staff and good service.",
		"Smooth ride, no issues.",
		"Good value for money.",
	}
	return comments[rand.Intn(len(comments))]
}

func generateRandomName() string {
	names := []string{
		"Abebe", "Kebede", "Tadesse", "Mulugeta", "Dawit",
		"Yohannes", "Mekonnen", "Tesfaye", "Girma", "Bekele",
		"Fatima", "Aisha", "Hana", "Mariam", "Zainab",
		"Sarah", "Ruth", "Esther", "Deborah", "Rachel",
	}
	return names[rand.Intn(len(names))]
}

func generateSeats(count int) []string {
	seats := make([]string, count)
	rows := []string{"A", "B", "C", "D", "E", "F", "G", "H", "I", "J"}
	cols := []string{"1", "2", "3", "4"}

	seatIndex := 0
	for _, row := range rows {
		for _, col := range cols {
			if seatIndex < count {
				seats[seatIndex] = row + col
				seatIndex++
			}
		}
	}

	return seats
}

func insertTrip(trip TripData) {
	// Convert reviews to JSON
	reviewsJSON, err := json.Marshal(trip.Reviews)
	if err != nil {
		log.Printf("Error marshaling reviews for trip %d: %v", trip.ID, err)
		return
	}

	query := `
		INSERT INTO trips (
			id, "from", "to", date, departure_time, arrival_time, price, 
			seats_available, bus_operator, duration, amenities, intermediate_stops, 
			reviews, seats
		) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
	`

	_, err = database.DB.Exec(query,
		trip.ID,
		trip.From,
		trip.To,
		trip.Date,
		trip.DepartureTime,
		trip.ArrivalTime,
		trip.Price,
		trip.SeatsAvailable,
		trip.BusOperator,
		trip.Duration,
		pq.Array(trip.Amenities),
		pq.Array(trip.IntermediateStops),
		reviewsJSON,
		pq.Array(trip.Seats),
	)

	if err != nil {
		log.Printf("Error inserting trip %d: %v", trip.ID, err)
	} else {
		log.Printf("Inserted trip %d: %s to %s", trip.ID, trip.From, trip.To)
	}
}
