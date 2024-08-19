package main

import (
	"fmt"
	"strings"
)

type Initializer interface {
	Init() error
}

type ImageData struct {
	Hue        int     `json:"hue"`
	Saturation float64 `json:"saturation"`
}

type Sprite struct {
	OrigPath   string     `json:"origPath"`
	SpriteType SpriteType `json:"spriteType"`
	ImageData  ImageData  `json:"imageData"`
}

type Dir struct {
	Path    string   `json:"path"`
	Sprites []Sprite `json:"sprites"`
	Dirs    []Dir    `json:"dirs"`
}

type Tree struct {
	SpriteType SpriteType          `json:"spriteType"`
	Path       string              `json:"path"`
	SpritesMap map[string][]Sprite `json:"spritesMap"`
	Children   map[string]Tree     `json:"children"`
}

type FileSystem struct {
	RootPath string `json:"rootPath"`
}

type InfoXml struct {
	Name        string
	Version     string
	Description string
	Author      string
	Weblink     string
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

const (
	ApplicationAuthor      string = "https://github.com/EricFrancis12"
	ApplicationDescription string = "yes"
	ApplicationName        string = "PokeMMO Sprite Editor"
	ApplicationVersion     string = "1.0"
	ApplicationWeblink     string = "https://github.com/EricFrancis12/pokemmo-sprite-editor"
)

const (
	DirNameSprites       string = "sprites"
	DirNameModdedSprites string = "modded-sprites"
	DirNameMod           string = "mod"
)

const (
	FileExtGif string = "gif"
	FileExtPng string = "png"
	FileExtXml string = "xml"
)

const (
	fileNameGitignore string = ".gitignore"
	fileNameModZip    string = "mod.zip"
)

type Gender string

const (
	GenderFemale Gender = "f"
	GenderMale   Gender = "m"
	GenderBoth   Gender = "b"
)

const (
	IsShinyN string = "n"
	IsShinyS string = "s"
)

type SpriteType string

const (
	SpriteTypeBattlesprites SpriteType = "battlesprites"
	SpriteTypeFollowSprites SpriteType = "followsprites"
	SpriteTypeItemIcons     SpriteType = "itemicons"
	SpriteTypeMonsterIcons  SpriteType = "monstericons"
)
