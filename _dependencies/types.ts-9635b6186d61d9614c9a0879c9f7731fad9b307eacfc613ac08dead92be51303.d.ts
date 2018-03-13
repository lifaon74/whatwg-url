/// <reference types="node" />
export declare type BufferSource = ArrayBuffer | ArrayBufferView | Buffer;
export declare type KeyValueTupleList = [string, string][];
export declare type Constructor<T> = new (...args: any[]) => T;
export interface RegExpExecArray extends Array<string> {
    index: number;
    input: string;
    groups?: {
        [key: string]: string;
    };
}
