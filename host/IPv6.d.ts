export declare class IPv6 {
    private _address;
    constructor(input: string | Uint16Array | IPv6);
    readonly address: Uint16Array;
    clone(): IPv6;
    toString(): string;
}
