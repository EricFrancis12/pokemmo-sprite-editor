package main

import "io/fs"

const SpriteFileExt string = FileExtPng

const fileMode fs.FileMode = fs.ModePerm

const (
	spritesDirPath       string = DirNameFrontend + "/" + DirNamePublic + "/" + DirNameSprites
	moddedSpritesDirPath string = DirNameModdedSprites
	modDirPath           string = DirNameMod
)

const (
	XmlVersion   string = "1.0"
	XmlEncoding  string = "UTF-8"
	XmlStanalone string = "no"
)
