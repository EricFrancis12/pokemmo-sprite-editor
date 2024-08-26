package main

import (
	"database/sql"
	"io/fs"
	"net/http"

	"github.com/gorilla/mux"
)

type FileSystem interface {
	Open(name string) (fs.File, error)
	ReadDir(name string) ([]fs.DirEntry, error)
	ReadFile(name string) ([]byte, error)
}

type OSPkg struct{}

type FileLoader struct {
	http.Handler
	Router *mux.Router
}

type ImageData struct {
	fileName   string
	spriteType SpriteType
	Hue        int     `json:"hue"`
	Saturation float64 `json:"saturation"`
}

type ImageDataStorage struct {
	DriverName     string
	DataSourceName string
	Client         *sql.DB
}

type InfoXml struct {
	Name        string
	Version     string
	Description string
	Author      string
	Weblink     string
}

type ServerError struct {
	Error string `json:"error"`
}

type Sprite struct {
	ID         string     `json:"id"`
	Url        string     `json:"url"`
	SpriteType SpriteType `json:"spriteType"`
	FileName   string     `json:"fileName"`
	ImageData  ImageData  `json:"imageData"`
}

type SpritesMap map[SpriteType][]Sprite

type SpriteData struct {
	Data SpritesMap `json:"data"`
}

type SpriteGroup struct {
	ID      string   `json:"id"`
	Sprites []Sprite `json:"sprites"`
}

type SpriteGroupMap map[SpriteType][]SpriteGroup

type SpriteGroupData struct {
	Data SpriteGroupMap `json:"data"`
}

const (
	ContentTypeApplicationJSON string = "application/json"
)

const (
	DirNameData          string = "data"
	DirNameDist          string = "dist"
	DirNameFrontend      string = "frontend"
	DirNameMod           string = "mod"
	DirNameModdedSprites string = "modded-sprites"
	DirNamePublic        string = "public"
	DirNameSprites       string = "sprites"
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

const (
	HTTPHeaderContentType string = "Content-Type"
)

const (
	PathSegmentApi string = "api"
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
