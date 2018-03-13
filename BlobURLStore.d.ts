/// <reference types="node" />
import * as http from 'http';
import { Blob } from './_dependencies/Blob.ts-88eb8f0b227e0c051ba48b82a4b85d0de9f0286d13fafa73b3fcad25a76fab4b';
export declare function IsInBlobURLStore(url: string): boolean;
export declare function GetBlobFromBlobURLStore(url: string): Blob;
export declare class BlobURLStore {
    protected static _map: Map<string, Blob>;
    protected static _server: http.Server;
    protected static _blobsCounter: number;
    static objectURLCount: number;
    static createObjectURL(blob: Blob): string;
    static revokeObjectURL(url: string): void;
    static getObjectUrl(url: string): string;
    private static startServer();
    private static stopServer();
}
