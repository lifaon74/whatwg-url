import { BufferSource } from './types.ts-9635b6186d61d9614c9a0879c9f7731fad9b307eacfc613ac08dead92be51303';
export declare function ConvertLabelToEncoding(label: string): string;
export interface TextDecoderOptions {
    fatal?: boolean;
    ignoreBOM?: boolean;
}
export interface TextDecodeOptions {
    stream?: boolean;
}
export declare class TextDecoder {
    private _encoding;
    private _fatal;
    private _ignoreBOM;
    constructor(label?: string, options?: TextDecoderOptions);
    readonly encoding: string;
    readonly fatal: boolean;
    readonly ignoreBOM: boolean;
    decode(input?: BufferSource, options?: TextDecodeOptions): string;
}
