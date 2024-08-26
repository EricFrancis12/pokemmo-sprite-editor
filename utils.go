package main

import (
	"strings"
)

func FileExt(fileName string) string {
	parts := strings.Split(fileName, ".")
	return parts[len(parts)-1]
}

func sliceIncludes[T comparable](slice []T, t T) bool {
	for _, c := range slice {
		if c == t {
			return true
		}
	}
	return false
}

func findInSlice[T any](slice []T, predicate func(t T, i int) bool) (*T, bool) {
	for i, t := range slice {
		if predicate(t, i) {
			return &t, true
		}
	}
	return nil, false
}

func findIndexInSlice(slice []SpriteGroup, predicate func(t SpriteGroup, i int) bool) int {
	for i, t := range slice {
		if predicate(t, i) {
			return i
		}
	}
	return -1
}
