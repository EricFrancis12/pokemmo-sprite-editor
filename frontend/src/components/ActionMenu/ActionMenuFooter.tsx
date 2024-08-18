import { faCheck } from "@fortawesome/free-solid-svg-icons";

export default function ActionMenuFooter({ onSave, disabled }: {
    onSave: () => void;
    disabled?: boolean;
}) {
    return (
        <div
            className="flex justify-end items-center w-full p-4 px-6"
            style={{ borderTop: "solid 1px grey" }}
        >
            <button disabled={disabled} onClick={onSave}>
                Save
            </button>
        </div>
    )
}
