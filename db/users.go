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
	username      string
	email         string
	profileImgUrl string
	password      string
}

type updateUser struct {
	id            string
	bio           string
	profileImgUrl string
}

func CreateUser(userData *newUser, dbs *mongo.Database) (*mongo.InsertOneResult, error) {
	users := dbs.Collection("users")
	hashed, err := bcrypt.GenerateFromPassword([]byte(userData.password), 10)
	if err != nil {
		return nil, err
	}

	res, err := users.InsertOne(context.TODO(), bson.M{
		"_id":           uuid.NewString(),
		"username":      userData.username,
		"email":         userData.email,
		"profileImgUrl": userData.profileImgUrl,
		"password":      hashed,
	})
	if err != nil {
		return nil, err
	}
	return res, nil
}

func UpdateUser(userData *updateUser, dbs *mongo.Database) (*mongo.UpdateResult, error) {
	users := dbs.Collection("users")

	update := func() bson.M {
		if userData.bio != "" {
			return bson.M{"bio": userData.bio}
		} else if userData.profileImgUrl != "" {
			return bson.M{"profileImgUrl": userData.profileImgUrl}
		}
		return nil
	}

	res, err := users.UpdateByID(context.TODO(), userData.id, update)
	if err != nil {
		return nil, err
	}
	return res, nil
}

func GetUserByEmail(email *string, dbs *mongo.Database) (*User, error) {
	users := dbs.Collection("users")
	filter := bson.M{"email": bson.M{"$elemMatch": bson.M{"$eq": email}}}

	var user User

	err := users.FindOne(context.TODO(), filter).Decode(&user)
	if err != nil {
		return nil, err
	}

	return &user, err
}

func GetTweetsByUserId(id *string, dbs *mongo.Database) (*User, *[]Message, error) {
	users := dbs.Collection("users")
	filter := bson.M{"_id": bson.M{"$elemMatch": bson.M{"$eq": id}}}

	var user User

	err := users.FindOne(context.TODO(), filter).Decode(&user)
	if err != nil {
		return nil, nil, err
	}

	tweets := make([]Message, len(user.Messages))

	for _, message := range user.Messages {
		res, err := getMessagebyId(&message, dbs)
		if err != nil {
			return nil, nil, err
		}
		tweets = append(tweets, *res)
	}

	return &user, &tweets, err
}

func getMessagebyId(id *string, dbs *mongo.Database) (*Message, error) {
	message, err := GetMessage(id, dbs)
	if err != nil {
		return nil, err
	}
	return message, nil
}
