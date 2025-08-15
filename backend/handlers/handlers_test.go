package handlers_test

import (
	"bytes"
	"encoding/json"
	"log"
	"net/http"
	"net/http/httptest"
	"os"
	"strconv"
	"testing"
	"time"

	"ticket-booking-app/backend/auth"
	"ticket-booking-app/backend/config"
	"ticket-booking-app/backend/database"
	"ticket-booking-app/backend/handlers"
	"ticket-booking-app/backend/models"

	"github.com/dgrijalva/jwt-go"
	"github.com/gorilla/mux"
	"golang.org/x/crypto/bcrypt"
)

func generateTestToken(email string) (string, error) {
	expirationTime := time.Now().Add(5 * time.Minute)
	claims := &jwt.StandardClaims{
		Subject:   email,
		ExpiresAt: expirationTime.Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(config.JWTKey)
}

func setupTestDB() {
	// Set environment variable for test database
	os.Setenv("TEST_DB_NAME", "ticket_booking_test")

	// Drop and create the test database to ensure a clean state
	dropTestDB()
	createTestDB()

	// Initialize the database connection
	database.InitDB()

	// Run init.sql to create tables in the test database
	runInitSQL()

	// Clear tables before each test run (important for repeated test runs)
	clearTestDB()
}

func dropTestDB() {
	// Connect to default postgres database to drop the test database
	db, err := database.ConnectToPostgres("postgres") // Assuming a function to connect to a specific db
	if err != nil {
		// Log error but don't fatal, as db might not exist
		return
	}
	defer db.Close()
	db.Exec("DROP DATABASE IF EXISTS ticket_booking_test")
}

func createTestDB() {
	// Connect to default postgres database to create the test database
	db, err := database.ConnectToPostgres("postgres") // Assuming a function to connect to a specific db
	if err != nil {
		log.Fatalf("Could not connect to postgres to create test db: %v", err)
	}
	defer db.Close()
	db.Exec("CREATE DATABASE ticket_booking_test")
}

func runInitSQL() {
	// Connect to the test database and run init.sql
	db, err := database.ConnectToPostgres("ticket_booking_test") // Assuming a function to connect to a specific db
	if err != nil {
		log.Fatalf("Could not connect to test db to run init.sql: %v", err)
	}
	defer db.Close()

	sqlFile, err := os.ReadFile("../database/init.sql")
	if err != nil {
		log.Fatalf("Could not read init.sql: %v", err)
	}

	_, err = db.Exec(string(sqlFile))
	if err != nil {
		log.Fatalf("Could not execute init.sql: %v", err)
	}
}

func clearTestDB() {
	// Clear tables before each test
	database.DB.Exec("DELETE FROM users")
	database.DB.Exec("DELETE FROM trips")
	database.DB.Exec("DELETE FROM bookings")
}

func TestSignupHandler(t *testing.T) {
	setupTestDB()

	user := models.User{
		Name:     "Test User",
		Email:    "test@example.com",
		Password: "password123",
	}
	jsonUser, _ := json.Marshal(user)

	req, err := http.NewRequest("POST", "/api/auth/signup", bytes.NewBuffer(jsonUser))
	if err != nil {
		t.Fatal(err)
	}
	req.Header.Set("Content-Type", "application/json")

	rr := httptest.NewRecorder()
	r := mux.NewRouter()
	r.HandleFunc("/api/auth/signup", handlers.SignupHandler).Methods("POST")
	r.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}

	var responseMap map[string]string
	err = json.Unmarshal(rr.Body.Bytes(), &responseMap)
	if err != nil {
		t.Fatalf("could not unmarshal response: %v", err)
	}

	if responseMap["message"] != "User registered successfully" {
		t.Errorf("handler returned unexpected message: got %v want %v",
			responseMap["message"], "User registered successfully")
	}

	// Test duplicate registration
	rr = httptest.NewRecorder()
	req, _ = http.NewRequest("POST", "/api/auth/signup", bytes.NewBuffer(jsonUser))
	req.Header.Set("Content-Type", "application/json")
	r.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusBadRequest {
		t.Errorf("handler returned wrong status code for duplicate: got %v want %v",
			status, http.StatusBadRequest)
	}
}

