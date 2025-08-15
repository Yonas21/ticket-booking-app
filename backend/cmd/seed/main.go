package main
import (
    "database/sql"
    "encoding/json"
    "io/ioutil"
    "log"

    _ "github.com/lib/pq"
    "ticket-booking-app/backend/models"
)

func main() {
    // Connect to the database
    connStr := "user=postgres password=password dbname=ticket_booking sslmode=disable"
    db, err := sql.Open("postgres", connStr)
    if err != nil {
        log.Fatal(err)
    }
    defer db.Close()

    // Read trips.json
    tripsFile, err := ioutil.ReadFile("../../../src/data/trips.json")
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
        _, err := db.Exec(`INSERT INTO trips ("from", "to", date, "time", price, seats, seats_available) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            trip.From, trip.To, trip.Date, trip.Time, trip.Price, trip.Seats, trip.SeatsAvailable)
        if err != nil {
            log.Printf("Failed to insert trip: %v", err)
        }
    }

    // Read users.json
    usersFile, err := ioutil.ReadFile("../../../src/data/users.json")
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



