package main

import (
	"fmt"
	"net/http"
	"strings"
)

type Initializer interface {
	Init() error
}

type FileLoader struct {
	http.Handler
}

type ImageData struct {
	fileName   string
	spriteType SpriteType
	Hue        int     `json:"hue"`
	Saturation float64 `json:"saturation"`
}

type Dir struct {
	Path    string   `json:"path"`
	Sprites []Sprite `json:"sprites"`
	Dirs    []Dir    `json:"dirs"`
}

type Sprite struct {
	FileName   string     `json:"fileName"`
	OrigPath   string     `json:"origPath"`
	Url        string     `json:"url"`
	SpriteType SpriteType `json:"spriteType"`
	ImageData  ImageData  `json:"imageData"`
}

type SpritesMap = map[string][]Sprite

type Tree struct {
	SpriteType SpriteType      `json:"spriteType"`
	Path       string          `json:"path"`
	SpritesMap SpritesMap      `json:"spritesMap"`
	Children   map[string]Tree `json:"children"`
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

const (
	ApplicationAuthor      string = "Eric Francis"
	ApplicationDescription string = "PokeMMO Sprite Editor"
	ApplicationName        string = "PokeMMO Sprite Editor"
	ApplicationVersion     string = "1.0"
	ApplicationWeblink     string = "https://github.com/EricFrancis12/pokemmo-sprite-editor"
)

const (
	DirNameSprites       string = "sprites"
	DirNameModdedSprites string = "modded-sprites"
	DirNameMod           string = "mod"
	DirNameFrontend      string = "frontend"
	DirNameDist          string = "dist"
	DirNamePublic        string = "public"
)

const (
	FileExtGif string = "gif"
	FileExtPng string = "png"
	FileExtXml string = "xml"
	FileExtTxt string = "txt"
)

const (
	FileNameGitignore string = ".gitignore"
	FileNameModZip    string = "pokemmo-sprite-editor.zip"
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
	SpriteTypeFollowSprites SpriteType = "followersprites"
	SpriteTypeItemIcons     SpriteType = "itemicons"
	SpriteTypeMonsterIcons  SpriteType = "monstericons"
)

var spriteTypes = []SpriteType{
	SpriteTypeBattlesprites,
	SpriteTypeFollowSprites,
	SpriteTypeItemIcons,
	SpriteTypeMonsterIcons,
}

func (st SpriteType) String() string {
	return string(st)
}
