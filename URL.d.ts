import { URLSearchParams } from './URLSearchParams';
import { _URL } from './URLParser';
export declare class URL {
    protected _url: _URL;
    protected _query: URLSearchParams;
    constructor(url: string, base?: string);
    href: string;
    readonly origin: string;
    protocol: string;
    username: string;
    password: string;
    host: string;
    hostname: string;
    port: string;
    pathname: string;
    search: string;
    readonly searchParams: URLSearchParams;
    hash: string;
    toJSON(): string;
    toString(): string;
}
