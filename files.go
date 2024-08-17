package main

import (
	"os"
	"path/filepath"
)

const spritesDirPath = "./frontend/src/assets/images/sprites"

var fsSprites = NewFileSystem(spritesDirPath)

func NewDir(path string) *Dir {
	return &Dir{
		Path:  path,
		Dirs:  []Dir{},
		Files: []File{},
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

func (fs FileSystem) Tree() (Dir, error) {
	return traverseDir(fs.RootPath)
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
			result.Files = append(result.Files, File{
				Path: path,
			})
		}
	}

	return *result, nil
}
