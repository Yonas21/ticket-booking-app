package email

import (
	"bytes"
	"fmt"
	"html/template"
	"log"
	"net/smtp"

	"ticket-booking-app/backend/config"
	"ticket-booking-app/backend/models"
)

// SendBookingConfirmationEmail sends a booking confirmation email to the user.
func SendBookingConfirmationEmail(userEmail string, booking models.Booking, trip models.Trip) {
	// Sender and recipient
	from := config.SenderEmail
	to := []string{userEmail}

	// SMTP server configuration
	smtpHost := config.SMTPHost
	smtpPort := config.SMTPPort
	smtpUser := config.SMTPUser
	smtpPass := config.SMTPPass

	// Authentication
	auth := smtp.PlainAuth("", smtpUser, smtpPass, smtpHost)

	// Prepare email content
	subject := "Booking Confirmation for Your Trip!"

	// Use a template for the email body
	tmpl, err := template.New("confirmation").Parse(`
		<html>
		<body>
			<p>Dear {{.UserName}},</p>
			<p>Your booking has been confirmed!</p>
			<p><strong>Trip Details:</strong></p>
			<ul>
				<li>From: {{.TripFrom}}</li>
				<li>To: {{.TripTo}}</li>
				<li>Date: {{.TripDate}}</li>
				<li>Departure Time: {{.TripDepartureTime}}</li>
				<li>Arrival Time: {{.TripArrivalTime}}</li>
				<li>Bus Operator: {{.TripBusOperator}}</li>
				<li>Price: {{.TripPrice}}</li>
			</ul>
			<p><strong>Booking Details:</strong></p>
			<ul>
				<li>Booking ID: {{.BookingID}}</li>
				<li>Seats: {{.BookingSeats}}</li>
			</ul>
			<p>Thank you for booking with us!</p>
		</body>
		</html>
	`)
	if err != nil {
		log.Printf("Error parsing email template: %v", err)
		return
	}

	var body bytes.Buffer
	body.WriteString(fmt.Sprintf("Subject: %s\r\n", subject))
	body.WriteString("MIME-version: 1.0;\r\n")
	body.WriteString("Content-Type: text/html; charset=\"UTF-8\";\r\n\r\n")

	data := struct {
		UserName          string
		BookingID         int
		BookingSeats      []string
		TripFrom          string
		TripTo            string
		TripDate          string
		TripDepartureTime string
		TripArrivalTime  string
		TripBusOperator   string
		TripPrice         float64
	}{
		UserName:          userEmail, // Placeholder, ideally get actual user name
		BookingID:         booking.ID,
		BookingSeats:      booking.Seats,
		TripFrom:          trip.From,
		TripTo:            trip.To,
		TripDate:          trip.Date,
		TripDepartureTime: trip.DepartureTime,
		TripArrivalTime:   trip.ArrivalTime,
		TripBusOperator:   trip.BusOperator,
		TripPrice:         trip.Price,
	}

	err = tmpl.Execute(&body, data)
	if err != nil {
		log.Printf("Error executing email template: %v", err)
		return
	}

	// Send email
	err = smtp.SendMail(smtpHost+":"+smtpPort, auth, from, to, body.Bytes())
	if err != nil {
		log.Printf("Error sending email: %v", err)
		return
	}

	log.Printf("Booking confirmation email sent to %s for booking ID %d\n", userEmail, booking.ID)
}
