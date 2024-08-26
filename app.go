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

func (a *App) GetSpriteData() (SpriteData, error) {
	return makeSpriteData()
}

func (a *App) GetSpriteGroupData() (SpriteGroupData, error) {
	return makeSpriteGroupData()
}

func (a *App) GetSpritesByType(st SpriteType) ([]Sprite, error) {
	return getSpritesByType(st)
}

func (a *App) GetSpriteGroup(st SpriteType, id string) (SpriteGroup, error) {
	sgd, err := a.GetSpriteGroupData()
	if err != nil {
		return SpriteGroup{}, err
	}

	sg, ok := findInSlice(sgd.Data[st], func(sg SpriteGroup, i int) bool {
		_, ok := findInSlice(sg.Sprites, func(s Sprite, i int) bool {
			return s.ID == id
		})
		return ok
	})

	if !ok {
		return SpriteGroup{}, fmt.Errorf("not found")
	}

	return *sg, nil
}

func (a *App) ProcessSprite(sprite Sprite, imageData ImageData) error {
	return sprite.Process(imageData)
}

func (a *App) ProcessSprites(sprites []Sprite, imageData ImageData) error {
	for _, sprite := range sprites {
		err := a.ProcessSprite(sprite, imageData)
		if err != nil {
			return err
		}
	}
	return nil
}

func (a *App) DeleteModdedSprite(sprite Sprite) error {
	err := os.Remove(sprite.ModdedPath())
	if err != nil {
		return err
	}
	return storage.DeleteOne(sprite.SpriteType, sprite.FileName)
}

func (a *App) DeleteModdedSprites(sprites []Sprite) error {
	for _, sprite := range sprites {
		err := a.DeleteModdedSprite(sprite)
		if err != nil {
			return err
		}
	}
	return nil
}

func (a *App) ExportMod() error {
	os.Mkdir(DirNameMod, fileMode)

	outputPath := filepath.Join(DirNameMod, FileNameModZip)
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

	if err := ZipDirRecursively(zw, DirNameModdedSprites, DirNameSprites, filterExcludedEntries); err != nil {
		return err
	}

	sprites, _ := getSpritesByType(SpriteTypeFollowSprites)
	if len(sprites) > 0 {
		err := writeToZipFile(zw, AtlasDataTxtZipPath(), NewAtlasDataTxt().Bytes())
		if err != nil {
			return err
		}
	}

	return nil
}
