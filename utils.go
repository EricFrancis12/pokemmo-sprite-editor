package main

import (
	"archive/zip"
	"fmt"
	"io"
	"io/fs"
	"os"
	"path/filepath"
	"strings"
)

type EntryFilterFunc func(e fs.DirEntry) bool

func copyToZipRecursively(
	zw *zip.Writer,
	inputDirPath string,
	outputDirPath string,
	zipDirName string,
	filters ...EntryFilterFunc,
) error {
	entries, err := os.ReadDir(inputDirPath)
	if err != nil {
		return err
	}

outerLoop:
	for _, entry := range entries {
		for _, ok := range filters {
			if !ok(entry) {
				continue outerLoop
			}
		}

		var (
			path             = filepath.Join(inputDirPath, entry.Name())
			innerZipFilePath = filepath.Join(zipDirName, entry.Name())
		)

		if !entry.IsDir() {
			file, err := os.Open(path)
			if err != nil {
				return err
			}
			defer file.Close()

			wr, err := zw.Create(innerZipFilePath)
			if err != nil {
				return err
			}
			if _, err := io.Copy(wr, file); err != nil {
				return err
			}
		} else {
			return copyToZipRecursively(zw, path, outputDirPath, innerZipFilePath, filters...)
		}
	}

	return nil
}

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

func InfoXmlFileName() string {
	return "info." + FileExtXml
}

func NewInfoXml() InfoXml {
	return InfoXml{
		Name:        ApplicationName,
		Version:     ApplicationVersion,
		Description: ApplicationDescription,
		Author:      ApplicationAuthor,
		Weblink:     ApplicationWeblink,
	}
}
