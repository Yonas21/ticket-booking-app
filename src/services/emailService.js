// Email service for sending booking confirmations
// In a real application, this would integrate with services like SendGrid, Mailgun, or AWS SES

export const sendBookingConfirmationEmail = async (bookingDetails) => {
  try {
    // Simulate API call to email service
    const emailData = {
      to: bookingDetails.passengerEmail,
      subject: `Booking Confirmation - ${bookingDetails.from} to ${bookingDetails.to}`,
      template: 'booking-confirmation',
      data: {
        bookingId: bookingDetails.id,
        passengerName: bookingDetails.passengerName,
        from: bookingDetails.from,
        to: bookingDetails.to,
        date: bookingDetails.date,
        departureTime: bookingDetails.departureTime,
        seats: Array.isArray(bookingDetails.selectedSeats) 
          ? bookingDetails.selectedSeats.join(', ') 
          : bookingDetails.selectedSeat,
        numberOfPassengers: bookingDetails.numberOfPassengers || 1,
        totalPrice: bookingDetails.price,
        qrCodeUrl: `https://mock-ticket-validation.com/ticket/${bookingDetails.id}`,
        supportEmail: 'support@busticket.com',
        supportPhone: '+1 (800) 123-4567'
      }
    };

    // Process template variables (in a real app, this would be handled by the email service)
    const processedEmailData = {
      ...emailData,
      subject: emailData.subject,
      body: `Hello ${emailData.data.passengerName},

Your booking has been confirmed successfully. Here are your trip details:

Booking ID: ${emailData.data.bookingId}
From: ${emailData.data.from}
To: ${emailData.data.to}
Date: ${emailData.data.date}
Departure Time: ${emailData.data.departureTime}
Seats: ${emailData.data.seats}
Passengers: ${emailData.data.numberOfPassengers}
Total Price: $${emailData.data.totalPrice}

QR Code: ${emailData.data.qrCodeUrl}

Important Notes:
- Please arrive at least 30 minutes before departure
- Bring a valid ID for verification
- Keep this confirmation for your records

Need help? Contact us:
Email: ${emailData.data.supportEmail} | Phone: ${emailData.data.supportPhone}

© 2024 BusTicket. All rights reserved.`
    };

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In a real application, this would be an actual API call
    // const response = await fetch('/api/send-email', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(emailData)
    // });

    // For demo purposes, we'll just log the email data
    console.log('Email would be sent with data:', processedEmailData);

    return {
      success: true,
      message: 'Booking confirmation email sent successfully',
      emailId: `email_${Date.now()}`
    };
  } catch (error) {
    console.error('Failed to send email:', error);
    return {
      success: false,
      message: 'Failed to send booking confirmation email',
      error: error.message
    };
  }
};

export const sendTicketEmail = async (bookingDetails) => {
  try {
    const emailData = {
      to: bookingDetails.passengerEmail,
      subject: `Your Bus Ticket - ${bookingDetails.from} to ${bookingDetails.to}`,
      template: 'ticket-email',
      data: {
        bookingId: bookingDetails.id,
        passengerName: bookingDetails.passengerName,
        from: bookingDetails.from,
        to: bookingDetails.to,
        date: bookingDetails.date,
        departureTime: bookingDetails.departureTime,
        seats: Array.isArray(bookingDetails.selectedSeats) 
          ? bookingDetails.selectedSeats.join(', ') 
          : bookingDetails.selectedSeat,
        numberOfPassengers: bookingDetails.numberOfPassengers || 1,
        totalPrice: bookingDetails.price,
        qrCodeUrl: `https://mock-ticket-validation.com/ticket/${bookingDetails.id}`,
        downloadUrl: `https://mock-ticket-download.com/ticket/${bookingDetails.id}.pdf`,
        supportEmail: 'support@busticket.com',
        supportPhone: '+1 (800) 123-4567'
      }
    };

    // Process template variables for ticket email
    const processedEmailData = {
      ...emailData,
      subject: emailData.subject,
      body: `Hello ${emailData.data.passengerName},

Your ticket is ready! Here are your travel details:

Booking ID: ${emailData.data.bookingId}
From: ${emailData.data.from}
To: ${emailData.data.to}
Date: ${emailData.data.date}
Departure Time: ${emailData.data.departureTime}
Seats: ${emailData.data.seats}
Passengers: ${emailData.data.numberOfPassengers}
Total Price: $${emailData.data.totalPrice}

QR Code: ${emailData.data.qrCodeUrl}
Download PDF: ${emailData.data.downloadUrl}

Travel Tips:
- Arrive 30 minutes before departure
- Bring valid ID and this ticket
- Keep your ticket safe
- Download the PDF for offline access

Questions? Contact us:
Email: ${emailData.data.supportEmail} | Phone: ${emailData.data.supportPhone}

© 2024 BusTicket. All rights reserved.`
    };

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('Ticket email would be sent with data:', processedEmailData);

    return {
      success: true,
      message: 'Ticket email sent successfully',
      emailId: `ticket_${Date.now()}`
    };
  } catch (error) {
    console.error('Failed to send ticket email:', error);
    return {
      success: false,
      message: 'Failed to send ticket email',
      error: error.message
    };
  }
};

