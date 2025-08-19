package models

import (
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
)

var validate = validator.New()

// User represents a user in the system
type User struct {
	ID                int       `json:"id" db:"id"`
	Name              string    `json:"name" validate:"required,min=2,max=100"`
	Email             string    `json:"email" validate:"required,email"`
	Password          string    `json:"password,omitempty" validate:"required,min=6"`
	Phone             string    `json:"phone" validate:"omitempty,e164"`
	DateOfBirth       *time.Time `json:"dateOfBirth,omitempty"`
	PreferredLocations []string  `json:"preferredLocations,omitempty"`
	IsActive          bool      `json:"isActive" db:"is_active"`
	EmailVerified     bool      `json:"emailVerified" db:"email_verified"`
	PhoneVerified     bool      `json:"phoneVerified" db:"phone_verified"`
	CreatedAt         time.Time `json:"createdAt" db:"created_at"`
	UpdatedAt         time.Time `json:"updatedAt" db:"updated_at"`
	LastLoginAt       *time.Time `json:"lastLoginAt,omitempty" db:"last_login_at"`
}

// Validate validates the User struct
func (u *User) Validate() error {
	return validate.Struct(u)
}

// Review represents a review for a trip
type Review struct {
	ID        int       `json:"id" db:"id"`
	TripID    int       `json:"tripId" db:"trip_id"`
	UserID    int       `json:"userId" db:"user_id"`
	Rating    int       `json:"rating" validate:"required,min=1,max=5"`
	Comment   string    `json:"comment" validate:"required,min=10,max=500"`
	Reviewer  string    `json:"reviewer"`
	CreatedAt time.Time `json:"createdAt" db:"created_at"`
	UpdatedAt time.Time `json:"updatedAt" db:"updated_at"`
}

// Validate validates the Review struct
func (r *Review) Validate() error {
	return validate.Struct(r)
}

// Trip represents a bus trip
type Trip struct {
	ID                int       `json:"id" db:"id"`
	From              string    `json:"from" validate:"required"`
	To                string    `json:"to" validate:"required"`
	Date              string    `json:"date" validate:"required"`
	DepartureTime     string    `json:"departureTime" validate:"required"`
	ArrivalTime       string    `json:"arrivalTime" validate:"required"`
	Price             float64   `json:"price" validate:"required,min=0"`
	SeatsAvailable    int       `json:"seatsAvailable" db:"seats_available" validate:"required,min=0"`
	BusOperator       string    `json:"busOperator" db:"bus_operator" validate:"required"`
	Duration          string    `json:"duration" validate:"required"`
	Seats             []string  `json:"seats"`
	Amenities         []string  `json:"amenities"`
	IntermediateStops []string  `json:"intermediateStops" db:"intermediate_stops"`
	Reviews           []Review  `json:"reviews,omitempty"`
	BusType           string    `json:"busType" db:"bus_type"`
	BusNumber         string    `json:"busNumber" db:"bus_number"`
	DriverName        string    `json:"driverName" db:"driver_name"`
	Status            string    `json:"status" validate:"required,oneof=scheduled departed arrived cancelled"`
	CreatedAt         time.Time `json:"createdAt" db:"created_at"`
	UpdatedAt         time.Time `json:"updatedAt" db:"updated_at"`
}

// Validate validates the Trip struct
func (t *Trip) Validate() error {
	return validate.Struct(t)
}

// Booking represents a booking made by a user
type Booking struct {
	ID            int       `json:"id" db:"id"`
	UserID        int       `json:"userId" db:"user_id"`
	TripID        int       `json:"tripId" db:"trip_id"`
	BookingNumber string    `json:"bookingNumber" db:"booking_number"`
	Seats         []string  `json:"seats" validate:"required,min=1"`
	TotalAmount   float64   `json:"totalAmount" db:"total_amount" validate:"required,min=0"`
	Status        string    `json:"status" validate:"required,oneof=pending confirmed cancelled completed"`
	PaymentStatus string    `json:"paymentStatus" db:"payment_status" validate:"required,oneof=pending paid failed refunded"`
	PaymentMethod string    `json:"paymentMethod" db:"payment_method"`
	PassengerInfo []Passenger `json:"passengerInfo" db:"passenger_info"`
	CreatedAt     time.Time `json:"createdAt" db:"created_at"`
	UpdatedAt     time.Time `json:"updatedAt" db:"updated_at"`
	CancelledAt   *time.Time `json:"cancelledAt,omitempty" db:"cancelled_at"`
}

// Validate validates the Booking struct
func (b *Booking) Validate() error {
	return validate.Struct(b)
}