func TestLoginHandler(t *testing.T) {
	setupTestDB()

	// First, register a user to log in with
	user := models.User{
		Name:     "Login User",
		Email:    "login@example.com",
		Password: "loginpassword",
	}
	jsonUser, _ := json.Marshal(user)

	req, _ := http.NewRequest("POST", "/api/auth/signup", bytes.NewBuffer(jsonUser))
	req.Header.Set("Content-Type", "application/json")
	rr := httptest.NewRecorder()
	r := mux.NewRouter()
	r.HandleFunc("/api/auth/signup", handlers.SignupHandler).Methods("POST")
	r.ServeHTTP(rr, req)

	// Now, attempt to log in
	loginCreds := map[string]string{
		"email":    "login@example.com",
		"password": "loginpassword",
	}
	jsonCreds, _ := json.Marshal(loginCreds)

	req, err := http.NewRequest("POST", "/api/auth/login", bytes.NewBuffer(jsonCreds))
	if err != nil {
		t.Fatal(err)
	}
	req.Header.Set("Content-Type", "application/json")

	rr = httptest.NewRecorder()
	r.HandleFunc("/api/auth/login", handlers.LoginHandler).Methods("POST")
	r.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}

	var responseMap map[string]string
	err = json.Unmarshal(rr.Body.Bytes(), &responseMap)
	if err != nil {
		t.Fatalf("could not unmarshal response: %v", err)
	}

	if _, ok := responseMap["token"]; !ok {
		t.Errorf("expected token in response, got %v", rr.Body.String())
	}

	// Test with incorrect password
	loginCreds["password"] = "wrongpassword"
	jsonCreds, _ = json.Marshal(loginCreds)
	req, _ = http.NewRequest("POST", "/api/auth/login", bytes.NewBuffer(jsonCreds))
	req.Header.Set("Content-Type", "application/json")
	rr = httptest.NewRecorder()
	r.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusUnauthorized {
		t.Errorf("handler returned wrong status code for incorrect password: got %v want %v",
			status, http.StatusUnauthorized)
	}

	// Test with non-existent user
	loginCreds["email"] = "nonexistent@example.com"
	loginCreds["password"] = "anypassword"
	jsonCreds, _ = json.Marshal(loginCreds)
	req, _ = http.NewRequest("POST", "/api/auth/login", bytes.NewBuffer(jsonCreds))
	req.Header.Set("Content-Type", "application/json")
	rr = httptest.NewRecorder()
	r.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusUnauthorized {
		t.Errorf("handler returned wrong status code for non-existent user: got %v want %v",
			status, http.StatusUnauthorized)
	}
}

func TestSearchTripsHandler(t *testing.T) {
	setupTestDB()

	// Insert some dummy trip data
	trip1 := models.Trip{
		From:           "Addis Ababa",
		To:             "Adama",
		Date:           "2025-08-20",
		Time:           "10:00:00",
		Price:          100.0,
		SeatsAvailable: 50,
		Seats:          []string{"A1", "A2", "A3"},
	}
	trip2 := models.Trip{
		From:           "Addis Ababa",
		To:             "Hawassa",
		Date:           "2025-08-20",
		Time:           "12:00:00",
		Price:          200.0,
		SeatsAvailable: 40,
		Seats:          []string{"B1", "B2", "B3"},
	}
	trip3 := models.Trip{
		From:           "Adama",
		To:             "Addis Ababa",
		Date:           "2025-08-21",
		Time:           "14:00:00",
		Price:          150.0,
		SeatsAvailable: 30,
		Seats:          []string{"C1", "C2", "C3"},
	}
	database.CreateTrip(trip1)
	database.CreateTrip(trip2)
	database.CreateTrip(trip3)

	// Test case 1: Search with 'from' and 'to'
	req, err := http.NewRequest("GET", "/api/trips/search?from=Addis Ababa&to=Adama&date=2025-08-20", nil)
	if err != nil {
		t.Fatal(err)
	}
	rr := httptest.NewRecorder()
	r := mux.NewRouter()
	r.HandleFunc("/api/trips/search", handlers.SearchTripsHandler).Methods("GET")
	r.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}

	var trips []models.Trip
	err = json.Unmarshal(rr.Body.Bytes(), &trips)
	if err != nil {
		t.Fatalf("could not unmarshal response: %v", err)
	}

	if len(trips) != 1 {
		t.Errorf("expected 1 trip, got %d", len(trips))
	}
	if trips[0].From != "Addis Ababa" || trips[0].To != "Adama" {
		t.Errorf("expected trip from Addis Ababa to Adama, got %s to %s", trips[0].From, trips[0].To)
	}

	// Test case 2: Search with no results
	req, err = http.NewRequest("GET", "/api/trips/search?from=NonExistent&to=Route&date=2025-08-20", nil)
	if err != nil {
		t.Fatal(err)
	}
	rr = httptest.NewRecorder()
	r.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}

	err = json.Unmarshal(rr.Body.Bytes(), &trips)
	if err != nil {
		t.Fatalf("could not unmarshal response: %v", err)
	}

	if len(trips) != 0 {
		t.Errorf("expected 0 trips, got %d", len(trips))
	}

	// Test case 3: Search without date
	req, err = http.NewRequest("GET", "/api/trips/search?from=Addis Ababa&to=Adama", nil)
	if err != nil {
		t.Fatal(err)
	}
	rr = httptest.NewRecorder()
	r.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}

	err = json.Unmarshal(rr.Body.Bytes(), &trips)
	if err != nil {
		t.Fatalf("could not unmarshal response: %v", err)
	}

	if len(trips) != 1 {
		t.Errorf("expected 1 trip, got %d", len(trips))
	}
}

