

export default async function importSprite(path: string): Promise<string | undefined> {
    try {
        const image = await import(path);
        return image.default as string;
    } catch (error) {
        console.error(`Error loading image ${path}:`, error);
        return undefined;
    }
}
