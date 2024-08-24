package main

import "io/fs"

const fileMode fs.FileMode = fs.ModePerm

const (
	spritesDirPath       string = DirNameFrontend + "/" + DirNameDist + "/" + DirNameSprites
	moddedSpritesDirPath string = DirNameModdedSprites
	modDirPath           string = DirNameMod
)

const (
	imageDataTableName      string = "IMAGE_DATA"
	imageDataDriverName     string = "sqlite3"
	imageDataDataSourceName string = "./image_data.db"
)

const (
	XmlVersion   string = "1.0"
	XmlEncoding  string = "UTF-8"
	XmlStanalone string = "no"
)
