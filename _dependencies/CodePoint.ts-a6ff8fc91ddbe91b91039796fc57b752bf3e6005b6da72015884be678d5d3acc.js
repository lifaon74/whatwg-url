import { StringView } from './StringView.ts-26f2d4aad97e9bad00cdcd15d216b758b934d509682ae8b608aaaec4d0780756';
export class CodePoint {
    static isWindowDriveLetter(input) {
        if (typeof input === 'string') {
            input = new StringView(input);
        }
        return (input.length === 2)
            && CodePoint.isASCIIAlpha(input.charAt(0))
            && ((input.charAt(1) === 0x003a) || (input.charAt(1) === 0x007c));
    }
    static isNormalizedWindowsDriveLetter(input) {
        if (typeof input === 'string') {
            input = new StringView(input);
        }
        return (input.length === 2)
            && CodePoint.isASCIIAlpha(input.charAt(0))
            && (input.charAt(1) === 0x003a);
    }
    static startsWithAWindowsDriveLetter(input) {
        if (typeof input === 'string') {
            input = new StringView(input);
        }
        return CodePoint.isASCIIAlpha(input.charAt(0))
            && ((input.charAt(1) === 0x003a) || (input.charAt(1) === 0x007c))
            && ((input.length === 2)
                || ([0x002f, 0x005c, 0x003f, 0x0023].includes(input.charAt(2))));
    }
    static isSingleDotPathSegment(input) {
        if (typeof input !== 'string') {
            input = input.toString();
        }
        return ['.', '%2e'].includes(input.toLowerCase());
    }
    static isDoubleDotPathSegment(input) {
        if (typeof input !== 'string') {
            input = input.toString();
        }
        return ['..', '.%2e', '%2e.', '%2e%2e'].includes(input.toLowerCase());
    }
    static isURLCodePoint(char) {
        return (CodePoint.isASCIIAlphanumeric(char)
            || [
                0x0021, 0x0024, 0x0026, 0x0027, 0x0028, 0x0029, 0x002a, 0x002b, 0x002c, 0x002d,
                0x002e, 0x002f, 0x003a, 0x003b, 0x003d, 0x003f, 0x0040, 0x005f, 0x007e
            ].includes(char)
            || ((0x00a0 <= char) && (char <= 0x10fffd))) && !CodePoint.isSurrogate(char) && !CodePoint.isNonCharacter(char);
    }
    static isForbiddenHostCodePoint(char) {
        return [
            0x0000, 0x0009, 0x000a, 0x000d, 0x0020, 0x0023, 0x0025,
            0x002f, 0x003a, 0x003f, 0x0040, 0x005b, 0x005c, 0x005d
        ].includes(char);
    }
    static isSurrogate(char) {
        return (0xd800 <= char) && (char <= 0xdfff);
    }
    static isScalarValue(char) {
        return !this.isSurrogate(char);
    }
    static isNonCharacter(char) {
        return (0xfdd0 <= char) && (char <= 0xfdef) || [
            0xfffe, 0xffff, 0x1fffe, 0x1ffff,
            0x2fffe, 0x2ffff, 0x3fffe, 0x3ffff,
            0x4fffe, 0x4ffff, 0x5fffe, 0x5ffff,
            0x6fffe, 0x6ffff, 0x7fffe, 0x7ffff,
            0x8fffe, 0x8ffff, 0x9fffe, 0x9ffff,
            0xafffe, 0xaffff, 0xbfffe, 0xbffff,
            0xcfffe, 0xcffff, 0xdfffe, 0xdffff,
            0xefffe, 0xeffff, 0xffffe, 0xfffff,
            0x10fffe, 0x10ffff
        ].includes(char);
    }
    static isASCIICodePoint(char) {
        return (0x0000 <= char) && (char <= 0x007f);
    }
    static isASCIITabOrNewLine(char) {
        return (char === 0x0009) || (char === 0x000a) || (char === 0x000d);
    }
    static isASCIIWhiteSpace(char) {
        return (char === 0x0009) || (char === 0x000a) || (char === 0x000c) || (char === 0x000d) || (char === 0x0020);
    }
    static isC0Control(char) {
        return (0x0000 <= char) && (char <= 0x001f);
    }
    static isC0ControlOrSpace(char) {
        return this.isC0Control(char) || (char === 0x0020);
    }
    static isControl(char) {
        return this.isC0Control(char) || ((0x007f <= char) && (char <= 0x009f));
    }
    static isASCIIDigit(char) {
        return (0x0030 <= char) && (char <= 0x0039);
    }
    static isASCIIUpperHexDigit(char) {
        return this.isASCIIDigit(char) || ((0x0041 <= char) && (char <= 0x0046));
    }
    static isASCIILowerHexDigit(char) {
        return this.isASCIIDigit(char) || ((0x0061 <= char) && (char <= 0x0066));
    }
    static isASCIIHexDigit(char) {
        return ((0x0030 <= char) && (char <= 0x0039))
            || ((0x0041 <= char) && (char <= 0x0046))
            || ((0x0061 <= char) && (char <= 0x0066));
    }
    static isASCIIUpperAlpha(char) {
        return (0x0041 <= char) && (char <= 0x005a);
    }
    static isASCIILowerAlpha(char) {
        return (0x0061 <= char) && (char <= 0x007a);
    }
    static isASCIIAlpha(char) {
        return this.isASCIIUpperAlpha(char) || this.isASCIILowerAlpha(char);
    }
    static isASCIIAlphanumeric(char) {
        return this.isASCIIDigit(char) || this.isASCIIAlpha(char);
    }
    static hexCharToNumber(char) {
        if ((0x0030 <= char) && (char <= 0x0039)) {
            return char - 48;
        }
        else if ((0x0041 <= char) && (char <= 0x0046)) {
            return char - 55;
        }
        else if ((0x0061 <= char) && (char <= 0x0066)) {
            return char - 87;
        }
        else {
            return Number.NaN;
        }
    }
    static numberToHexChar(number) {
        if (number < 10) {
            return number + 48;
        }
        else if (number < 16) {
            return number + 87;
        }
        else {
            return Number.NaN;
        }
    }
    static decimalCharToNumber(char) {
        if ((0x0030 <= char) && (char <= 0x0039)) {
            return char - 48;
        }
        else {
            return Number.NaN;
        }
    }
}
