package main

import (
	"fmt"
	"net/http"
	"os"
	"strings"
)

func NewFileLoader() *FileLoader {
	return &FileLoader{}
}

func (h *FileLoader) ServeHTTP(res http.ResponseWriter, req *http.Request) {
	requestedFilename := strings.TrimPrefix(req.URL.Path, "/")

	fileData, err := os.ReadFile(requestedFilename)
	if err != nil {
		spritePath := strings.Replace(requestedFilename, DirNameModdedSprites, DirNameSprites, 1)
		spritePath = DirNameFrontend + "/" + DirNameDist + "/" + spritePath

		fd, err := os.ReadFile(spritePath)
		if err != nil {
			res.WriteHeader(http.StatusBadRequest)
			res.Write([]byte(fmt.Sprintf("Could not load file %s", requestedFilename)))
		} else {
			fileData = fd
		}
	}

	res.Write(fileData)
}
