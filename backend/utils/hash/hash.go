package hash

import (
    "encoding/json"
    "io/ioutil"
    "log"

    "golang.org/x/crypto/bcrypt"
)

type User struct {
    ID       int    `json:"id"`
    Name     string `json:"name"`
    Email    string `json:"email"`
    Password string `json:"password"`
}

func HashUsersData() {
    file, err := ioutil.ReadFile("../../../src/data/users.json")
    if err != nil {
        log.Fatalf("Failed to read users.json: %v", err)
    }

    var users []User
    err = json.Unmarshal(file, &users)
    if err != nil {
        log.Fatalf("Failed to unmarshal users.json: %v", err)
    }

    for i := range users {
        hashedPassword, err := bcrypt.GenerateFromPassword([]byte(users[i].Password), bcrypt.DefaultCost)
        if err != nil {
            log.Fatalf("Failed to hash password: %v", err)
        }
        users[i].Password = string(hashedPassword)
    }

    file, err = json.MarshalIndent(users, "", "  ")
    if err != nil {
        log.Fatalf("Failed to marshal users: %v", err)
    }

    err = ioutil.WriteFile("../../../src/data/users.json", file, 0644)
    if err != nil {
        log.Fatalf("Failed to write users.json: %v", err)
    }
}
