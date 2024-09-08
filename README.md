# PokeMMO Sprite Editor
A tool that allows players to recolor [PokeMMO](https://pokemmo.com/) sprites, and export them as a mod file for use in game. Built with [Wails](https://wails.io/).

## Features
- **Edit Sprites**: Edit monster sprites from PokeMMO.
- **Preview Changes**: View your modifications in real-time.
- **Export Mod Files**: Export your edited sprites into a .zip file compatible with PokeMMO.
- **Multiple Sprite Types**: Support for various sprite types used in PokeMMO (battlesprites, followersprites, moonstericons, and itemicons).

## Video Demo
https://www.youtube.com/watch?v=PPGgfiTe9o0

## Build

### Prerequisites
Ensure you have [Go](https://golang.org/dl/), [Node.js](https://nodejs.org/en/download/package-manager), and the [Wails CLI](https://wails.io/docs/gettingstarted/installation/) installed on your system.

1. Clone the Repository

```bash
git clone https://github.com/EricFrancis12/pokemmo-sprite-editor.git
```

2. Enter the project directory

```bash
cd pokemmo-sprite-editor
```

3. Install dependencies

```bash
make install
```

4. Compile the project

```bash
wails build
```
This will create an executable located at `/build/bin/pokemmo-sprite-editor.exe`.

## Usage
Run the executable to start the program. Alternitively, you can run `make run` at the project root.

## File and Directories
On startup, the program will create these files and directories inside the directory it's currently running in if they do not already exist:

```base

/any/dir/pokemmo-sprite-editor.exe
  ├── mod/
  ├── modded-sprites/
  │       └── battlesprites/
  │       └── followersprites/
  │       └── itemicons/
  │       └── monstericons/
  ├── pokemmo-sprite-editor-data.db

```

1. `mod/`: The directory where the mod file (`pokemmo-sprite-editor.zip`) will be exported to.
2. `modded-sprites/`: The program saves recolored sprites in this directory. The mod file is built from these sprites.
3. `pokemmo-sprite-editor-data.db`: A SQLite file that stores application data.

## Find a bug?
If you found an issue or would like to submit an improvement to this project, please submit an issue using the issues tab above. If you would like to submit a PR with a fix, reference the issue you created!

## Attribution
All sprites were obtained from https://github.com/PokeAPI/sprites under CC0 1.0 Universal License.
