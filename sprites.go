package main

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

func NewSprite(st SpriteType, fileName string) Sprite {
	return Sprite{
		ID:         spriteIdFromFileName(fileName),
		Url:        fmt.Sprintf("/api/sprites/%s/%s", st, fileName),
		SpriteType: st,
		FileName:   fileName,
	}
}

func makeSpriteData() (SpriteData, error) {
	sd := SpriteData{
		Data: make(SpritesMap),
	}

	for _, spriteType := range spriteTypes {
		entries, err := assets.ReadDir(fmt.Sprintf("frontend/dist/sprites/%s", spriteType))
		if err != nil {
			if os.IsNotExist(err) {
				continue
			} else {
				return SpriteData{}, err
			}
		}

		for _, entry := range entries {
			fileName := entry.Name()
			if isSpriteFile(fileName) {
				sprite := NewSprite(spriteType, fileName)

				imageData, err := storage.GetOne(spriteType, fileName)
				if err == nil {
					sprite.ImageData = *imageData
				}

				sd.Data[spriteType] = append(sd.Data[spriteType], sprite)
			}
		}
	}

	return sd, nil
}

func makeSpriteGroupData() (SpriteGroupData, error) {
	sgd := SpriteGroupData{
		Data: make(SpriteGroupMap),
	}

	sd, err := makeSpriteData()
	if err != nil {
		return sgd, err
	}

	for _, spriteType := range spriteTypes {
		for _, sprite := range sd.Data[spriteType] {
			// Find the index of the SpriteGroup in the map
			index := findIndexInSlice(sgd.Data[spriteType], func(sg SpriteGroup, _ int) bool {
				_, ok := findInSlice(sg.Sprites, func(s Sprite, _ int) bool {
					return s.ID == sprite.ID
				})
				return ok
			})

			if index >= 0 {
				// Update the existing SpriteGroup
				sgd.Data[spriteType][index].Sprites = append(sgd.Data[spriteType][index].Sprites, sprite)
			} else {
				// Create a new SpriteGroup
				newGroup := SpriteGroup{
					ID:      sprite.ID,
					Sprites: []Sprite{sprite},
				}
				sgd.Data[spriteType] = append(sgd.Data[spriteType], newGroup)
			}
		}
	}

	return sgd, nil
}

func getSpritesByType(st SpriteType) ([]Sprite, error) {
	sd, err := makeSpriteData()
	if err != nil {
		return []Sprite{}, err
	}
	return sd.Data[st], nil
}

func spriteIdFromFileName(fileName string) string {
	return strings.Split(fileName, "-")[0]
}

func isSpriteFile(name string) bool {
	ext := FileExt(name)
	return ext == FileExtGif || ext == FileExtPng
}

func DirPathToSpriteType(dirPath string) (*SpriteType, error) {
	var (
		dirName = filepath.Base(dirPath)
		st      SpriteType
	)
	switch dirName {
	case string(SpriteTypeBattlesprites):
		st = SpriteTypeBattlesprites
	case string(SpriteTypeFollowSprites):
		st = SpriteTypeFollowSprites
	case string(SpriteTypeItemIcons):
		st = SpriteTypeItemIcons
	case string(SpriteTypeMonsterIcons):
		st = SpriteTypeMonsterIcons
	}
	if &st != nil {
		return &st, nil
	}
	return nil, fmt.Errorf("unknown sprite type: %s", dirName)
}

func (s Sprite) Ext() string {
	return FileExt(s.FileName)
}

func (s Sprite) OrigPath() string {
	return fmt.Sprintf("frontend/dist/sprites/%s/%s", s.SpriteType, s.FileName)
}

func (s Sprite) ModdedPath() string {
	return fmt.Sprintf("modded-sprites/%s/%s", s.SpriteType, s.FileName)
}

func (s Sprite) Process(imageData ImageData) error {
	ext := s.Ext()
	if ext == FileExtPng {
		return s.processPNG(imageData)
	} else if ext == FileExtGif {
		return s.processGIF(imageData)
	}
	return fmt.Errorf("unknown file extension: %s", ext)
}

func (s Sprite) processPNG(imageData ImageData) error {
	return processPNG(assets, s.OrigPath(), s.ModdedPath(), imageData)
}

func (s Sprite) processGIF(imageData ImageData) error {
	return processGIF(assets, s.OrigPath(), s.ModdedPath(), imageData)
}

func (sg SpriteGroup) FindOne(predicate func(s Sprite, i int) bool) (*Sprite, bool) {
	return findInSlice(sg.Sprites, func(s Sprite, i int) bool {
		return predicate(s, i)
	})
}

func (sg SpriteGroup) Includes(predicate func(s Sprite, i int) bool) bool {
	_, ok := sg.FindOne(predicate)
	return ok
}
