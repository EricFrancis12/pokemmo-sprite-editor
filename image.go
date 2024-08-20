package main

import (
	"image"
	"image/color"
	"image/draw"
	"image/gif"
	"image/png"
	"os"

	"github.com/anthonynsimon/bild/adjust"
)

func ProcessPng(inputPath string, outputPath string, imageData ImageData) error {
	file, err := os.Open(inputPath)
	if err != nil {
		return err
	}
	defer file.Close()

	img, err := png.Decode(file)
	if err != nil {
		return err
	}

	img = adjust.Hue(img, imageData.Hue)
	img = adjust.Saturation(img, imageData.Saturation)

	outputFile, err := os.Create(outputPath)
	if err != nil {
		return err
	}
	defer outputFile.Close()

	return png.Encode(outputFile, img)
}

func ProcessGif(inputPath string, outputPath string, imageData ImageData) error {
	file, err := os.Open(inputPath)
	if err != nil {
		return err
	}
	defer file.Close()

	gifImage, err := gif.DecodeAll(file)
	if err != nil {
		return err
	}

	var bounds image.Rectangle

	// Process each frame
	for i, img := range gifImage.Image {
		// Get bounds from the first frame
		if i == 0 {
			bounds = img.Bounds()
		}

		// Convert *image.Paletted to *image.RGBA
		rgba := PalettedToRGBA(img, bounds)

		// Apply adjustments
		rgba = adjust.Hue(rgba, imageData.Hue)
		rgba = adjust.Saturation(rgba, imageData.Saturation)

		// Convert *image.RGBA to *image.Paletted
		gifImage.Image[i] = RGBAToPaletted(rgba, bounds)
	}

	outputFile, err := os.Create(outputPath)
	if err != nil {
		return err
	}
	defer outputFile.Close()

	return gif.EncodeAll(outputFile, gifImage)
}

func PalettedToRGBA(paletted *image.Paletted, bounds image.Rectangle) *image.RGBA {
	rgba := image.NewRGBA(bounds)
	draw.Draw(rgba, bounds, paletted, image.Point{}, draw.Over)
	return rgba
}

func RGBAToPaletted(rgba *image.RGBA, bounds image.Rectangle) *image.Paletted {
	// Extract the unique colors from the RGBA image
	palette := color.Palette{}
	for y := bounds.Min.Y; y < bounds.Max.Y; y++ {
		for x := bounds.Min.X; x < bounds.Max.X; x++ {
			c := rgba.At(x, y)
			if !sliceIncludes(palette, c) {
				palette = append(palette, c)
			}
		}
	}

	// Create the Paletted image with the constructed palette
	paletted := image.NewPaletted(bounds, palette)
	draw.Draw(paletted, bounds, rgba, image.Point{}, draw.Over)
	return paletted
}
