install:
	cd frontend && npm install

dev:
	wails dev

build:
	wails build

run:
	build/bin/pokemmo-sprite-editor.exe
