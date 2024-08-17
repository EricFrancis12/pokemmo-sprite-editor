package main

type Initializer interface {
	Init() error
}

type Sprite struct {
	OrigPath   string     `json:"origPath"`
	SpriteType SpriteType `json:"spriteType"`
}

type Dir struct {
	Path    string   `json:"path"`
	Sprites []Sprite `json:"sprites"`
	Dirs    []Dir    `json:"dirs"`
}

type Tree struct {
	Path     string          `json:"path"`
	Sprites  []Sprite        `json:"sprites"`
	Children map[string]Tree `json:"children"`
}

type FileSystem struct {
	RootPath string `json:"rootPath"`
}

const (
	DirNameSprites       string = "sprites"
	DirNameModdedSprites string = "modded-sprites"
)

type Gender string

const FileExtPng string = "png"

const (
	GenderFemale Gender = "f"
	GenderMale   Gender = "m"
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
