package main

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

func (s Sprite) ID() (string, error) {
	base := filepath.Base(s.OrigPath)

	splitOnDot := strings.Split(base, ".")
	if ln := len(splitOnDot); ln < 2 {
		return "", fmt.Errorf("expected length or at least 2, but got %d for %s", ln, base)
	}

	parts := strings.Split(splitOnDot[0], "-")
	if ln := len(parts); ln < 1 {
		return "", fmt.Errorf("expected length of at least 1, but got %d for %s", ln, splitOnDot[0])
	}

	id := parts[0]
	return id, nil
}

func isSprite(filePath string) (bool, error) {
	file, err := os.Open(filePath)
	if err != nil {
		return false, err
	}

	ext := FileExt(file.Name())
	if ext != FileExtPng && ext != FileExtGif {
		return false, fmt.Errorf("unexpected file extension: %s", ext)
	}

	if _, err := DirPathToSpriteType(filepath.Dir(filePath)); err != nil {
		return false, err
	}

	return true, nil
}

func toSprite(filePath string) (Sprite, error) {
	ok, err := isSprite(filePath)
	if err != nil {
		return Sprite{}, err
	} else if !ok {
		return Sprite{}, fmt.Errorf("%s is not a valid sprite", filePath)
	}

	dirPath := filepath.Dir(filePath)
	st, err := DirPathToSpriteType(dirPath)
	if err != nil {
		return Sprite{}, err
	} else if st == nil {
		return Sprite{}, fmt.Errorf("unknown sprite type: %s", dirPath)
	}

	fileName := filepath.Base(filePath)
	imageData := ImageData{
		fileName:   fileName,
		spriteType: *st,
	}

	i, err := storage.GetOne(*st, fileName)
	if err == nil && i != nil {
		imageData.Hue = i.Hue
		imageData.Saturation = i.Saturation
	}

	return Sprite{
		FileName:   fileName,
		OrigPath:   filePath,
		Url:        spritefilePathToUrl(filePath),
		SpriteType: *st,
		ImageData:  imageData,
	}, nil
}

func spritefilePathToUrl(filePath string) string {
	url := strings.ReplaceAll(filePath, "\\", "/")
	url = strings.Replace(url, DirNameSprites, DirNameModdedSprites, 1)
	parts := strings.Split(url, DirNamePublic)
	return parts[len(parts)-1]
}
