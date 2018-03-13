export class TextEncoder {
    constructor() {
    }
    get encoding() {
        return 'utf-8';
    }
    encode(input = '') {
        const buffer = Buffer.from(input, this.encoding);
        return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
    }
}
