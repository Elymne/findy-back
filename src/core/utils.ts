export function getRandomInt(max: number): number {
    return Math.floor(Math.random() * (max + 1))
}

export async function wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
}
