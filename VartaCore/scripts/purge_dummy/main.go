package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"

	_ "github.com/go-sql-driver/mysql"
	"github.com/redis/go-redis/v9"
)

func main() {
	dsn := "root:prince123@tcp(127.0.0.1:3306)/varta?parseTime=true&charset=utf8mb4"
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Fatalf("Failed to open db: %v", err)
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		log.Fatalf("Failed to ping MySQL: %v", err)
	}

	fmt.Println("Connected to MySQL successfully.")

	// Purge dummy articles
	res1, err := db.Exec("DELETE FROM articles WHERE id IN ('art-1', 'art-2', 'art-3') OR source_url LIKE '%example.com%'")
	if err != nil {
		log.Printf("Error deleting dummy articles: %v", err)
	} else {
		rows, _ := res1.RowsAffected()
		fmt.Printf("Deleted %d dummy articles from MySQL.\n", rows)
	}

	res2, err := db.Exec("DELETE FROM bookmarks WHERE article_id IN ('art-1', 'art-2', 'art-3')")
	if err != nil {
		log.Printf("Error deleting dummy bookmarks: %v", err)
	} else {
		rows, _ := res2.RowsAffected()
		fmt.Printf("Deleted %d dummy bookmarks from MySQL.\n", rows)
	}

	// Count remaining articles
	var count int
	_ = db.QueryRow("SELECT COUNT(*) FROM articles").Scan(&count)
	fmt.Printf("Total remaining real articles in MySQL: %d\n", count)

	// Flush Redis keys
	client := redis.NewClient(&redis.Options{
		Addr: "127.0.0.1:6379",
	})
	ctx := context.Background()
	if err := client.Ping(ctx).Err(); err == nil {
		_ = client.Del(ctx, "homepage:featured", "homepage:best")
		iter := client.Scan(ctx, 0, "articles:*", 0).Iterator()
		for iter.Next(ctx) {
			_ = client.Del(ctx, iter.Val())
		}
		fmt.Println("Flushed stale article keys from Redis cache.")
		_ = client.Close()
	} else {
		fmt.Printf("Redis ping note: %v\n", err)
	}
}
