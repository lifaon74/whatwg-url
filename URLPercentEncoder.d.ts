import { StringView } from './_dependencies/StringView.ts-26f2d4aad97e9bad00cdcd15d216b758b934d509682ae8b608aaaec4d0780756';
export declare type URLPercentEncoderSet = (char: number) => boolean;
export declare class URLPercentEncoderSets {
    static all(): boolean;
    static C0Control(char: number): boolean;
    static fragment(char: number): boolean;
    static path(char: number): boolean;
    static userInfo(char: number): boolean;
    static encodeURI(char: number): boolean;
    static encodeURIComponent(char: number): boolean;
}
export declare class URLPercentEncoder {
    static encodeChar(char: number, percentEncodeSet?: URLPercentEncoderSet): string;
    static encodeByte(byte: number): string;
    static encode(input: string | StringView, percentEncodeSet?: URLPercentEncoderSet): string;
    static decode(input: string | StringView): string;
}
