package db

import "time"

type Message struct {
	ID        string    `json:"_id"`
	Text      string    `json:"text"`
	User      string    `json:"user"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
	V         int       `json:"__v"`
	Likes     []string  `json:"likes"`
}
