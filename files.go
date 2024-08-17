package main

import (
	"os"
	"path/filepath"
)

var (
	fsSprites       = NewFileSystem(spritesDirPath)
	fsModdedSprites = NewFileSystem(moddedSpritesDirPath)
)

func NewDir(path string) *Dir {
	return &Dir{
		Path:    path,
		Dirs:    []Dir{},
		Sprites: []Sprite{},
	}
}

func NewFileSystem(rootPath string) *FileSystem {
	return &FileSystem{
		RootPath: rootPath,
	}
}

func (fs *FileSystem) Init() error {
	return fs.EnsureAbsPath()
}

func (fs *FileSystem) EnsureAbsPath() error {
	absPath, err := filepath.Abs(fs.RootPath)
	if err != nil {
		return err
	}
	fs.RootPath = absPath
	return nil
}

func (fs FileSystem) Dir() (Dir, error) {
	return traverseDir(fs.RootPath)
}

func NewTree(path string) *Tree {
	return &Tree{
		Path:     path,
		Sprites:  []Sprite{},
		Children: make(map[string]Tree),
	}
}

func (fs FileSystem) Tree() (Tree, error) {
	dir, err := fs.Dir()
	if err != nil {
		return Tree{}, err
	}
	return makeTree(dir)
}

func makeTree(dir Dir) (Tree, error) {
	var result = NewTree(dir.Path)
	result.Sprites = dir.Sprites

	for _, dir := range dir.Dirs {
		tree, err := makeTree(dir)
		if err != nil {
			return Tree{}, err
		}
		result.Children[filepath.Base(dir.Path)] = tree
	}

	return *result, nil
}

func traverseDir(dirPath string) (Dir, error) {
	var result = NewDir(dirPath)

	entries, err := os.ReadDir(dirPath)
	if err != nil {
		return Dir{}, err
	}

	for _, entry := range entries {
		path := filepath.Join(dirPath, entry.Name())
		if entry.IsDir() {
			dir, err := traverseDir(path)
			if err != nil {
				return Dir{}, err
			}

			result.Dirs = append(result.Dirs, dir)
		} else {
			sprite, err := toSprite(path)
			if err != nil {
				continue
			}

			result.Sprites = append(result.Sprites, sprite)
		}
	}

	return *result, nil
}
