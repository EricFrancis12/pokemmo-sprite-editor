import { ESpriteType } from "../../lib/types";
import { isMonsterGroup, TGroupMonstersData } from "./grouping";

export default function GroupMonstersData({ groupMonstersData, spriteType, onClick }: {
    groupMonstersData: TGroupMonstersData | null;
    spriteType: ESpriteType;
    onClick: (key: keyof TGroupMonstersData) => void;
}) {
    return (
        <>
            {groupMonstersData && Object.keys(groupMonstersData).map((key, index) => (
                <div
                    key={index}
                    className={(
                        (key as ESpriteType === spriteType
                            || (isMonsterGroup(spriteType) && key as keyof typeof groupMonstersData === "monsters")
                        ) ? "bg-purple-300"
                            : "bg-white"
                    ) + " p-2 rounded cursor-pointer"}
                    onClick={() => onClick(key as keyof TGroupMonstersData)}
                >
                    {key}
                </div >
            ))
            }
        </>
    )
}
