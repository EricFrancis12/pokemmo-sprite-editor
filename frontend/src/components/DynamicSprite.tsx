import React, { useRef } from "react";
import { main } from "../../wailsjs/go/models";

export default function DynamicSprite({ sprite }: {
    sprite: main.Sprite;
}) {
    const path = useRef(sprite.url)

    function fetchSprite() {
        fetch(sprite.url, { cache: "no-store" })
            .then(res => res.blob())
            .then(blob => {
                const blobUrl = URL.createObjectURL(blob);
                path.current = blobUrl;
            });
    }
    fetchSprite();

    return (
        <img
            src={path.current}
            alt={path.current}
        />
    )
}