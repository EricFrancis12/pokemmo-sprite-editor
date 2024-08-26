package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/gorilla/mux"
)

func NewFileLoader() *FileLoader {
	router := new(mux.Router)
	addRoutes(router)
	return &FileLoader{
		Router: router,
	}
}

func (h *FileLoader) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	h.Router.ServeHTTP(w, r)
}

func addRoutes(router *mux.Router) {
	router.HandleFunc("/api/sprites", handleGetSpriteData).Methods("GET")
	router.HandleFunc("/api/sprites/{spriteType}/{fileName}", handleGetSprite).Methods("GET")
	router.HandleFunc("*", handleServeFile).Methods("GET")
}

func handleGetSpriteData(w http.ResponseWriter, r *http.Request) {
	sd, err := makeSpriteData()
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, ServerError{Error: "error getting sprite data: " + err.Error()})
		return
	}

	writeJSON(w, http.StatusOK, sd)
}

// Check if this sprite exists in the modded-sprites os file system, and if so serve it.
// If not, serve the original from the embedded file system.
func handleGetSprite(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Cache-Control", "no-store")

	spriteType := mux.Vars(r)["spriteType"]
	fileName := mux.Vars(r)["fileName"]

	filePath := "modded-sprites/" + spriteType + "/" + fileName
	fileData, err := os.ReadFile(filePath)
	if err != nil {
		fd, err := assets.ReadFile("frontend/dist/sprites/" + spriteType + "/" + fileName)
		if err != nil {
			w.WriteHeader(http.StatusNotFound)
		} else {
			fileData = fd
		}
	}

	w.Write(fileData)
}

// If the file exists in the os file system, serve it.
// If not check if it exists in the embedded file system, and if so serve it.
// Else, write bad request.
func handleServeFile(w http.ResponseWriter, r *http.Request) {
	requestedFilename := strings.TrimPrefix(r.URL.Path, "/")
	println("Requesting file:", requestedFilename)

	var fileData = make([]byte, 0)

	fileData, err := os.ReadFile(requestedFilename)
	if err != nil {
		fd, err := assets.ReadFile(requestedFilename)
		if err != nil {
			w.WriteHeader(http.StatusNotFound)
			w.Write([]byte(fmt.Sprintf("Could not load file %s", requestedFilename)))
		} else {
			fileData = fd
		}
	}

	w.Write(fileData)
}

func writeJSON(w http.ResponseWriter, status int, v any) error {
	w.Header().Set(HTTPHeaderContentType, ContentTypeApplicationJSON)
	w.WriteHeader(status)
	return json.NewEncoder(w).Encode(v)
}

func SegmentPath(path string) []string {
	return strings.Split(path, "/")
}
