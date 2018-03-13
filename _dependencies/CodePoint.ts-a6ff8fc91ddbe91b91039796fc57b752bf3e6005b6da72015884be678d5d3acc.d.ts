import { StringView } from './StringView.ts-26f2d4aad97e9bad00cdcd15d216b758b934d509682ae8b608aaaec4d0780756';
export declare class CodePoint {
    static isWindowDriveLetter(input: string | StringView): boolean;
    static isNormalizedWindowsDriveLetter(input: string | StringView): boolean;
    static startsWithAWindowsDriveLetter(input: string | StringView): boolean;
    static isSingleDotPathSegment(input: string | StringView): boolean;
    static isDoubleDotPathSegment(input: string | StringView): boolean;
    static isURLCodePoint(char: number): boolean;
    static isForbiddenHostCodePoint(char: number): boolean;
    static isSurrogate(char: number): boolean;
    static isScalarValue(char: number): boolean;
    static isNonCharacter(char: number): boolean;
    static isASCIICodePoint(char: number): boolean;
    static isASCIITabOrNewLine(char: number): boolean;
    static isASCIIWhiteSpace(char: number): boolean;
    static isC0Control(char: number): boolean;
    static isC0ControlOrSpace(char: number): boolean;
    static isControl(char: number): boolean;
    static isASCIIDigit(char: number): boolean;
    static isASCIIUpperHexDigit(char: number): boolean;
    static isASCIILowerHexDigit(char: number): boolean;
    static isASCIIHexDigit(char: number): boolean;
    static isASCIIUpperAlpha(char: number): boolean;
    static isASCIILowerAlpha(char: number): boolean;
    static isASCIIAlpha(char: number): boolean;
    static isASCIIAlphanumeric(char: number): boolean;
    static hexCharToNumber(char: number): number;
    static numberToHexChar(number: number): number;
    static decimalCharToNumber(char: number): number;
}