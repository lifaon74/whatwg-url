export declare class IPv4 {
    private _address;
    constructor(input: string | number | [number, number, number, number] | Uint8Array | IPv4);
    readonly address: Uint8Array;
    clone(): IPv4;
    toInt32(): number;
    toString(): string;
}
