import { main } from "../../../wailsjs/go/models";
import { ESpriteType } from "../../lib/types";

export default function SpriteGroupData({ spriteGroupData, spriteType, onClick }: {
    spriteGroupData: main.SpriteGroupData | null;
    spriteType: ESpriteType;
    onClick: (key: ESpriteType) => void;
}) {
    return (
        <>
            {spriteGroupData?.data && Object.keys(spriteGroupData.data).map((_spriteType, index) => (
                <div
                    key={index}
                    className={(_spriteType === spriteType ? "bg-purple-300" : "bg-white hover:opacity-70") + " p-2 rounded cursor-pointer"}
                    onClick={() => onClick(_spriteType as ESpriteType)}
                >
                    {_spriteType}
                </div>
            ))}
        </>
    )
}
