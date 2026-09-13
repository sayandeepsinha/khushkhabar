package common

import (
	"context"
	"database/sql"
	"fmt"
	"strings"
	"time"

	_ "github.com/go-sql-driver/mysql"
)

// DBConfig holds the database connection configuration
type DBConfig struct {
	DSN             string
	MaxOpenConns    int
	MaxIdleConns    int
	ConnMaxLifetime time.Duration
	ConnectTimeout  time.Duration
}

// DefaultDBConfig provides standard connection pool parameters
func DefaultDBConfig(dsn string) DBConfig {
	return DBConfig{
		DSN:             dsn,
		MaxOpenConns:    25,
		MaxIdleConns:    10,
		ConnMaxLifetime: 15 * time.Minute,
		ConnectTimeout:  3 * time.Second,
	}
}

// ConnectMySQL opens and verifies a connection pool to MySQL
func ConnectMySQL(cfg DBConfig) (*sql.DB, error) {
	db, err := sql.Open("mysql", cfg.DSN)
	if err != nil {
		return nil, fmt.Errorf("failed to open mysql driver: %w", err)
	}

	db.SetMaxOpenConns(cfg.MaxOpenConns)
	db.SetMaxIdleConns(cfg.MaxIdleConns)
	db.SetConnMaxLifetime(cfg.ConnMaxLifetime)

	ctx, cancel := context.WithTimeout(context.Background(), cfg.ConnectTimeout)
	defer cancel()

	if err := db.PingContext(ctx); err != nil {
		_ = db.Close()

		// If error is due to unknown database, attempt to auto-create it
		if strings.Contains(err.Error(), "1049") || strings.Contains(strings.ToLower(err.Error()), "unknown database") {
			if autoErr := tryAutoCreateDatabase(cfg.DSN); autoErr == nil {
				// Retry connection now that database is created
				return ConnectMySQL(cfg)
			}
		}

		return nil, fmt.Errorf("mysql ping failed: %w", err)
	}

	return db, nil
}

func tryAutoCreateDatabase(dsn string) error {
	slashIdx := strings.LastIndex(dsn, "/")
	if slashIdx == -1 {
		return fmt.Errorf("invalid dsn format")
	}

	dbPart := dsn[slashIdx+1:]
	questionIdx := strings.Index(dbPart, "?")
	dbName := dbPart
	if questionIdx != -1 {
		dbName = dbPart[:questionIdx]
	}

	if dbName == "" {
		return fmt.Errorf("no db name specified")
	}

	// Base DSN without database name
	baseDSN := dsn[:slashIdx+1]
	if questionIdx != -1 {
		baseDSN += dbPart[questionIdx:]
	}

	adminDB, err := sql.Open("mysql", baseDSN)
	if err != nil {
		return err
	}
	defer adminDB.Close()

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	createSQL := fmt.Sprintf("CREATE DATABASE IF NOT EXISTS `%s` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;", dbName)
	_, err = adminDB.ExecContext(ctx, createSQL)
	return err
}