func TestGetTripByIDHandler(t *testing.T) {
	setupTestDB()

	// Insert a dummy trip
	trip := models.Trip{
		From:           "Addis Ababa",
		To:             "Adama",
		Date:           "2025-08-20",
		Time:           "10:00:00",
		Price:          100.0,
		SeatsAvailable: 50,
		Seats:          []string{"A1", "A2", "A3"},
	}
	createdTrip, err := database.CreateTrip(trip)
	if err != nil {
		t.Fatalf("Failed to create trip: %v", err)
	}

	// Test case 1: Get existing trip by ID
	req, err := http.NewRequest("GET", "/api/trips/"+strconv.Itoa(createdTrip.ID), nil)
	if err != nil {
		t.Fatal(err)
	}
	rr := httptest.NewRecorder()
	r := mux.NewRouter()
	r.HandleFunc("/api/trips/{id}", handlers.GetTripByIDHandler).Methods("GET")
	r.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}

	var fetchedTrip models.Trip
	err = json.Unmarshal(rr.Body.Bytes(), &fetchedTrip)
	if err != nil {
		t.Fatalf("could not unmarshal response: %v", err)
	}

	if fetchedTrip.ID != createdTrip.ID || fetchedTrip.From != createdTrip.From {
		t.Errorf("expected trip %v, got %v", createdTrip, fetchedTrip)
	}

	// Test case 2: Get non-existent trip by ID
	req, err = http.NewRequest("GET", "/api/trips/9999", nil)
	if err != nil {
		t.Fatal(err)
	}
	rr = httptest.NewRecorder()
	r.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusNotFound {
		t.Errorf("handler returned wrong status code for non-existent trip: got %v want %v",
			status, http.StatusNotFound)
	}
}