// Email templates (for reference)
export const emailTemplates = {
  'booking-confirmation': {
    subject: 'Booking Confirmation - {{from}} to {{to}}',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Booking Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3b82f6; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .booking-details { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; }
          .footer { background: #333; color: white; padding: 20px; text-align: center; }
          .qr-code { text-align: center; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Booking Confirmation</h1>
            <p>Thank you for booking with BusTicket!</p>
          </div>
          
          <div class="content">
            <h2>Hello {{passengerName}},</h2>
            <p>Your booking has been confirmed successfully. Here are your trip details:</p>
            
            <div class="booking-details">
              <h3>Trip Details</h3>
              <p><strong>Booking ID:</strong> {{bookingId}}</p>
              <p><strong>From:</strong> {{from}}</p>
              <p><strong>To:</strong> {{to}}</p>
              <p><strong>Date:</strong> {{date}}</p>
              <p><strong>Departure Time:</strong> {{departureTime}}</p>
              <p><strong>Seats:</strong> {{seats}}</p>
              <p><strong>Passengers:</strong> {{numberOfPassengers}}</p>
              <p><strong>Total Price:</strong> {{totalPrice}}</p>
            </div>
            
            <div class="qr-code">
              <p><strong>Your QR Code:</strong></p>
              <p>Scan this code at boarding: {{qrCodeUrl}}</p>
            </div>
            
            <p><strong>Important Notes:</strong></p>
            <ul>
              <li>Please arrive at least 30 minutes before departure</li>
              <li>Bring a valid ID for verification</li>
              <li>Keep this confirmation for your records</li>
            </ul>
          </div>
          
          <div class="footer">
            <p>Need help? Contact us:</p>
            <p>Email: {{supportEmail}} | Phone: {{supportPhone}}</p>
            <p>&copy; 2024 BusTicket. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  },
  'ticket-email': {
    subject: 'Your Bus Ticket - {{from}} to {{to}}',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Your Bus Ticket</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3b82f6; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .ticket { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; border: 2px solid #3b82f6; }
          .footer { background: #333; color: white; padding: 20px; text-align: center; }
          .download-btn { background: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Your Bus Ticket</h1>
            <p>Ready for your journey!</p>
          </div>
          
          <div class="content">
            <h2>Hello {{passengerName}},</h2>
            <p>Your ticket is ready! Here are your travel details:</p>
            
            <div class="ticket">
              <h3>Bus Ticket</h3>
              <p><strong>Booking ID:</strong> {{bookingId}}</p>
              <p><strong>From:</strong> {{from}}</p>
              <p><strong>To:</strong> {{to}}</p>
              <p><strong>Date:</strong> {{date}}</p>
              <p><strong>Departure Time:</strong> {{departureTime}}</p>
              <p><strong>Seats:</strong> {{seats}}</p>
              <p><strong>Passengers:</strong> {{numberOfPassengers}}</p>
              <p><strong>Total Price:</strong> {{totalPrice}}</p>
              
              <div style="text-align: center; margin: 20px 0;">
                <a href="{{downloadUrl}}" class="download-btn">Download PDF Ticket</a>
              </div>
            </div>
            
            <p><strong>QR Code:</strong> {{qrCodeUrl}}</p>
            
            <p><strong>Travel Tips:</strong></p>
            <ul>
              <li>Arrive 30 minutes before departure</li>
              <li>Bring valid ID and this ticket</li>
              <li>Keep your ticket safe</li>
              <li>Download the PDF for offline access</li>
            </ul>
          </div>
          
          <div class="footer">
            <p>Questions? Contact us:</p>
            <p>Email: {{supportEmail}} | Phone: {{supportPhone}}</p>
            <p>&copy; 2024 BusTicket. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }
};
