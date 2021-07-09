package main

import (
	"context"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// create a new context
	ctx := context.Background()

	// create a mongo client
	client, err := mongo.Connect(
		ctx,
		options.Client().ApplyURI(os.Getenv("MONGO_URI")),
	)
	if err != nil {
		log.Fatal(err)
	}
	dbs := client.Database("TweetBook")

	app := fiber.New()
	app.Use(cors.New())
	app.Static("/", "./public")

	// api := app.Group("/api")

	app.Get("/", func(c *fiber.Ctx) error {
		return c.Status(fiber.StatusOK).SendString("Hello World!")
	})

	app.Listen(":8000")
}
