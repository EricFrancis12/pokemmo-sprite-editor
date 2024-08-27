import React from "react";
import { applicationAuthor, applicationAuthorUrl, applicationSourceCodeUrl } from "../lib/constants";
import BrowserLink from "../components/BrowserLink";

export default function DefaultLayout({ children }: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col items-between h-screen w-screen">
            <div className="h-full w-full">
                {children}
            </div>
            <div className="flex justify-center items-center gap-4 w-full px-4 py-2 text-black text-xs">
                <BrowserLink
                    text={"Made by " + applicationAuthor}
                    url={applicationAuthorUrl}
                />
                <BrowserLink
                    text="View Source Code"
                    url={applicationSourceCodeUrl}
                />
            </div>
        </div>
    )
}
