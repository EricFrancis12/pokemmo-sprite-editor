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

var (
	fileNameExclustions                   = []string{FileNameGitignore}
	filterExcludedEntries EntryFilterFunc = func(e fs.DirEntry) bool {
		return !sliceIncludes(fileNameExclustions, e.Name())
	}
)

func ZipDirRecursively(zw *zip.Writer, sourceDirPath string, innerZipDirName string, filters ...EntryFilterFunc) error {
	entries, err := os.ReadDir(sourceDirPath)
	if err != nil {
		return err
	}

outerLoop:
	for _, entry := range entries {
		for _, filter := range filters {
			if !filter(entry) {
				continue outerLoop
			}
		}

		path := sourceDirPath + "/" + entry.Name()
		if entry.IsDir() {
			err := ZipDirRecursively(zw, path, innerZipDirName, filters...)
			if err != nil {
				return err
			}
		} else {
			splitOnSlash := strings.Split(sourceDirPath, "/")
			last := splitOnSlash[len(splitOnSlash)-1]
			err := copyToZipFile(zw, path, innerZipDirName+"/"+last)
			if err != nil {
				return err
			}
		}
	}

	return nil
}

func copyToZipFile(zw *zip.Writer, sourceFilePath string, innerZipDirName string) error {
	file, err := os.Open(sourceFilePath)
	if err != nil {
		return err
	}
	defer file.Close()

	wr, err := zw.Create(innerZipDirName + "/" + filepath.Base(file.Name()))
	if err != nil {
		return err
	}
	if _, err := io.Copy(wr, file); err != nil {
		return err
	}

	return nil
}

func writeToZipFile(zw *zip.Writer, fileName string, data []byte) error {
	wr, err := zw.Create(fileName)
	if err != nil {
		return err
	}

	if _, err := wr.Write(data); err != nil {
		return err
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

func sliceIncludes[T comparable](slice []T, t T) bool {
	for _, c := range slice {
		if c == t {
			return true
		}
	}
	return false
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
