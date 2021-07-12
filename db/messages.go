package db

import (
	"context"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Message struct {
	ID        string    `bson:"_id"`
	Text      string    `bson:"text"`
	User      string    `bson:"user"`
	CreatedAt time.Time `bson:"createdAt"`
	UpdatedAt time.Time `bson:"updatedAt"`
	V         int       `bson:"__v"`
	Likes     []string  `bson:"likes"`
}

func GetAllMessages(dbs *mongo.Database) (*[]Message, error) {
	messages := dbs.Collection("messages")

	opts := options.Find().SetSort(bson.D{{"createdAt", 1}})

	cursor, err := messages.Find(context.TODO(), bson.D{}, opts)
	if err != nil {
		return nil, err
	}

	var tweets []Message
	if err = cursor.All(context.TODO(), &tweets); err != nil {
		log.Fatal(err)
	}
	return &tweets, nil
}

func GetMessage(id *string, dbs *mongo.Database) (*Message, error) {
	messages := dbs.Collection("messages")

	var message Message

	err := messages.FindOne(context.TODO(), bson.D{{"_id", id}}).Decode(&message)
	if err != nil {
		return nil, err
	}
	return &message, nil
}
