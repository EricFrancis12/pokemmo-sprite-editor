package main

import (
	"archive/zip"
	"context"
	"fmt"
	"os"
	"path/filepath"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) SpritesDir() (Dir, error) {
	return fsSprites.Dir()
}

func (a *App) SpritesTree() (Tree, error) {
	return fsSprites.Tree()
}

func (a *App) SpritePath(s Sprite) string {
	return s.Path()
}

func (a *App) ProcessPng(inputPath string, outputPath string, imageData ImageData) error {
	return ProcessPng(inputPath, outputPath, imageData)
}

func (a *App) ExportMod() error {
	outputPath := filepath.Join(modDirPath, FileNameModZip)
	archive, err := os.Create(outputPath)
	if err != nil {
		return err
	}
	defer archive.Close()

	zw := zip.NewWriter(archive)
	defer func() {
		err := zw.Close()
		if err != nil {
			fmt.Printf("error closing zip writer: %s\n", err.Error())
		}
	}()

	if err := writeToZipFile(zw, InfoXmlFileName(), NewInfoXml().Bytes()); err != nil {
		return err
	}

	if err := ZipDirRecursively(zw, moddedSpritesDirPath, DirNameSprites, filterExcludedEntries); err != nil {
		return err
	}

	return nil
}
