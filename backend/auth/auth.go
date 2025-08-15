package auth

import (
    "context"
    "net/http"
    "strings"
    "ticket-booking-app/backend/config"

    "github.com/dgrijalva/jwt-go"
)

func Middleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        tokenString := r.Header.Get("Authorization")
        if tokenString == "" {
            http.Error(w, "Missing authorization header", http.StatusUnauthorized)
            return
        }

        tokenString = strings.Replace(tokenString, "Bearer ", "", 1)

        claims := &jwt.StandardClaims{}

        token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
            return config.JWTKey, nil
        })

        if err != nil {
            if err == jwt.ErrSignatureInvalid {
                http.Error(w, "Invalid token signature", http.StatusUnauthorized)
                return
            }
            http.Error(w, "Invalid token", http.StatusBadRequest)
            return
        }

        if !token.Valid {
            http.Error(w, "Invalid token", http.StatusUnauthorized)
            return
        }

        ctx := context.WithValue(r.Context(), "claims", claims)
        next.ServeHTTP(w, r.WithContext(ctx))
    })
}
