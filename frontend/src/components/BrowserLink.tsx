import { BrowserOpenURL } from "../../wailsjs/runtime";

export default function BrowserLink({ text, url }: {
    text: string;
    url: string;
}) {
    return (
        <span
            className="cursor-pointer hover:text-slate-600"
            onClick={() => BrowserOpenURL(url)}
        >
            {text}
        </span>
    )
}