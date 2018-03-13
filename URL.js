import { URLSearchParams } from './URLSearchParams';
import { URLParser, URLParserState } from './URLParser';
import { URLPercentEncoder, URLPercentEncoderSets } from './URLPercentEncoder';
import { StringView } from './_dependencies/StringView.ts-26f2d4aad97e9bad00cdcd15d216b758b934d509682ae8b608aaaec4d0780756';
export class URL {
    constructor(url, base) {
        let parsedBase = null;
        if (base !== void 0) {
            try {
                parsedBase = URLParser.basicURLParser(base);
            }
            catch (error) {
                throw new TypeError('Invalid base URL');
            }
        }
        try {
            this._url = URLParser.basicURLParser(url, parsedBase);
        }
        catch (error) {
            throw new TypeError('Invalid URL');
        }
        this._query = new URLSearchParams((this._url.query === null) ? '' : this._url.query);
        this._query._url = this;
    }
    get href() {
        return this._url.toString();
    }
    set href(value) {
        try {
            this._url = URLParser.basicURLParser(value);
        }
        catch (error) {
            throw new TypeError('Invalid URL');
        }
        this._query = new URLSearchParams((this._url.query === null) ? '' : this._url.query);
        this._query._url = this;
    }
    get origin() {
        const origin = this._url.origin;
        return (origin === null) ? 'null' : origin.toString();
    }
    get protocol() {
        return this._url.scheme + ':';
    }
    set protocol(value) {
        URLParser.basicURLParser(value + ':', null, 'utf-8', this._url, URLParserState.SCHEME_START);
    }
    get username() {
        return this._url.username;
    }
    set username(value) {
        if ((this._url.host === null) || (this._url.host.value === '') || this._url.cannotBeABaseURL || (this._url.scheme === 'file'))
            return;
        this._url.username = '';
        const inputCodePoints = new StringView(value);
        for (let i = 0, l = inputCodePoints.length; i < l; i++) {
            this._url.username += URLPercentEncoder.encodeChar(inputCodePoints.charAt(i), URLPercentEncoderSets.userInfo);
        }
    }
    get password() {
        return this._url.password;
    }
    set password(value) {
        if ((this._url.host === null) || (this._url.host.value === '') || this._url.cannotBeABaseURL || (this._url.scheme === 'file'))
            return;
        this._url.password = '';
        const inputCodePoints = new StringView(value);
        for (let i = 0, l = inputCodePoints.length; i < l; i++) {
            this._url.password += URLPercentEncoder.encodeChar(inputCodePoints.charAt(i), URLPercentEncoderSets.userInfo);
        }
    }
    get host() {
        if (this._url.host === null)
            return '';
        if (this._url.port === null)
            return this._url.host.toString();
        return this._url.host.toString() + ':' + this._url.port.toString();
    }
    set host(value) {
        if (this._url.cannotBeABaseURL)
            return;
        URLParser.basicURLParser(value, null, 'utf-8', this._url, URLParserState.HOST);
    }
    get hostname() {
        if (this._url.cannotBeABaseURL)
            return '';
        return this._url.host.toString();
    }
    set hostname(value) {
        if (this._url.cannotBeABaseURL)
            return;
        URLParser.basicURLParser(value, null, 'utf-8', this._url, URLParserState.HOSTNAME);
    }
    get port() {
        if (this._url.port === null)
            return '';
        return this._url.port.toString();
    }
    set port(value) {
        if ((this._url.host === null) || (this._url.host.value === '') || this._url.cannotBeABaseURL || (this._url.scheme === 'file'))
            return;
        if (this._url.port === null) {
            this._url.port = null;
        }
        else {
            URLParser.basicURLParser(value, null, 'utf-8', this._url, URLParserState.PORT);
        }
    }
    get pathname() {
        if (this._url.cannotBeABaseURL)
            return this._url.path[0];
        return '/' + this._url.path.join('/');
    }
    set pathname(value) {
        if (this._url.cannotBeABaseURL)
            return;
        this._url.path = [];
        URLParser.basicURLParser(value, null, 'utf-8', this._url, URLParserState.PATH_START);
    }
    get search() {
        if ((this._url.query === null) || (this._url.query === ''))
            return '';
        return '?' + this._url.query;
    }
    set search(value) {
        if (value === '') {
            this._url.query = null;
        }
        else {
            if (value.startsWith('?'))
                value = value.slice(1);
            this._url.query = '';
            URLParser.basicURLParser(value, null, 'utf-8', this._url, URLParserState.QUERY);
        }
        this._query = new URLSearchParams(value);
        this._query._url = this;
    }
    get searchParams() {
        return this._query;
    }
    get hash() {
        if ((this._url.fragment === null) || (this._url.fragment === ''))
            return '';
        return '#' + this._url.fragment;
    }
    set hash(value) {
        if (value === '') {
            this._url.fragment = null;
        }
        else {
            if (value.startsWith('#'))
                value = value.slice(1);
            this._url.fragment = '';
            URLParser.basicURLParser(value, null, 'utf-8', this._url, URLParserState.FRAGMENT);
        }
    }
    toJSON() {
        return this.href;
    }
    toString() {
        return this.href;
    }
}
