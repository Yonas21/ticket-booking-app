package config

import (
	"os"
	"time"

	"github.com/joho/godotenv"
)

type ServerConfig struct {
	Port         string
	Host         string
	ReadTimeout  time.Duration
	WriteTimeout time.Duration
	IdleTimeout  time.Duration
}

type DatabaseConfig struct {
	Host     string
	Port     string
	User     string
	Password string
	Name     string
	SSLMode  string
}

type JWTConfig struct {
	SecretKey  string
	Expiration time.Duration
}

type CorsConfig struct {
	AllowedOrigins []string
	AllowedMethods []string
	AllowedHeaders []string
}

type AppConfig struct {
	Server   ServerConfig
	Database DatabaseConfig
	JWT      JWTConfig
	CORS     CorsConfig
	Environment string
}

var GlobalConfig *AppConfig

func LoadConfig() error {
	// Load .env file if it exists
	godotenv.Load()

	// Set default values
	GlobalConfig = &AppConfig{
		Server: ServerConfig{
			Port:         getEnv("PORT", "8080"),
			Host:         getEnv("HOST", "localhost"),
			ReadTimeout:  getDurationEnv("READ_TIMEOUT", 30*time.Second),
			WriteTimeout: getDurationEnv("WRITE_TIMEOUT", 30*time.Second),
			IdleTimeout:  getDurationEnv("IDLE_TIMEOUT", 60*time.Second),
		},
		Database: DatabaseConfig{
			Host:     getEnv("DB_HOST", "localhost"),
			Port:     getEnv("DB_PORT", "5432"),
			User:     getEnv("DB_USER", "postgres"),
			Password: getEnv("DB_PASSWORD", ""),
			Name:     getEnv("DB_NAME", "bus_booking"),
			SSLMode:  getEnv("DB_SSLMODE", "disable"),
		},
		JWT: JWTConfig{
			SecretKey:  getEnv("JWT_SECRET", "your-super-secret-jwt-key-change-in-production"),
			Expiration: getDurationEnv("JWT_EXPIRATION", 24*time.Hour),
		},
		CORS: CorsConfig{
			AllowedOrigins: getStringSliceEnv("CORS_ALLOWED_ORIGINS", []string{"http://localhost:3000", "http://localhost:5173"}),
			AllowedMethods: getStringSliceEnv("CORS_ALLOWED_METHODS", []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}),
			AllowedHeaders: getStringSliceEnv("CORS_ALLOWED_HEADERS", []string{"Authorization", "Content-Type", "X-Requested-With"}),
		},
		Environment: getEnv("ENVIRONMENT", "development"),
	}

	// Validate required environment variables
	if err := validateConfig(); err != nil {
		return err
	}

	return nil
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func getDurationEnv(key string, defaultValue time.Duration) time.Duration {
	if value := os.Getenv(key); value != "" {
		if duration, err := time.ParseDuration(value); err == nil {
			return duration
		}
	}
	return defaultValue
}

func getStringSliceEnv(key string, defaultValue []string) []string {
	if value := os.Getenv(key); value != "" {
		// Simple comma-separated values parsing
		// In production, you might want more sophisticated parsing
		return []string{value}
	}
	return defaultValue
}

func validateConfig() error {
	// Validate JWT secret
	if GlobalConfig.JWT.SecretKey == "your-super-secret-jwt-key-change-in-production" {
		// Log warning in development
		if GlobalConfig.Environment == "development" {
			println("WARNING: Using default JWT secret. Set JWT_SECRET environment variable in production.")
		}
	}

	// Validate database password
	if GlobalConfig.Database.Password == "" {
		println("WARNING: Database password not set. Set DB_PASSWORD environment variable.")
	}

	return nil
}

// GetDatabaseURL returns the database connection string
func GetDatabaseURL() string {
	return "postgres://" + GlobalConfig.Database.User + ":" + GlobalConfig.Database.Password + "@" + GlobalConfig.Database.Host + ":" + GlobalConfig.Database.Port + "/" + GlobalConfig.Database.Name + "?sslmode=" + GlobalConfig.Database.SSLMode
}

// IsProduction returns true if the environment is production
func IsProduction() bool {
	return GlobalConfig.Environment == "production"
}

// IsDevelopment returns true if the environment is development
func IsDevelopment() bool {
	return GlobalConfig.Environment == "development"
}

