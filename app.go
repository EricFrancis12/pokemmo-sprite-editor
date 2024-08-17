package main

import (
	"context"
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
