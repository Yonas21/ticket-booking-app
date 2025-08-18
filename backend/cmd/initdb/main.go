package main

import (
	"io/ioutil"
	"log"

	"ticket-booking-app/backend/database"
)

func main() {
	db, err := database.ConnectToPostgres("ticket_booking")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	sqlFile, err := ioutil.ReadFile("database/init.sql")
	if err != nil {
		log.Fatalf("Could not read init.sql: %v", err)
	}

	_, err = db.Exec(string(sqlFile))
	if err != nil {
		log.Fatalf("Could not execute init.sql: %v", err)
	}

	log.Println("Database initialized successfully")
}
