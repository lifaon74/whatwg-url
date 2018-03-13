import * as http from 'http';
import { UUID } from './_dependencies/UUID.ts-efdf5feda27d2ec7ecb1122b98c4257bf41a7e92cceb803b92a68a4982669529';
import { GetOrigin } from './_dependencies/constants.ts-8e3bb9ec7ad17865286918f04d0021f657e4ac1e5583527f7ac69c34385353ea';
import { URLParser } from './URLParser';
export function IsInBlobURLStore(url) {
    return BlobURLStore._map.has(url);
}
export function GetBlobFromBlobURLStore(url) {
    return BlobURLStore._map.get(url);
}
export class BlobURLStore {
    static get objectURLCount() {
        return this._blobsCounter;
    }
    static set objectURLCount(value) {
        this._blobsCounter = value;
        if (this._blobsCounter > 0) {
            this.startServer();
        }
        else {
            this.stopServer();
        }
    }
    static createObjectURL(blob) {
        const blobUrlString = 'blob:' + GetOrigin().toString() + '/' + UUID.get();
        this._map.set(blobUrlString, blob);
        this.objectURLCount++;
        return blobUrlString;
    }
    static revokeObjectURL(url) {
        if (this._map.has(url)) {
            this._map.delete(url);
            this.objectURLCount--;
        }
    }
    static getObjectUrl(url) {
        if (!url.startsWith('blob:')) {
            throw new TypeError('Not a blob url');
        }
        return url.slice(5);
    }
    static startServer() {
        if (this._server === void 0) {
            const origin = GetOrigin();
            this._server = http.createServer((request, response) => {
                const url = URLParser.parse(request.url, origin.toURL());
                const blobUrlString = 'blob:' + url.toString();
                if (this._map.has(blobUrlString)) {
                    const blob = this._map.get(blobUrlString);
                    response.writeHead(200, {
                        'Content-Type': (blob.type || 'application/octet-stream')
                    });
                    const data = blob._buffer;
                    const buffer = Buffer.from(data.buffer, data.byteOffset, data.byteLength);
                    response.write(buffer);
                }
                else {
                    response.writeHead(404);
                }
                response.end();
            });
            this._server.listen((origin.port === null) ? 80 : origin.port);
        }
    }
    static stopServer() {
        if (this._server !== void 0) {
            this._server.close(() => {
                this._server = void 0;
            });
        }
    }
}
BlobURLStore._map = new Map();
BlobURLStore._blobsCounter = 0;
