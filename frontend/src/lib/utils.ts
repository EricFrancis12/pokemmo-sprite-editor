

export async function importImage(path: string): Promise<string | null> {
    try {
        const image = await import(path);
        return typeof image?.default === "string" ? image.default : null;
    } catch (err) {
        return null;
    }
}
