package main

import (
	"embed"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

type FileLoader struct {
	http.Handler
}

func NewFileLoader() *FileLoader {
	return &FileLoader{}
}

func (h *FileLoader) ServeHTTP(res http.ResponseWriter, req *http.Request) {
	requestedFilename := strings.TrimPrefix(req.URL.Path, "/")

	fileData, err := os.ReadFile(requestedFilename)
	if err != nil {
		spritePath := strings.Replace(requestedFilename, DirNameModdedSprites, DirNameSprites, 1)
		spritePath = DirNameFrontend + "/" + DirNameDist + "/" + spritePath

		fd, err := os.ReadFile(spritePath)
		if err != nil {
			res.WriteHeader(http.StatusBadRequest)
			res.Write([]byte(fmt.Sprintf("Could not load file %s", requestedFilename)))
		} else {
			fileData = fd
		}
	}

	res.Write(fileData)
}

func MustInit(i Initializer) {
	err := i.Init()
	if err != nil {
		panic(err)
	}
}

func testDb() {
	fmt.Println("~ 0")

	err := os.Remove(imageDataDataSourceName)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("~ 1")

	if err := storage.Init(); err != nil {
		log.Fatal(err)
	}

	fmt.Println("~ 2")

	i := ImageData{
		fileName:   "my cool file name",
		spriteType: SpriteTypeBattlesprites,
		Hue:        20,
		Saturation: 0.4,
	}
	if err := storage.UpsertOne(i); err != nil {
		log.Fatal(err)
	}

	fmt.Println("~ 3")

	imageData, err := storage.GetOne(SpriteTypeBattlesprites, "my cool file name")
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("%+v\n", imageData)

	fmt.Println("~ 4")

	i.Hue = 40
	if err := storage.UpsertOne(i); err != nil {
		log.Fatal(err)
	}

	fmt.Println("~ 5")

	imageData, err = storage.GetOne(SpriteTypeBattlesprites, "my cool file name")
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("%+v\n", imageData)

	fmt.Println("~ 6")

	allImageData, err := storage.GetAll()
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("%+v\n", allImageData)

	fmt.Println("~ 7")

	if err := storage.DeleteOne(SpriteTypeBattlesprites, "my cool file name"); err != nil {
		log.Fatal(err)
	}

	fmt.Println("~ 8")

	imageData, err = storage.GetOne(SpriteTypeBattlesprites, "my cool file name")
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("~ 9")
	fmt.Printf("%+v\n", imageData)
	fmt.Println("~ 10")
}

func main() {
	os.MkdirAll("./"+DirNameModdedSprites+"/"+SpriteTypeBattlesprites.String(), fileMode)
	os.MkdirAll("./"+DirNameModdedSprites+"/"+SpriteTypeFollowSprites.String(), fileMode)
	os.MkdirAll("./"+DirNameModdedSprites+"/"+SpriteTypeItemIcons.String(), fileMode)
	os.MkdirAll("./"+DirNameModdedSprites+"/"+SpriteTypeMonsterIcons.String(), fileMode)

	testDb()

	// MustInit(fsSprites)
	// MustInit(fsModdedSprites)

	// Create an instance of the app structure
	app := NewApp()

	// Create application with options
	err := wails.Run(&options.App{
		Title:  "pokemmo-sprite-editor",
		Width:  1024,
		Height: 768,
		AssetServer: &assetserver.Options{
			Assets:  assets,
			Handler: NewFileLoader(),
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup:        app.startup,
		Bind: []interface{}{
			app,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
