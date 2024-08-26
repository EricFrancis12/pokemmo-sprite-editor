

export function toSorted<T>(arr: T[], compareFunc?: ((a: T, b: T) => number) | undefined): T[] {
    const copy = structuredClone(arr);
    return copy.sort(compareFunc);
}
