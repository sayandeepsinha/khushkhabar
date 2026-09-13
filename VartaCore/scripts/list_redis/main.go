package main

import (
	"context"
	"fmt"
	"log"

	"github.com/redis/go-redis/v9"
)

func main() {
	client := redis.NewClient(&redis.Options{
		Addr: "127.0.0.1:6379",
	})
	ctx := context.Background()

	keys, err := client.Keys(ctx, "*").Result()
	if err != nil {
		log.Fatalf("Error: %v", err)
	}

	fmt.Printf("Redis has %d keys:\n", len(keys))
	for _, k := range keys {
		valType, _ := client.Type(ctx, k).Result()
		ttl, _ := client.TTL(ctx, k).Result()
		fmt.Printf(" - %s (%s, TTL: %v)\n", k, valType, ttl)
	}
}
