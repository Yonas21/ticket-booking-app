package main

import (
	"encoding/json"
	"log"

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

	// Seed trips data
	seedTrips()

	log.Println("Database seeding completed successfully!")
}

func clearTrips() {
	_, err := database.DB.Exec("DELETE FROM trips")
	if err != nil {
		log.Printf("Error clearing trips: %v", err)
		return
	}
	log.Println("Cleared existing trips")
}

func seedTrips() {
	trips := []TripData{
		{
			ID:                1,
			From:              "Addis Ababa",
			To:                "Adama",
			Date:              "2025-08-20",
			DepartureTime:     "08:00",
			ArrivalTime:       "09:30",
			Price:             150.00,
			SeatsAvailable:    40,
			BusOperator:       "Selam Bus",
			Duration:          "1h 30m",
			Amenities:         []string{"WiFi", "AC", "Restroom"},
			IntermediateStops: []string{"Bishoftu"},
			Reviews: []Review{
				{Rating: 5, Comment: "Great trip! Very comfortable and on time.", Reviewer: "Abebe K."},
			},
			Seats:      generateSeats(40),
			BusType:    "Luxury Coach",
			BusNumber:  "SEL-001",
			DriverName: "Tadesse Bekele",
			Status:     "scheduled",
		},
		{
			ID:                2,
			From:              "Addis Ababa",
			To:                "Hawassa",
			Date:              "2025-08-21",
			DepartureTime:     "10:00",
			ArrivalTime:       "13:00",
			Price:             300.00,
			SeatsAvailable:    30,
			BusOperator:       "Sky Bus",
			Duration:          "3h 0m",
			Amenities:         []string{"AC", "Restroom"},
			IntermediateStops: []string{"Mojo", "Adama"},
			Reviews: []Review{
				{Rating: 4, Comment: "Comfortable journey with good service.", Reviewer: "Kebede M."},
			},
			Seats:      generateSeats(40),
			BusType:    "Standard Coach",
			BusNumber:  "SKY-002",
			DriverName: "Mulugeta Haile",
			Status:     "scheduled",
		},
		{
			ID:                3,
			From:              "Addis Ababa",
			To:                "Gondar",
			Date:              "2025-08-22",
			DepartureTime:     "07:30",
			ArrivalTime:       "16:00",
			Price:             450.00,
			SeatsAvailable:    25,
			BusOperator:       "Ethiopian Bus",
			Duration:          "8h 30m",
			Amenities:         []string{"WiFi", "AC", "Restroom", "Power Outlet"},
			IntermediateStops: []string{"Bahir Dar", "Debre Markos"},
			Reviews: []Review{
				{Rating: 5, Comment: "Excellent service and very clean bus.", Reviewer: "Yohannes T."},
			},
			Seats:      generateSeats(40),
			BusType:    "Luxury Coach",
			BusNumber:  "ETH-003",
			DriverName: "Dawit Mengistu",
			Status:     "scheduled",
		},
		{
			ID:                4,
			From:              "Addis Ababa",
			To:                "Mekelle",
			Date:              "2025-08-23",
			DepartureTime:     "06:00",
			ArrivalTime:       "18:00",
			Price:             600.00,
			SeatsAvailable:    20,
			BusOperator:       "Tigray Bus",
			Duration:          "12h 0m",
			Amenities:         []string{"WiFi", "AC", "Restroom", "Power Outlet", "Snacks"},
			IntermediateStops: []string{"Dessie", "Woldiya", "Alamata"},
			Reviews: []Review{
				{Rating: 4, Comment: "Long journey but very comfortable.", Reviewer: "Tekle H."},
			},
			Seats:      generateSeats(40),
			BusType:    "Luxury Coach",
			BusNumber:  "TIG-004",
			DriverName: "Girma Alemu",
			Status:     "scheduled",
		},
		{
			ID:                5,
			From:              "Addis Ababa",
			To:                "Bahir Dar",
			Date:              "2025-08-24",
			DepartureTime:     "09:00",
			ArrivalTime:       "15:00",
			Price:             350.00,
			SeatsAvailable:    35,
			BusOperator:       "Amhara Bus",
			Duration:          "6h 0m",
			Amenities:         []string{"AC", "Restroom"},
			IntermediateStops: []string{"Debre Markos"},
			Reviews: []Review{
				{Rating: 4, Comment: "Good service and punctual departure.", Reviewer: "Sara M."},
			},
			Seats:      generateSeats(40),
			BusType:    "Standard Coach",
			BusNumber:  "AMH-005",
			DriverName: "Bekele Tadesse",
			Status:     "scheduled",
		},
		{
			ID:                6,
			From:              "Adama",
			To:                "Addis Ababa",
			Date:              "2025-08-25",
			DepartureTime:     "07:00",
			ArrivalTime:       "08:30",
			Price:             150.00,
			SeatsAvailable:    38,
			BusOperator:       "Selam Bus",
			Duration:          "1h 30m",
			Amenities:         []string{"WiFi", "AC", "Restroom"},
			IntermediateStops: []string{"Bishoftu"},
			Reviews: []Review{
				{Rating: 5, Comment: "Quick and comfortable journey.", Reviewer: "Dawit K."},
			},
			Seats:      generateSeats(40),
			BusType:    "Luxury Coach",
			BusNumber:  "SEL-006",
			DriverName: "Tadesse Bekele",
			Status:     "scheduled",
		},
		{
			ID:                7,
			From:              "Hawassa",
			To:                "Addis Ababa",
			Date:              "2025-08-26",
			DepartureTime:     "08:00",
			ArrivalTime:       "11:00",
			Price:             300.00,
			SeatsAvailable:    28,
			BusOperator:       "Sky Bus",
			Duration:          "3h 0m",
			Amenities:         []string{"AC", "Restroom"},
			IntermediateStops: []string{"Adama", "Mojo"},
			Reviews: []Review{
				{Rating: 4, Comment: "Reliable service and clean bus.", Reviewer: "Martha L."},
			},
			Seats:      generateSeats(40),
			BusType:    "Standard Coach",
			BusNumber:  "SKY-007",
			DriverName: "Mulugeta Haile",
			Status:     "scheduled",
		},
		{
			ID:                8,
			From:              "Gondar",
			To:                "Addis Ababa",
			Date:              "2025-08-27",
			DepartureTime:     "06:30",
			ArrivalTime:       "15:00",
			Price:             450.00,
			SeatsAvailable:    22,
			BusOperator:       "Ethiopian Bus",
			Duration:          "8h 30m",
			Amenities:         []string{"WiFi", "AC", "Restroom", "Power Outlet"},
			IntermediateStops: []string{"Debre Markos", "Bahir Dar"},
			Reviews: []Review{
				{Rating: 5, Comment: "Excellent long-distance service.", Reviewer: "Solomon A."},
			},
			Seats:      generateSeats(40),
			BusType:    "Luxury Coach",
			BusNumber:  "ETH-008",
			DriverName: "Dawit Mengistu",
			Status:     "scheduled",
		},
		{
			ID:                9,
			From:              "Mekelle",
			To:                "Addis Ababa",
			Date:              "2025-08-28",
			DepartureTime:     "05:00",
			ArrivalTime:       "17:00",
			Price:             600.00,
			SeatsAvailable:    18,
			BusOperator:       "Tigray Bus",
			Duration:          "12h 0m",
			Amenities:         []string{"WiFi", "AC", "Restroom", "Power Outlet", "Snacks"},
			IntermediateStops: []string{"Alamata", "Woldiya", "Dessie"},
			Reviews: []Review{
				{Rating: 4, Comment: "Comfortable for such a long journey.", Reviewer: "Hagos T."},
			},
			Seats:      generateSeats(40),
			BusType:    "Luxury Coach",
			BusNumber:  "TIG-009",
			DriverName: "Girma Alemu",
			Status:     "scheduled",
		},
		{
			ID:                10,
			From:              "Bahir Dar",
			To:                "Addis Ababa",
			Date:              "2025-08-29",
			DepartureTime:     "08:00",
			ArrivalTime:       "14:00",
			Price:             350.00,
			SeatsAvailable:    32,
			BusOperator:       "Amhara Bus",
			Duration:          "6h 0m",
			Amenities:         []string{"AC", "Restroom"},
			IntermediateStops: []string{"Debre Markos"},
			Reviews: []Review{
				{Rating: 4, Comment: "Good value for money.", Reviewer: "Kidist B."},
			},
			Seats:      generateSeats(40),
			BusType:    "Standard Coach",
			BusNumber:  "AMH-010",
			DriverName: "Bekele Tadesse",
			Status:     "scheduled",
		},
		{
			ID:                11,
			From:              "Addis Ababa",
			To:                "Jimma",
			Date:              "2025-08-30",
			DepartureTime:     "07:00",
			ArrivalTime:       "12:00",
			Price:             250.00,
			SeatsAvailable:    36,
			BusOperator:       "Oromia Bus",
			Duration:          "5h 0m",
			Amenities:         []string{"AC", "Restroom"},
			IntermediateStops: []string{"Adama", "Shashamane"},
			Reviews: []Review{
				{Rating: 4, Comment: "Punctual and clean service.", Reviewer: "Tolasa D."},
			},
			Seats:      generateSeats(40),
			BusType:    "Standard Coach",
			BusNumber:  "ORO-011",
			DriverName: "Abebe Kebede",
			Status:     "scheduled",
		},
		{
			ID:                12,
			From:              "Jimma",
			To:                "Addis Ababa",
			Date:              "2025-08-31",
			DepartureTime:     "08:30",
			ArrivalTime:       "13:30",
			Price:             250.00,
			SeatsAvailable:    34,
			BusOperator:       "Oromia Bus",
			Duration:          "5h 0m",
			Amenities:         []string{"AC", "Restroom"},
			IntermediateStops: []string{"Shashamane", "Adama"},
			Reviews: []Review{
				{Rating: 4, Comment: "Reliable service.", Reviewer: "Bekele M."},
			},
			Seats:      generateSeats(40),
			BusType:    "Standard Coach",
			BusNumber:  "ORO-012",
			DriverName: "Abebe Kebede",
			Status:     "scheduled",
		},
		{
			ID:                13,
			From:              "Addis Ababa",
			To:                "Dire Dawa",
			Date:              "2025-09-01",
			DepartureTime:     "06:00",
			ArrivalTime:       "14:00",
			Price:             400.00,
			SeatsAvailable:    26,
			BusOperator:       "Somali Bus",
			Duration:          "8h 0m",
			Amenities:         []string{"WiFi", "AC", "Restroom", "Power Outlet"},
			IntermediateStops: []string{"Adama", "Awash", "Mieso"},
			Reviews: []Review{
				{Rating: 5, Comment: "Excellent service and comfortable journey.", Reviewer: "Ahmed M."},
			},
			Seats:      generateSeats(40),
			BusType:    "Luxury Coach",
			BusNumber:  "SOM-013",
			DriverName: "Mohammed Ali",
			Status:     "scheduled",
		},
		{
			ID:                14,
			From:              "Dire Dawa",
			To:                "Addis Ababa",
			Date:              "2025-09-02",
			DepartureTime:     "07:00",
			ArrivalTime:       "15:00",
			Price:             400.00,
			SeatsAvailable:    24,
			BusOperator:       "Somali Bus",
			Duration:          "8h 0m",
			Amenities:         []string{"WiFi", "AC", "Restroom", "Power Outlet"},
			IntermediateStops: []string{"Mieso", "Awash", "Adama"},
			Reviews: []Review{
				{Rating: 4, Comment: "Good service and on time.", Reviewer: "Fatima H."},
			},
			Seats:      generateSeats(40),
			BusType:    "Luxury Coach",
			BusNumber:  "SOM-014",
			DriverName: "Mohammed Ali",
			Status:     "scheduled",
		},
		{
			ID:                15,
			From:              "Addis Ababa",
			To:                "Adama",
			Date:              "2025-09-03",
			DepartureTime:     "09:00",
			ArrivalTime:       "10:30",
			Price:             150.00,
			SeatsAvailable:    40,
			BusOperator:       "Selam Bus",
			Duration:          "1h 30m",
			Amenities:         []string{"WiFi", "AC", "Restroom"},
			IntermediateStops: []string{"Bishoftu"},
			Reviews: []Review{
				{Rating: 5, Comment: "Perfect for daily commute.", Reviewer: "Yohannes K."},
			},
			Seats:      generateSeats(40),
			BusType:    "Luxury Coach",
			BusNumber:  "SEL-015",
			DriverName: "Tadesse Bekele",
			Status:     "scheduled",
		},
	}

	for _, trip := range trips {
		insertTrip(trip)
	}
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
			reviews, seats, bus_type, bus_number, driver_name, status
		) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
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
		trip.BusType,
		trip.BusNumber,
		trip.DriverName,
		trip.Status,
	)

	if err != nil {
		log.Printf("Error inserting trip %d: %v", trip.ID, err)
	} else {
		log.Printf("Inserted trip %d: %s to %s", trip.ID, trip.From, trip.To)
	}
}
