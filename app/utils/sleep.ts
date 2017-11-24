export async function sleep(timeMs: number): Promise<void> {
    return new Promise<void>(
        (resolve: () => void, reject: (error: string) => void) => {
            setTimeout(resolve, timeMs);
        });
}