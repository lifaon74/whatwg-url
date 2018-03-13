import { BufferSource } from './types.ts-9635b6186d61d9614c9a0879c9f7731fad9b307eacfc613ac08dead92be51303';
export declare type BlobPart = BufferSource | Blob | string;
export interface BlobPropertyBag {
    type?: string;
    endings?: ('native' | 'transparent');
}
export declare class Blob {
    [Symbol.toStringTag]: string;
    protected _type: string;
    protected _buffer: Uint8Array;
    constructor(blobParts?: BlobPart[], options?: BlobPropertyBag);
    readonly size: number;
    readonly type: string;
    slice(start?: number, end?: number, contentType?: string): Blob;
}
