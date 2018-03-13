import { Constructor } from './types.ts-9635b6186d61d9614c9a0879c9f7731fad9b307eacfc613ac08dead92be51303';
export declare type ArrayBufferView = Int8Array | Uint8Array | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array;
export declare enum CompareResult {
    EQUAL = 0,
    GREATER = 1,
    LESS = 2,
}
export declare type ReallocChunk = [number, number, number];
export declare class DynamicArrayBufferView<T extends ArrayBufferView = Uint8Array> {
    static OOR: number;
    protected _buffer: T;
    protected _start: number;
    protected _end: number;
    protected _startLimit: number;
    protected _endLimit: number;
    constructor(input?: (DynamicArrayBufferView<T> | T));
    getMargins(size: number): [number, number];
    readonly type: Constructor<T>;
    readonly allocated: number;
    readonly length: number;
    typedArray: T;
    set(array: DynamicArrayBufferView<T> | T): this;
    getAt(index: number): number;
    setAt(index: number, value: number): this;
    empty(): this;
    isEmpty(): boolean;
    compact(): this;
    push(value: number): this;
    pop(): number;
    append(array: DynamicArrayBufferView<T> | T): this;
    subtract(array: DynamicArrayBufferView<T> | T): DynamicArrayBufferView<T>;
    unshift(value: number): this;
    shift(): number;
    prepend(array: DynamicArrayBufferView<T> | T): this;
    presubtract(array: DynamicArrayBufferView<T> | T): DynamicArrayBufferView<T>;
    expand(offset: number, shift: number, fillWith?: (number | null)): this;
    concat(array: DynamicArrayBufferView<T> | T): DynamicArrayBufferView<T>;
    fill(value: number, start?: number, end?: number): this;
    slice(start?: number, end?: number): DynamicArrayBufferView<T>;
    subarray(start?: number, end?: number): DynamicArrayBufferView<T>;
    repeat(count: number): DynamicArrayBufferView<T>;
    trimLeft(length: number): this;
    trimRight(length: number): this;
    trim(start: number, end: number): this;
    padStart(length: number, array?: (DynamicArrayBufferView<T>) | T): this;
    padEnd(length: number, array?: (DynamicArrayBufferView<T>) | T): this;
    reverse(): this;
    indexOf(value: number, offset?: number): number;
    indexOfSequence(array: DynamicArrayBufferView<T> | T, offset?: number): number;
    includes(value: number, offset?: number): boolean;
    includesSequence(array: DynamicArrayBufferView<T> | T, offset?: number): boolean;
    compare(array: DynamicArrayBufferView<T> | T): CompareResult;
    equals(array: DynamicArrayBufferView<T> | T): boolean;
    greaterThan(array: DynamicArrayBufferView<T> | T): boolean;
    greaterThanOrEquals(array: DynamicArrayBufferView<T> | T): boolean;
    lessThan(array: DynamicArrayBufferView<T> | T): boolean;
    lessThanOrEquals(array: DynamicArrayBufferView<T> | T): boolean;
    startsWith(array: DynamicArrayBufferView<T> | T, position?: number): boolean;
    endsWith(array: DynamicArrayBufferView<T> | T, position?: number): boolean;
    clone(): DynamicArrayBufferView<T>;
    private _expand(offset, shift, fillWith?);
    private _trim(start, end);
    private _shift(offset, start, end);
    debug(): void;
}
