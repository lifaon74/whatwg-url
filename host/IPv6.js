import { StringView } from '../_dependencies/StringView.ts-26f2d4aad97e9bad00cdcd15d216b758b934d509682ae8b608aaaec4d0780756';
import { CodePoint } from '../_dependencies/CodePoint.ts-a6ff8fc91ddbe91b91039796fc57b752bf3e6005b6da72015884be678d5d3acc';
export class IPv6 {
    constructor(input) {
        this._address = new Uint16Array(8);
        if (typeof input === 'string') {
            const inputCodePoints = new StringView(input);
            let pointer = 0;
            let pieceIndex = 0;
            let compress = null;
            if (inputCodePoints.charAt(pointer) === 0x003a) {
                if (!inputCodePoints.startsWith(new Uint32Array([0x003a]), pointer + 1)) {
                    throw new TypeError('Expected U+003A (:) after first U+003A (:)');
                }
                pointer += 2;
                pieceIndex++;
                compress = pieceIndex;
            }
            while (inputCodePoints.charAt(pointer) !== StringView.OOR) {
                if (pieceIndex === 8)
                    throw new TypeError('Expected end of ip address');
                if (inputCodePoints.charAt(pointer) === 0x003a) {
                    if (compress !== null)
                        throw new TypeError('Unexpected U+003A (:)');
                    pointer++;
                    pieceIndex++;
                    compress = pieceIndex;
                    continue;
                }
                let value = 0;
                let length = 0;
                while ((length < 4) && CodePoint.isASCIIHexDigit(inputCodePoints.charAt(pointer))) {
                    value = value * 0x10 + CodePoint.hexCharToNumber(inputCodePoints.charAt(pointer));
                    pointer++;
                    length++;
                }
                if (inputCodePoints.charAt(pointer) === 0x002e) {
                    if (length === 0)
                        throw new TypeError('Unexpected U+002E (.)');
                    pointer -= length;
                    if (pieceIndex > 6)
                        throw new TypeError('Unexpected U+002E (.)');
                    let numbersSeen = 0;
                    while (inputCodePoints.charAt(pointer) !== StringView.OOR) {
                        let ipv4Piece = null;
                        if (numbersSeen > 0) {
                            if ((inputCodePoints.charAt(pointer) === 0x002e) && (numbersSeen < 4)) {
                                pointer++;
                            }
                            else {
                                throw new TypeError('Unexpected U+002E (.), expect number');
                            }
                        }
                        if (!CodePoint.isASCIIDigit(inputCodePoints.charAt(pointer)))
                            throw new TypeError('Expected number');
                        while (CodePoint.isASCIIDigit(inputCodePoints.charAt(pointer))) {
                            const number = CodePoint.decimalCharToNumber(inputCodePoints.charAt(pointer));
                            if (ipv4Piece === null) {
                                ipv4Piece = number;
                            }
                            else if (ipv4Piece === 0) {
                                throw new TypeError('Expected number greater than 0');
                            }
                            else {
                                ipv4Piece = ipv4Piece * 10 + number;
                            }
                            if (ipv4Piece > 255)
                                throw new TypeError('Expected number lower than 256');
                            pointer++;
                        }
                        this._address[pieceIndex] = this._address[pieceIndex] * 0x100 + ipv4Piece;
                        numbersSeen++;
                        if ((numbersSeen === 2) || (numbersSeen === 4)) {
                            pieceIndex++;
                        }
                    }
                    if (numbersSeen !== 4)
                        throw new TypeError('Expected 4 members');
                    break;
                }
                else if (inputCodePoints.charAt(pointer) === 0x003a) {
                    pointer++;
                    if (inputCodePoints.charAt(pointer) === StringView.OOR)
                        throw new TypeError('Unexpected end after U+003A (:)');
                }
                else if (inputCodePoints.charAt(pointer) !== StringView.OOR) {
                    throw new TypeError('Expected end');
                }
                this._address[pieceIndex] = value;
                pieceIndex++;
            }
            if (compress !== null) {
                let swaps = pieceIndex - compress;
                pieceIndex = 7;
                while ((pieceIndex !== 0) && (swaps > 0)) {
                    const swap = this._address[pieceIndex];
                    this._address[pieceIndex] = this._address[compress + swaps - 1];
                    this._address[compress + swaps - 1] = swap;
                    pieceIndex--;
                    swaps--;
                }
            }
            else if ((compress === null) && (pieceIndex !== 8)) {
                throw new TypeError('Expected 8 parts');
            }
        }
        else if (Array.isArray(input) || ArrayBuffer.isView(input)) {
            if (input.length !== 8)
                throw new TypeError('IPv6 should have 8 uint16 members');
            for (let i = 0; i < 8; i++) {
                this._address[i] = input[i];
            }
        }
        else if (input instanceof IPv6) {
            this._address.set(input._address);
        }
        else {
            throw new TypeError('Invalid IPv6 input');
        }
    }
    get address() {
        return this._address;
    }
    clone() {
        return new IPv6(this);
    }
    toString() {
        let output = '';
        let longestSequence = null;
        let currentSequence = null;
        for (let i = 0; i < this._address.length; i++) {
            if (this._address[i] === 0) {
                if (currentSequence == null)
                    currentSequence = { index: i, length: 0 };
                currentSequence.length++;
                if (longestSequence === null)
                    longestSequence = currentSequence;
                if (currentSequence.length > longestSequence.length)
                    longestSequence = currentSequence;
            }
            else {
                currentSequence = null;
            }
        }
        const compress = (longestSequence === null) ? null : longestSequence.index;
        let ignore0 = false;
        for (let i = 0; i < this._address.length; i++) {
            if (ignore0 && (this._address[i] === 0)) {
                continue;
            }
            else if (ignore0) {
                ignore0 = false;
            }
            if (compress === i) {
                output += (i === 0) ? '::' : ':';
                ignore0 = true;
                continue;
            }
            output += this._address[i].toString(16);
            if (i !== 7)
                output += ':';
        }
        return output;
    }
}
