import { TextEncoder } from './TextEncoder.ts-c32ba39c27162439cc0aa4c8b50286e5073eded99e133aea5e794f9611030e66';
export class Blob {
    constructor(blobParts = [], options = {}) {
        this[Symbol.toStringTag] = 'Blob';
        options = Object.assign({
            type: '',
            endings: 'transparent'
        }, options);
        this._type = options.type.toLowerCase();
        const buffers = [];
        for (const data of blobParts) {
            let buffer;
            if (data instanceof Buffer) {
                buffer = new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
            }
            else if (data instanceof ArrayBuffer) {
                buffer = new Uint8Array(data);
            }
            else if (ArrayBuffer.isView(data)) {
                buffer = new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
            }
            else if (data instanceof Blob) {
                buffer = data._buffer;
            }
            else if (typeof data === 'string') {
                buffer = new TextEncoder().encode(data);
            }
            else {
                throw new TypeError('Invalid data type in blobParts');
            }
            buffers.push(buffer);
        }
        let totalByteLength = 0;
        for (const buffer of buffers) {
            totalByteLength += buffer.byteLength;
        }
        this._buffer = new Uint8Array(totalByteLength);
        let offset = 0;
        for (const buffer of buffers) {
            this._buffer.set(buffer, offset);
            offset += buffer.byteLength;
        }
    }
    get size() {
        return this._buffer.byteLength;
    }
    get type() {
        return this._type;
    }
    slice(start = 0, end = this.size, contentType = '') {
        if (start < 0)
            start = this.size + start;
        start = Math.min(this.size, Math.max(0, start));
        if (end < 0)
            end = this.size + end;
        end = Math.min(this.size, Math.max(start, end));
        return new Blob([this._buffer.slice(start, end)], { type: contentType });
    }
}
