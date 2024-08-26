package main

import (
	"database/sql"
	"fmt"

	_ "github.com/mattn/go-sqlite3"
)

var storage = NewImageDataStorage(imageDataDriverName, imageDataDataSourceName)

func NewImageDataStorage(driverName string, dataSourceName string) *ImageDataStorage {
	return &ImageDataStorage{
		DriverName:     driverName,
		DataSourceName: dataSourceName,
	}
}

func (s *ImageDataStorage) Init() error {
	db, err := sql.Open(s.DriverName, s.DataSourceName)
	if err != nil {
		return err
	}
	s.Client = db

	sqlStmt := fmt.Sprintf(`
		create table if not exists %s (
			fileName text not null primary key,
			spriteType text,
			hue integer,
			saturation float
		);
	`, imageDataTableName)

	_, err = s.Client.Exec(sqlStmt)
	if err != nil {
		return err
	}

	return nil
}

func (s *ImageDataStorage) GetAll() ([]ImageData, error) {
	rows, err := s.Client.Query(fmt.Sprintf("select * from %s", imageDataTableName))
	if err != nil {
		return []ImageData{}, err
	}
	defer rows.Close()

	var allImageData = []ImageData{}
	for rows.Next() {
		i, err := scanIntoImageData(rows)
		if err != nil {
			return []ImageData{}, err
		}
		allImageData = append(allImageData, *i)
	}

	// Check for errors from iterating over rows
	if err := rows.Err(); err != nil {
		return []ImageData{}, err
	}

	return allImageData, nil
}

func (s *ImageDataStorage) GetOne(st SpriteType, fileName string) (*ImageData, error) {
	rows, err := s.Client.Query(
		fmt.Sprintf(`select * from %s where spriteType = "%s" and fileName = "%s"`, imageDataTableName, st, fileName),
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		return scanIntoImageData(rows)
	}

	return nil, fmt.Errorf("imageData with spriteType %s and fileName %s not found", st, fileName)
}

func (s *ImageDataStorage) UpsertOne(i ImageData) error {
	sqlStmt := fmt.Sprintf(`
		insert or replace into %s (fileName, spriteType, hue, saturation) 
		values (?, ?, ?, ?);
	`, imageDataTableName)

	_, err := s.Client.Exec(sqlStmt, i.fileName, i.spriteType, i.Hue, i.Saturation)
	if err != nil {
		return err
	}

	return nil
}

func (s *ImageDataStorage) DeleteOne(st SpriteType, fileName string) error {
	_, err := s.Client.Query(
		fmt.Sprintf(`delete from %s where spriteType = "%s" and fileName = "%s"`, imageDataTableName, st, fileName),
	)
	return err
}

func scanIntoImageData(rows *sql.Rows) (*ImageData, error) {
	i := new(ImageData)
	err := rows.Scan(
		&i.fileName,
		&i.spriteType,
		&i.Hue,
		&i.Saturation,
	)
	return i, err
}
