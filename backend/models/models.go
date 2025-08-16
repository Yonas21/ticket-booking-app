package models

type Review struct {
	ID       int    `json:"id"`
	Rating   int    `json:"rating"`
	Comment  string `json:"comment"`
	Reviewer string `json:"reviewer"`
}

type Trip struct {
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
	Seats             []string `json:"seats"`
	Amenities         []string `json:"amenities"`
	IntermediateStops []string `json:"intermediateStops"`
	Reviews           []Review `json:"reviews"`
}

type User struct {
    ID       int    `json:"id"`
    Name     string `json:"name"`
    Email    string `json:"email"`
    Password string `json:"password"`
}

type Booking struct {
    ID     int      `json:"id"`
    UserID int      `json:"userId"`
    TripID int      `json:"trip_id"`
    Seats  []string `json:"seats"`
}
