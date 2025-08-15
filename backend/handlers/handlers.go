package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"ticket-booking-app/backend/config"
	"ticket-booking-app/backend/database"
	"ticket-booking-app/backend/models"

	"github.com/dgrijalva/jwt-go"
	"github.com/gorilla/mux"
	"golang.org/x/crypto/bcrypt"
)

func SignupHandler(w http.ResponseWriter, r *http.Request) {
	var user models.User
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Check if user already exists
	_, err = database.GetUserByEmail(user.Email)
	if err == nil {
		http.Error(w, "User already exists", http.StatusBadRequest)
		return
	} else if err != sql.ErrNoRows {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, "Failed to hash password", http.StatusInternalServerError)
		return
	}
	user.Password = string(hashedPassword)

	_, err = database.CreateUser(user)
	if err != nil {
		http.Error(w, "Failed to register user", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "User registered successfully"})
}

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	var creds models.User
	err := json.NewDecoder(r.Body).Decode(&creds)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	user, err := database.GetUserByEmail(creds.Email)
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "User not found", http.StatusUnauthorized)
		} else {
			http.Error(w, "Database error", http.StatusInternalServerError)
		}
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(creds.Password))
	if err != nil {
		http.Error(w, "Invalid password", http.StatusUnauthorized)
		return
	}

	// Create token
	expirationTime := time.Now().Add(5 * time.Minute)
	claims := &jwt.StandardClaims{
		Subject:   user.Email,
		ExpiresAt: expirationTime.Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(config.JWTKey)
	if err != nil {
		http.Error(w, "Failed to create token", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"token": tokenString, "name": user.Name})
}

func SearchTripsHandler(w http.ResponseWriter, r *http.Request) {
	from := r.URL.Query().Get("from")
	to := r.URL.Query().Get("to")
	date := r.URL.Query().Get("date")
	flexibleDateRange, _ := strconv.Atoi(r.URL.Query().Get("flexibleDateRange")) // Not used in DB query yet
	currency := r.URL.Query().Get("currency")                                    // Handled on frontend

	trips, err := database.SearchTrips(from, to, date, flexibleDateRange)
	if err != nil {
		http.Error(w, "Failed to search trips", http.StatusInternalServerError)
		return
	}

	// Currency conversion (mock) - still handled on frontend for now
	exchangeRates := map[string]float64{"USD": 1, "EUR": 0.92, "GBP": 0.79}
	rate, ok := exchangeRates[currency]
	if !ok {
		rate = 1
	}

	for i := range trips {
		trips[i].Price = trips[i].Price * rate
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(trips)
}

func GetTripByIDHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid trip ID", http.StatusBadRequest)
		return
	}

	trip, err := database.GetTripByID(id)
	if err != nil {
		if err == sql.ErrNoRows {
			http.NotFound(w, r)
		} else {
			http.Error(w, "Database error", http.StatusInternalServerError)
		}
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(trip)
}

func CreateBookingHandler(w http.ResponseWriter, r *http.Request) {
	var booking models.Booking
	err := json.NewDecoder(r.Body).Decode(&booking)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Get user from token
	claims := r.Context().Value("claims").(*jwt.StandardClaims)
	user, err := database.GetUserByEmail(claims.Subject)
	if err != nil {
		http.Error(w, "User not found", http.StatusUnauthorized)
		return
	}

	booking.UserID = user.ID
	bookingID, err := database.CreateBooking(booking)
	if err != nil {
		http.Error(w, "Failed to create booking", http.StatusInternalServerError)
		return
	}
	booking.ID = bookingID

	// Update trip seats
	trip, err := database.GetTripByID(booking.TripID)
	if err != nil {
		http.Error(w, "Trip not found for seat update", http.StatusInternalServerError)
		return
	}

	var newSeats []string
	for _, seat := range trip.Seats {
		isBooked := false
		for _, bookedSeat := range booking.Seats {
			if seat == bookedSeat {
				isBooked = true
				break
			}
		}
		if !isBooked {
			newSeats = append(newSeats, seat)
		}
	}

	err = database.UpdateTripSeats(trip.ID, newSeats, trip.SeatsAvailable-len(booking.Seats))
	if err != nil {
		http.Error(w, "Failed to update trip seats", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{"message": "Booking created successfully", "booking": booking})
}

func GetProfileHandler(w http.ResponseWriter, r *http.Request) {
	claims := r.Context().Value("claims").(*jwt.StandardClaims)
	user, bookings, err := database.GetUserProfile(claims.Subject)
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "User not found", http.StatusNotFound)
		} else {
			http.Error(w, "Database error", http.StatusInternalServerError)
		}
		return
	}

	// Don't send password hash
	user.Password = ""

	response := struct {
		models.User
		Bookings []models.Booking `json:"bookings"`
	}{
		User:     user,
		Bookings: bookings,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
