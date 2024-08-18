package main

import (
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
