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

type EntryFilterFunc func(entry fs.DirEntry) bool

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

func (ix InfoXml) String() string {
	lines := []string{
		fmt.Sprintf(
			`<?xml version="%s" encoding="%s" standalone="%s"?>`,
			XmlVersion,
			XmlEncoding,
			XmlStanalone,
		),
		fmt.Sprintf(
			`<resource author="%s" description="%s" name="%s" version="%s" weblink="%s"/>`,
			ix.Author,
			ix.Description,
			ix.Name,
			ix.Version,
			ix.Weblink,
		),
	}
	return strings.Join(lines, "\n")
}

func (ix InfoXml) Bytes() []byte {
	return []byte(ix.String())
}

type AtlasDataTxt struct{}

func (a AtlasDataTxt) String() string {
	str := "rows=4\n"
	str += "columns=4\n\n"

	str += "[00][01][02][03]\n"
	str += "[04][05][06][07]\n"
	str += "[08][09][10][11]\n"
	str += "[12][13][14][15]\n"

	str += "north=0,1,2,3\n"
	str += "south=12,13,14,15\n"
	str += "west=4,5,6,7\n"
	str += "east=8,9,10,11\n\n"

	return str
}

func (a AtlasDataTxt) Bytes() []byte {
	return []byte(a.String())
}

func NewInfoXml() InfoXml {
	return InfoXml{
		Name:        applicationName,
		Version:     applicationVersion,
		Description: applicationDescription,
		Author:      applicationAuthor,
		Weblink:     applicationWeblink,
	}
}

func InfoXmlFileName() string {
	return "info." + FileExtXml
}

func InfoXmlZipPath() string {
	return InfoXmlFileName()
}

func NewAtlasDataTxt() AtlasDataTxt {
	return AtlasDataTxt{}
}

func AtlasDataTxtFileName() string {
	return "atlasdata." + FileExtTxt
}

func AtlasDataTxtZipPath() string {
	return DirNameSprites + "/" + SpriteTypeFollowSprites.String() + "/" + AtlasDataTxtFileName()
}
