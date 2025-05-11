#!/bin/bash

ROOT_DIR="/Users/sh/Developer/furniture/kids"

# STEP 1: Convert all images to .jpg
find "$ROOT_DIR" -type f \( -iname '*.png' -o -iname '*.jpeg' -o -iname '*.jpg' -o -iname '*.heic' \) | while read -r FILE; do
    DIR=$(dirname "$FILE")
    BASENAME=$(basename "$FILE")
    FILENAME="${BASENAME%.*}"
    NEWFILE="$DIR/$FILENAME.jpg"

    echo "Converting: $FILE -> $NEWFILE"
    magick "$FILE" -quality 85 "$NEWFILE"

    EXT="${FILE##*.}"
    EXT_LOWER=$(echo "$EXT" | tr '[:upper:]' '[:lower:]')
    if [[ "$EXT_LOWER" != "jpg" ]]; then
        rm "$FILE"
        echo "Deleted original: $FILE"
    fi
done

# STEP 2: Rename jpgs in each folder to 1.jpg, 2.jpg, ...
find "$ROOT_DIR" -type d | while read -r FOLDER; do
    echo "Renaming in folder: $FOLDER"
    COUNT=1
    find "$FOLDER" -maxdepth 1 -type f -iname '*.jpg' | sort | while read -r IMG; do
        NEW_NAME="$FOLDER/$COUNT.jpg"
        if [[ "$IMG" != "$NEW_NAME" ]]; then
            mv "$IMG" "$NEW_NAME"
            echo "Renamed $IMG -> $NEW_NAME"
        fi
        COUNT=$((COUNT + 1))
    done
done

