

export function formatErr(err: unknown): Error {
    if (err instanceof Error) return err;
    if (typeof err === "string") return new Error(err);
    return new Error("unknown error");
}

export function toSorted<T>(arr: T[], compareFunc?: ((a: T, b: T) => number) | undefined): T[] {
    const copy = structuredClone(arr);
    return copy.sort(compareFunc);
}

export function uppercaseFirstLetter(str: string): string {
    if (str.length == 0) return "";
    const upper = str[0].toUpperCase();
    return upper + str.substring(1);
}
