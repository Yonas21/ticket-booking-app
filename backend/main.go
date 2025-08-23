package main

import (
	"context"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"ticket-booking-app/backend/auth"
	"ticket-booking-app/backend/config"
	"ticket-booking-app/backend/database"
	"ticket-booking-app/backend/handlers"
	"ticket-booking-app/backend/middleware"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
	"github.com/sirupsen/logrus"
)

func main() {
	// Initialize logger
	logger := logrus.New()
	logger.SetFormatter(&logrus.JSONFormatter{})
	logger.SetLevel(logrus.InfoLevel)

	// Load configuration
	if err := config.LoadConfig(); err != nil {
		logger.Fatal("Failed to load configuration:", err)
	}

	// Initialize database
	if err := database.InitDB(); err != nil {
		logger.Fatal("Failed to initialize database:", err)
	}
	defer database.CloseDB()

	// Create router
	r := mux.NewRouter()

	// Apply middleware
	r.Use(middleware.LoggingMiddleware)

	// API routes
	api := r.PathPrefix("/api").Subrouter()

	// Auth routes (no authentication required)
	authRoutes := api.PathPrefix("/auth").Subrouter()
	authRoutes.HandleFunc("/signup", handlers.SignupHandler).Methods("POST")
	authRoutes.HandleFunc("/login", handlers.LoginHandler).Methods("POST")

	// Public routes (no authentication required)
	api.HandleFunc("/trips/search", handlers.SearchTripsHandler).Methods("GET")
	api.HandleFunc("/trips/{id}", handlers.GetTripByIDHandler).Methods("GET")

	// Protected routes (authentication required)
	protectedRoutes := api.PathPrefix("/").Subrouter()
	protectedRoutes.Use(auth.Middleware)

	// Booking routes
	protectedRoutes.HandleFunc("/bookings", handlers.CreateBookingHandler).Methods("POST")
	protectedRoutes.HandleFunc("/profile", handlers.GetProfileHandler).Methods("GET")

	// CORS configuration
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000", "http://localhost:5173", "https://yourdomain.com"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Authorization", "Content-Type", "X-Requested-With"},
		AllowCredentials: true,
		MaxAge:           86400, // 24 hours
	})

	// Create HTTP server
	server := &http.Server{
		Addr:         ":" + config.GlobalConfig.Server.Port,
		Handler:      c.Handler(r),
		ReadTimeout:  config.GlobalConfig.Server.ReadTimeout,
		WriteTimeout: config.GlobalConfig.Server.WriteTimeout,
		IdleTimeout:  config.GlobalConfig.Server.IdleTimeout,
	}

	// Start server in a goroutine
	go func() {
		logger.Infof("Server starting on port %s...", config.GlobalConfig.Server.Port)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			logger.Fatal("Server failed to start:", err)
		}
	}()

	// Wait for interrupt signal to gracefully shutdown the server
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	logger.Info("Shutting down server...")

	// Create a deadline for server shutdown
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	// Attempt graceful shutdown
	if err := server.Shutdown(ctx); err != nil {
		logger.Fatal("Server forced to shutdown:", err)
	}

	logger.Info("Server exited")
}
