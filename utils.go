package main

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

func DirPathToSpriteType(dirPath string) (*SpriteType, error) {
	var (
		dirName = filepath.Base(dirPath)
		st      SpriteType
	)
	switch dirName {
	case string(SpriteTypeBattlesprites):
		st = SpriteTypeBattlesprites
	case string(SpriteTypeFollowSprites):
		st = SpriteTypeFollowSprites
	case string(SpriteTypeItemIcons):
		st = SpriteTypeItemIcons
	case string(SpriteTypeMonsterIcons):
		st = SpriteTypeMonsterIcons
	}
	if &st != nil {
		return &st, nil
	}
	return nil, fmt.Errorf("unknown sprite type: %s", dirName)
}

func Exists(path string) bool {
	_, err := os.Stat(path)
	if os.IsNotExist(err) {
		return false
	}
	return err == nil
}

func FileExt(fileName string) string {
	parts := strings.Split(fileName, ".")
	return parts[len(parts)-1]
}
