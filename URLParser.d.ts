import { Blob } from './_dependencies/Blob.ts-88eb8f0b227e0c051ba48b82a4b85d0de9f0286d13fafa73b3fcad25a76fab4b';
import { Host } from './host/Host';
export declare class Origin {
    static isOpaque(origin: null | Origin): boolean;
    static areSame(origin1: null | string | Origin, origin2: null | string | Origin): boolean;
    scheme: string;
    host: null | Host;
    port: null | number;
    domain: null | string;
    constructor(init?: any);
    toURL(): _URL;
    toString(): string;
}
export declare class _URL {
    scheme: string;
    username: string;
    password: string;
    host: null | Host;
    port: null | number;
    path: string[];
    query: null | string;
    fragment: null | string;
    cannotBeABaseURL: boolean;
    object: null | Blob;
    constructor(init?: any);
    readonly origin: null | Origin;
    readonly pathString: string;
    isSpecial(): boolean;
    includesCredentials(): boolean;
    shortenPath(): void;
    toString(excludeFragment?: boolean): string;
}
export declare enum URLParserState {
    SCHEME_START = 0,
    SCHEME = 1,
    NO_SCHEME = 2,
    SPECIAL_RELATIVE_OR_AUTHORITY = 3,
    PATH_OR_AUTHORITY = 4,
    RELATIVE = 5,
    RELATIVE_SLASH = 6,
    SPECIAL_AUTHORITY_SLASHES = 7,
    SPECIAL_AUTHORITY_IGNORE_SLASHES = 8,
    AUTHORITY = 9,
    HOST = 10,
    HOSTNAME = 11,
    PORT = 12,
    FILE = 13,
    FILE_SLASH = 14,
    FILE_HOST = 15,
    PATH_START = 16,
    PATH = 17,
    CANNOT_BY_A_BASE_URL_PATH = 18,
    QUERY = 19,
    FRAGMENT = 20,
}
export declare class URLParser {
    static defaultValidationError(message: string): void;
    static SCHEME_DEFAULT_PORTS: {
        [key: string]: number;
    };
    static parse(input: string, base?: _URL | null, encoding?: string): _URL;
    static basicURLParser(input: string, base?: _URL | null, encoding?: string, url?: _URL, stateOverride?: URLParserState, validationError?: ((message: string) => void)): _URL | null;
    static isSpecialScheme(scheme: string): boolean;
    static serialize(url: _URL): string;
    private static isSchemeDefaultPort(scheme, port);
    private static validatePercentEncoded(input, pointer, validationError);
}
