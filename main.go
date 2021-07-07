package main

import (
	"context"
	"encoding/json"
	"log"
	"os"
	"time"

	"github.com/VivekKashyapS98/TweetBook/db"
	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(os.Getenv("MONGO_URI")))

	if err != nil {
		log.Fatal("Can't connect to MongoDB Atlas!...", err)
	}

	collection := client.Database("TweetBook").Collection("users")

	cur, err := collection.Find(context.Background(), bson.D{})
	if err != nil {
		log.Fatal(err)
	}
	defer cur.Close(context.Background())

	var results []db.User

	if err = cur.All(context.Background(), &results); err != nil {
		log.Fatal(err)
	}

	app := fiber.New()
	res, err := json.Marshal(results)
	if err != nil {
		log.Fatal(err)
	}

	log.Printf("%s", res)

	app.Get("/", func(c *fiber.Ctx) error {
		return c.Status(fiber.StatusOK).JSON(results)
	})

	app.Listen(":3000")
}
