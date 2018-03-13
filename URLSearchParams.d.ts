import { MapLike } from './_dependencies/MapLike.ts-feeaac6e629acf9670b5ec1395d703b34a6ef04c2632d16967121c1ef1953e4d';
import { KeyValueTupleList } from './_dependencies/types.ts-9635b6186d61d9614c9a0879c9f7731fad9b307eacfc613ac08dead92be51303';
export declare type KeyValuePair = {
    [key: string]: string;
};
export declare type URLSearchParamsInit = KeyValuePair | KeyValueTupleList | URLSearchParams | string;
export declare class URLSearchParams extends MapLike<string, string> {
    [Symbol.toStringTag]: string;
    private _url;
    constructor(init: URLSearchParamsInit);
    append(name: string, value: string): void;
    delete(name: string): void;
    set(name: string, value: string): void;
    sort(): void;
    toString(): string;
    protected _getCast(values: string[]): string;
    protected _entriesCast(values: string[]): string[];
}
