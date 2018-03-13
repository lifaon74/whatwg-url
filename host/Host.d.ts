import { IPv4 } from './IPv4';
import { IPv6 } from './IPv6';
export declare type HostType = 'domain' | 'ipv4' | 'ipv6' | 'opaque' | 'empty';
export declare class Host {
    static domainToASCII(domain: string, beStrict?: boolean): string;
    _type: HostType;
    _value: string | IPv4 | IPv6;
    constructor(input?: (string | Host), isSpecial?: boolean);
    readonly type: HostType;
    readonly value: string | IPv4 | IPv6;
    clone(): Host;
    toString(): string;
}
