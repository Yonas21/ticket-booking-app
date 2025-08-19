package config

import "os"

var JWTKey = []byte("my_secret_key")

var (
	SMTPHost    = getEnv("SMTP_HOST", "smtp.mailtrap.io") // Default for Mailtrap
	SMTPPort    = getEnv("SMTP_PORT", "2525")             // Default for Mailtrap
	SMTPUser    = getEnv("SMTP_USER", "")
	SMTPPass    = getEnv("SMTP_PASS", "")
	SenderEmail = getEnv("SENDER_EMAIL", "no-reply@busbooking.com")
)

func getEnv(key, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultValue
}
