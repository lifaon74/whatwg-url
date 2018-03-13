import { TextEncoder } from './_dependencies/TextEncoder.ts-c32ba39c27162439cc0aa4c8b50286e5073eded99e133aea5e794f9611030e66';
import { StringView } from './_dependencies/StringView.ts-26f2d4aad97e9bad00cdcd15d216b758b934d509682ae8b608aaaec4d0780756';
import { CodePoint } from './_dependencies/CodePoint.ts-a6ff8fc91ddbe91b91039796fc57b752bf3e6005b6da72015884be678d5d3acc';
export class URLPercentEncoderSets {
    static all() {
        return true;
    }
    static C0Control(char) {
        return CodePoint.isC0Control(char) || (char > 0x007e);
    }
    static fragment(char) {
        return URLPercentEncoderSets.C0Control(char)
            || (char === 0x0020)
            || (char === 0x0022)
            || (char === 0x003c)
            || (char === 0x003e)
            || (char === 0x0060);
    }
    static path(char) {
        return URLPercentEncoderSets.fragment(char)
            || (char === 0x0023)
            || (char === 0x003f)
            || (char === 0x007b)
            || (char === 0x007d);
    }
    static userInfo(char) {
        return URLPercentEncoderSets.path(char)
            || (char === 0x002f)
            || (char === 0x003a)
            || (char === 0x003b)
            || (char === 0x003d)
            || (char === 0x0040)
            || (char === 0x005b)
            || (char === 0x005c)
            || (char === 0x005d)
            || (char === 0x005e)
            || (char === 0x007c);
    }
    static encodeURI(char) {
        return this.encodeURIComponent(char) && !((char === 0x0024)
            || (char === 0x0026)
            || (char === 0x002b)
            || (char === 0x002c)
            || (char === 0x002f)
            || (char === 0x003a)
            || (char === 0x003b)
            || (char === 0x003d)
            || (char === 0x003f)
            || (char === 0x0040));
    }
    static encodeURIComponent(char) {
        return !(((0x0030 <= char) && (char <= 0x0039))
            || ((0x0041 <= char) && (char <= 0x005a))
            || ((0x0061 <= char) && (char <= 0x007a))
            || (char === 0x0021)
            || (char === 0x0027)
            || (char === 0x0028)
            || (char === 0x0029)
            || (char === 0x002a)
            || (char === 0x002d)
            || (char === 0x002e)
            || (char === 0x005f)
            || (char === 0x007e));
    }
}
export class URLPercentEncoder {
    static encodeChar(char, percentEncodeSet = URLPercentEncoderSets.all) {
        let buffer = String.fromCodePoint(char);
        if (percentEncodeSet(char)) {
            const bytes = new TextEncoder().encode(buffer);
            buffer = '';
            for (let i = 0, l = bytes.length; i < l; i++) {
                buffer += this.encodeByte(bytes[i]);
            }
        }
        return buffer;
    }
    static encodeByte(byte) {
        return '%' + byte.toString(16).toUpperCase();
    }
    static encode(input, percentEncodeSet = URLPercentEncoderSets.all) {
        if (typeof input === 'string')
            input = new StringView(input);
        let char;
        let output = new StringView();
        for (let i = 0, l = input.length; i < l; i++) {
            char = input.getAt(i);
            if (percentEncodeSet(char)) {
                const bytes = new TextEncoder().encode(String.fromCodePoint(char));
                let byte;
                for (let j = 0, s = bytes.length; j < s; j++) {
                    byte = bytes[j];
                    output.push(0x25);
                    output.push(CodePoint.numberToHexChar(Math.floor(byte / 16)));
                    output.push(CodePoint.numberToHexChar(byte % 16));
                }
            }
            else {
                output.push(char);
            }
        }
        return output.toString();
    }
    static decode(input) {
        if (typeof input === 'string')
            input = new StringView(input);
        let char;
        let output = new StringView();
        for (let i = 0, l = input.length; i < l; i++) {
            char = input.getAt(i);
            if ((char === 0x25) &&
                ((i + 2) < input.length) &&
                CodePoint.isASCIIHexDigit(input.getAt(i + 1)) &&
                CodePoint.isASCIIHexDigit(input.getAt(i + 2))) {
                output.push(CodePoint.hexCharToNumber(input.getAt(i + 1)) * 0x10 +
                    CodePoint.hexCharToNumber(input.getAt(i + 2)));
                i += 2;
            }
            else {
                output.push(char);
            }
        }
        return output.toString();
    }
}
