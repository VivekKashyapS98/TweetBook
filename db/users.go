package db

import "time"

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