// Passenger represents passenger information
type Passenger struct {
	ID          int    `json:"id" db:"id"`
	BookingID   int    `json:"bookingId" db:"booking_id"`
	Name        string `json:"name" validate:"required,min=2,max=100"`
	Email       string `json:"email" validate:"required,email"`
	Phone       string `json:"phone" validate:"omitempty,e164"`
	DateOfBirth *time.Time `json:"dateOfBirth,omitempty" db:"date_of_birth"`
	Gender      string `json:"gender" validate:"omitempty,oneof=male female other"`
	SeatNumber  string `json:"seatNumber" db:"seat_number"`
	IDNumber    string `json:"idNumber" db:"id_number"`
	IDType      string `json:"idType" db:"id_type" validate:"omitempty,oneof=passport national_id driving_license"`
}

// Validate validates the Passenger struct
func (p *Passenger) Validate() error {
	return validate.Struct(p)
}

// Payment represents a payment transaction
type Payment struct {
	ID            int       `json:"id" db:"id"`
	BookingID     int       `json:"bookingId" db:"booking_id"`
	Amount        float64   `json:"amount" validate:"required,min=0"`
	Currency      string    `json:"currency" validate:"required,len=3"`
	Method        string    `json:"method" validate:"required,oneof=credit_card debit_card mobile_money bank_transfer cash"`
	Status        string    `json:"status" validate:"required,oneof=pending processing completed failed refunded"`
	TransactionID string    `json:"transactionId" db:"transaction_id"`
	Gateway       string    `json:"gateway"`
	GatewayRef    string    `json:"gatewayRef" db:"gateway_ref"`
	CreatedAt     time.Time `json:"createdAt" db:"created_at"`
	UpdatedAt     time.Time `json:"updatedAt" db:"updated_at"`
	CompletedAt   *time.Time `json:"completedAt,omitempty" db:"completed_at"`
}

// Validate validates the Payment struct
func (p *Payment) Validate() error {
	return validate.Struct(p)
}

// Notification represents a notification sent to a user
type Notification struct {
	ID        int       `json:"id" db:"id"`
	UserID    int       `json:"userId" db:"user_id"`
	Type      string    `json:"type" validate:"required,oneof=email sms push"`
	Title     string    `json:"title" validate:"required"`
	Message   string    `json:"message" validate:"required"`
	Status    string    `json:"status" validate:"required,oneof=pending sent failed"`
	Read      bool      `json:"read"`
	CreatedAt time.Time `json:"createdAt" db:"created_at"`
	ReadAt    *time.Time `json:"readAt,omitempty" db:"read_at"`
}

// Validate validates the Notification struct
func (n *Notification) Validate() error {
	return validate.Struct(n)
}

// SearchRequest represents a search request
type SearchRequest struct {
	From              string    `json:"from" validate:"required"`
	To                string    `json:"to" validate:"required"`
	DepartureDate     time.Time `json:"departureDate" validate:"required"`
	ReturnDate        *time.Time `json:"returnDate,omitempty"`
	Passengers        int       `json:"passengers" validate:"required,min=1,max=10"`
	Currency          string    `json:"currency" validate:"omitempty,len=3"`
	FlexibleDateRange int       `json:"flexibleDateRange" validate:"omitempty,min=0,max=7"`
}

// Validate validates the SearchRequest struct
func (s *SearchRequest) Validate() error {
	return validate.Struct(s)
}

// SearchResponse represents a search response
type SearchResponse struct {
	Trips       []Trip `json:"trips"`
	TotalCount  int    `json:"totalCount"`
	HasMore     bool   `json:"hasMore"`
	SearchID    string `json:"searchId"`
	GeneratedAt time.Time `json:"generatedAt"`
}

// GenerateBookingNumber generates a unique booking number
func GenerateBookingNumber() string {
	return "BK" + time.Now().Format("20060102") + "-" + uuid.New().String()[:8]
}

// APIResponse represents a standard API response
type APIResponse struct {
	Success bool        `json:"success"`
	Message string      `json:"message,omitempty"`
	Data    interface{} `json:"data,omitempty"`
	Error   string      `json:"error,omitempty"`
	Meta    *Meta       `json:"meta,omitempty"`
}

// Meta represents metadata for pagination
type Meta struct {
	Page       int `json:"page"`
	Limit      int `json:"limit"`
	Total      int `json:"total"`
	TotalPages int `json:"totalPages"`
}

// ErrorResponse represents an error response
type ErrorResponse struct {
	Success   bool   `json:"success"`
	Error     string `json:"error"`
	Message   string `json:"message"`
	Code      int    `json:"code"`
	Timestamp string `json:"timestamp"`
}
