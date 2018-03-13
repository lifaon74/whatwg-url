export declare class UUID {
    static version: number;
    static clock: number;
    static node: number;
    static get(): string;
    static toHex(number: number, size: number): string;
}