func TestCreateBookingHandler(t *testing.T) {
	setupTestDB()

	// 1. Create a user
	user := models.User{
		Name:     "Booking User",
		Email:    "booking@example.com",
		Password: "bookingpassword",
	}
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	user.Password = string(hashedPassword)
	userID, err := database.CreateUser(user)
	if err != nil {
		t.Fatalf("Failed to create user: %v", err)
	}
	user.ID = userID

	// 2. Create a trip
	trip := models.Trip{
		From:           "Addis Ababa",
		To:             "Adama",
		Date:           "2025-09-01",
		Time:           "10:00:00",
		Price:          100.0,
		SeatsAvailable: 3,
		Seats:          []string{"A1", "A2", "A3", "A4", "A5"},
	}
	createdTrip, err := database.CreateTrip(trip)
	if err != nil {
		t.Fatalf("Failed to create trip: %v", err)
	}

	// 3. Generate a JWT token for the user
	tokenString, err := generateTestToken(user.Email)
	if err != nil {
		t.Fatalf("Failed to create token: %v", err)
	}

	// 4. Create a booking payload
	booking := models.Booking{
		TripID: createdTrip.ID,
		Seats:  []string{"A1", "A2"},
	}
	jsonBooking, _ := json.Marshal(booking)

	// Test case 1: Successful booking
	req, err := http.NewRequest("POST", "/api/bookings", bytes.NewBuffer(jsonBooking))
	if err != nil {
		t.Fatal(err)
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+tokenString)

	rr := httptest.NewRecorder()
	r := mux.NewRouter()
	r.Handle("/api/bookings", auth.Middleware(http.HandlerFunc(handlers.CreateBookingHandler))).Methods("POST")
	r.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}

	var responseMap map[string]string
	err = json.Unmarshal(rr.Body.Bytes(), &responseMap)
	if err != nil {
		t.Fatalf("could not unmarshal response: %v", err)
	}

	if responseMap["message"] != "Booking created successfully" {
		t.Errorf("handler returned unexpected message: got %v want %v",
			responseMap["message"], "Booking created successfully")
	}

	// Verify trip seats updated
	updatedTrip, err := database.GetTripByID(createdTrip.ID)
	if err != nil {
		t.Fatalf("Failed to get updated trip: %v", err)
	}
	if updatedTrip.SeatsAvailable != 1 {
		t.Errorf("expected available seats to be 1, got %d", updatedTrip.SeatsAvailable)
	}

	// Test case 2: Booking with invalid trip ID
	booking.TripID = 9999
	jsonBooking, _ = json.Marshal(booking)
	req, err = http.NewRequest("POST", "/api/bookings", bytes.NewBuffer(jsonBooking))
	if err != nil {
		t.Fatal(err)
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+tokenString)
	rr = httptest.NewRecorder()
	r.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusInternalServerError {
		t.Errorf("handler returned wrong status code for invalid trip ID: got %v want %v",
			status, http.StatusInternalServerError)
	}

	// Test case 3: Unauthorized access (no token)
	req, err = http.NewRequest("POST", "/api/bookings", bytes.NewBuffer(jsonBooking))
	if err != nil {
		t.Fatal(err)
	}
	req.Header.Set("Content-Type", "application/json")
	rr = httptest.NewRecorder()
	r.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusUnauthorized {
		t.Errorf("handler returned wrong status code for unauthorized access: got %v want %v",
			status, http.StatusUnauthorized)
	}
}

func TestGetProfileHandler(t *testing.T) {
	setupTestDB()

	// 1. Create a user
	user := models.User{
		Name:     "Profile User",
		Email:    "profile@example.com",
		Password: "profilepassword",
	}
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	user.Password = string(hashedPassword)
	userID, err := database.CreateUser(user)
	if err != nil {
		t.Fatalf("Failed to create user: %v", err)
	}
	user.ID = userID

	// 2. Create some bookings for the user
	trip1 := models.Trip{
		From:           "Addis Ababa",
		To:             "Adama",
		Date:           "2025-09-01",
		Time:           "10:00:00",
		Price:          100.0,
		SeatsAvailable: 50,
		Seats:          []string{"A1", "A2"},
	}
	createdTrip1, _ := database.CreateTrip(trip1)

	booking1 := models.Booking{
		UserID: user.ID,
		TripID: createdTrip1.ID,
		Seats:  []string{"A1"},
	}
	database.CreateBooking(booking1)

	// 3. Generate a JWT token for the user
	tokenString, err := generateTestToken(user.Email)
	if err != nil {
		t.Fatalf("Failed to create token: %v", err)
	}

	// Test case 1: Successful profile retrieval
	req, err := http.NewRequest("GET", "/api/profile", nil)
	if err != nil {
		t.Fatal(err)
	}
	req.Header.Set("Authorization", "Bearer "+tokenString)

	rr := httptest.NewRecorder()
	r := mux.NewRouter()
	r.Handle("/api/profile", auth.Middleware(http.HandlerFunc(handlers.GetProfileHandler))).Methods("GET")
	r.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}

	var response struct {
		models.User
		Bookings []models.Booking `json:"bookings"`
	}
	err = json.Unmarshal(rr.Body.Bytes(), &response)
	if err != nil {
		t.Fatalf("could not unmarshal response: %v", err)
	}

	if response.Email != user.Email {
		t.Errorf("expected user email %s, got %s", user.Email, response.Email)
	}
	if len(response.Bookings) != 1 {
		t.Errorf("expected 1 booking, got %d", len(response.Bookings))
	}

	// Test case 2: Unauthorized access (no token)
	req, err = http.NewRequest("GET", "/api/profile", nil)
	if err != nil {
		t.Fatal(err)
	}
	rr = httptest.NewRecorder()
	r.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusUnauthorized {
		t.Errorf("handler returned wrong status code for unauthorized access: got %v want %v",
			status, http.StatusUnauthorized)
	}
}
