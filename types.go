package main

type Initializer interface {
	Init() error
}

type File struct {
	Path string `json:"path"`
}

type Dir struct {
	Path  string `json:"path"`
	Dirs  []Dir  `json:"dirs"`
	Files []File `json:"files"`
}

type FileSystem struct {
	RootPath string `json:"rootPath"`
}
