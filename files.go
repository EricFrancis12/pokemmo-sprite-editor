package main

import (
	"io/fs"
	"os"
)

var ospkg = NewOSPkg()

func NewOSPkg() *OSPkg {
	return &OSPkg{}
}

func (o OSPkg) Open(name string) (fs.File, error) {
	return os.Open(name)
}

func (o OSPkg) ReadDir(name string) ([]fs.DirEntry, error) {
	return os.ReadDir(name)
}

func (o OSPkg) ReadFile(name string) ([]byte, error) {
	return os.ReadFile(name)
}
