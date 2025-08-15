package models

type Trip struct {
    ID             int      `json:"id"`
    From           string   `json:"from"`
    To             string   `json:"to"`
    Date           string   `json:"date"`
    Time           string   `json:"time"`
    Price          float64  `json:"price"`
    Seats          []string `json:"seats"`
    SeatsAvailable int      `json:"seatsAvailable"`
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
