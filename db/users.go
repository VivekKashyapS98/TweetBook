package db

import (
	"context"
	"time"

	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	ID            string   `bson:"_id"`
	Messages      []string `bson:"messages"`
	Email         string   `bson:"email"`
	Password      string   `bson:"password"`
	Username      string   `bson:"username"`
	V             int      `bson:"__v"`
	Followers     []string `bson:"followers"`
	Following     []string `bson:"following"`
	Likes         []string `bson:"likes"`
	Bio           string   `bson:"bio"`
	ProfileImgURL string   `bson:"profileImgUrl"`
	Notifications []struct {
		Read    bool      `bson:"read"`
		ID      string    `bson:"_id"`
		Text    string    `bson:"text"`
		Message string    `bson:"message"`
		Date    time.Time `bson:"date"`
	} `bson:"notifications"`
}

type newUser struct {
	Username      string
	Email         string
	ProfileImgUrl string
	Password      string
}

func CreateUser(userData newUser, dbs *mongo.Database) (*mongo.InsertOneResult, error) {
	users := dbs.Collection("users")
	hashed, err := bcrypt.GenerateFromPassword([]byte(userData.Password), 10)
	if err != nil {
		return nil, err
	}

	res, err := users.InsertOne(context.TODO(), bson.M{
		"_id":      uuid.NewString(),
		"username": userData.Username,
		"email":    userData.Email,
		"password": hashed,
	})
	return res, nil
}
