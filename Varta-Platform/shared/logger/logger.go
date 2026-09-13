package logger

import (
	"fmt"
	"os"
	"path/filepath"
	"sync"
	"time"
)

var (
	mu      sync.Mutex
	logFile *os.File
)

const (
	logDir  = "logger"
	logName = "vartalog.log"
)

func getLogFile() (*os.File, error) {
	if logFile != nil {
		return logFile, nil
	}

	if err := os.MkdirAll(logDir, 0755); err != nil {
		return nil, err
	}

	f, err := os.OpenFile(filepath.Join(logDir, logName), os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0644)
	if err != nil {
		return nil, err
	}
	logFile = f
	return logFile, nil
}

func writeLog(level, format string, args ...any) {
	mu.Lock()
	defer mu.Unlock()

	f, err := getLogFile()
	if err != nil {
		return
	}

	timestamp := time.Now().Format("2006-01-02 15:04:05")
	var msg string
	if len(args) > 0 {
		msg = fmt.Sprintf(format, args...)
	} else {
		msg = format
	}

	entry := fmt.Sprintf("[%s] [%s] %s\n", timestamp, level, msg)
	_, _ = f.WriteString(entry)
}

// Info logs informational messages to logger/vartalog.log
func Info(format string, args ...any) {
	writeLog("INFO", format, args...)
}

// Error logs error messages to logger/vartalog.log
func Error(format string, args ...any) {
	writeLog("ERROR", format, args...)
}
