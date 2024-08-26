package main

import "io/fs"

const (
	applicationAuthor      string = "Eric Francis"
	applicationDescription string = "PokeMMO Sprite Editor"
	applicationName        string = "PokeMMO Sprite Editor"
	applicationVersion     string = "1.0"
	applicationWeblink     string = "https://github.com/EricFrancis12/pokemmo-sprite-editor"
)

const fileMode fs.FileMode = fs.ModePerm

const (
	imageDataTableName      string = "IMAGE_DATA"
	imageDataDriverName     string = "sqlite3"
	imageDataDataSourceName string = "./data.db"
)

const (
	XmlVersion   string = "1.0"
	XmlEncoding  string = "UTF-8"
	XmlStanalone string = "no"
)
