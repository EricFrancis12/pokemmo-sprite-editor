package main

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

func (s Sprite) ModdedPath() string {
	return strings.Replace(s.OrigPath, DirNameSprites, DirNameModdedSprites, 1)
}

func (s Sprite) Path() string {
	mp := s.ModdedPath()
	if Exists(mp) {
		return mp
	}
	return s.OrigPath
}

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
	if ext != SpriteFileExt {
		return false, fmt.Errorf("expected %s, but got %s", SpriteFileExt, ext)
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

	return Sprite{
		OrigPath:   filePath,
		SpriteType: *st,
	}, nil
}
