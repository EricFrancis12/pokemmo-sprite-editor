package main

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

const (
	DirNameSprites       string = "sprites"
	DirNameModdedSprites string = "modded-sprites"
)

const FileExtPng string = "png"

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
