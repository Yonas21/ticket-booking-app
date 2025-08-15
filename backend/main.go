package main

import (
	"fmt"
	"log"
	"net/http"

	"ticket-booking-app/backend/auth"
	"ticket-booking-app/backend/database"
	"ticket-booking-app/backend/handlers"
	"ticket-booking-app/backend/middleware"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func main() {
	// Initialize database
	database.InitDB()

	r := mux.NewRouter()
	r.Use(middleware.LoggingMiddleware)

	// API endpoints
	r.HandleFunc("/api/auth/signup", handlers.SignupHandler).Methods("POST")
	r.HandleFunc("/api/auth/login", handlers.LoginHandler).Methods("POST")
	r.HandleFunc("/api/trips/search", handlers.SearchTripsHandler).Methods("GET")
	r.Handle("/api/trips/{id}", auth.Middleware(http.HandlerFunc(handlers.GetTripByIDHandler))).Methods("GET")
	r.Handle("/api/bookings", auth.Middleware(http.HandlerFunc(handlers.CreateBookingHandler))).Methods("POST")
	r.Handle("/api/profile", auth.Middleware(http.HandlerFunc(handlers.GetProfileHandler))).Methods("GET")

	// CORS handler
	c := cors.New(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{"Authorization", "Content-Type"},
	})

	handler := c.Handler(r)

	fmt.Println("Server starting on port 8080...")
	log.Fatal(http.ListenAndServe(":8080", handler))
}
