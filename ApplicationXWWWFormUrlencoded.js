import { TextEncoder } from './_dependencies/TextEncoder.ts-c32ba39c27162439cc0aa4c8b50286e5073eded99e133aea5e794f9611030e66';
import { URLPercentEncoder } from './URLPercentEncoder';
export class ApplicationXWWWFormUrlencoded {
    static deserialize(input) {
        const output = [];
        const sequences = input.split('&');
        for (const sequence of sequences) {
            if (sequence !== '') {
                const parts = sequence.split('=');
                output.push([
                    URLPercentEncoder.decode(parts[0].replace('+', ' ')),
                    URLPercentEncoder.decode(parts.slice(1).join('=').replace('+', ' '))
                ]);
            }
        }
        return output;
    }
    static serialize(tuples, encoding = 'utf-8') {
        let output = '';
        for (const tuple of tuples) {
            if (output !== '')
                output += '&';
            output += this.serializeByteString(new TextEncoder().encode(tuple[0])) + '=' + this.serializeByteString(new TextEncoder().encode(tuple[1]));
        }
        return output;
    }
    static serializeByteString(bytes) {
        let output = '';
        let byte;
        for (let i = 0, l = bytes.length; i < l; i++) {
            byte = bytes[i];
            if (byte === 0x20) {
                output += '+';
            }
            else if ((byte === 0x2a) || (byte === 0x2d) || (byte === 0x2e) ||
                ((0x30 <= byte) && (byte <= 0x39)) ||
                ((0x41 <= byte) && (byte <= 0x5a)) ||
                (byte === 0x5F) ||
                ((0x61 <= byte) && (byte <= 0x7a))) {
                output += String.fromCodePoint(byte);
            }
            else {
                output += URLPercentEncoder.encodeChar(byte);
            }
        }
        return output;
    }
}
