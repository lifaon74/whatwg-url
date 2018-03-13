import { StringView } from './_dependencies/StringView.ts-26f2d4aad97e9bad00cdcd15d216b758b934d509682ae8b608aaaec4d0780756';
import { URLPercentEncoder, URLPercentEncoderSets } from './URLPercentEncoder';
import { Host } from './host/Host';
import { TextEncoder } from './_dependencies/TextEncoder.ts-c32ba39c27162439cc0aa4c8b50286e5073eded99e133aea5e794f9611030e66';
import { CodePoint } from './_dependencies/CodePoint.ts-a6ff8fc91ddbe91b91039796fc57b752bf3e6005b6da72015884be678d5d3acc';
import { GetBlobFromBlobURLStore, IsInBlobURLStore } from './BlobURLStore';
export class Origin {
    static isOpaque(origin) {
        return (origin === null);
    }
    static areSame(origin1, origin2) {
        if (origin1 === null) {
            return (origin2 === null);
        }
        else if (origin2 === null) {
            return false;
        }
        else {
            return (origin1.toString() === origin2.toString());
        }
    }
    constructor(init = {}) {
        this.scheme = '';
        this.host = null;
        this.port = null;
        this.domain = null;
        for (const key in init) {
            if (init.hasOwnProperty(key) && this.hasOwnProperty(key)) {
                this[key] = init[key];
            }
        }
    }
    toURL() {
        return new _URL({
            scheme: this.scheme,
            host: this.host,
            port: this.port,
            domain: this.domain,
        });
    }
    toString() {
        let output = this.scheme + '://';
        if (this.host !== null)
            output += this.host.toString();
        if (this.port !== null)
            output += ':' + this.port.toString();
        return output;
    }
}
export class _URL {
    constructor(init = {}) {
        this.scheme = '';
        this.username = '';
        this.password = '';
        this.host = null;
        this.port = null;
        this.path = [];
        this.query = null;
        this.fragment = null;
        this.cannotBeABaseURL = false;
        this.object = null;
        for (const key in init) {
            if (init.hasOwnProperty(key) && this.hasOwnProperty(key)) {
                this[key] = init[key];
            }
        }
    }
    get origin() {
        switch (this.scheme) {
            case 'blob':
                try {
                    return URLParser.basicURLParser(this.path[0]).origin;
                }
                catch (error) {
                    return null;
                }
            case 'ftp':
            case 'gopher':
            case 'http':
            case 'https':
            case 'ws':
            case 'wss':
                return new Origin({
                    scheme: this.scheme,
                    host: this.host,
                    port: this.port,
                });
            case 'file':
                return new Origin({ scheme: 'file' });
            default:
                return null;
        }
    }
    get pathString() {
        if (this.cannotBeABaseURL) {
            return this.path[0];
        }
        else {
            let output = '';
            for (let i = 0, l = this.path.length; i < l; i++) {
                output += '/' + this.path[i];
            }
            return output;
        }
    }
    isSpecial() {
        return URLParser.isSpecialScheme(this.scheme);
    }
    includesCredentials() {
        return (this.username !== '') || (this.password !== '');
    }
    shortenPath() {
        if (this.path.length === 0)
            return;
        if ((this.scheme === 'file') && (this.path.length === 1) && CodePoint.isNormalizedWindowsDriveLetter(this.path[0]))
            return;
        this.path.pop();
    }
    toString(excludeFragment = false) {
        let output;
        if (this.scheme === 'blob') {
            output = this.scheme + ':' + this.path[0];
        }
        else {
            output = this.scheme + ':';
            if (this.host !== null) {
                output += '//';
                if (this.includesCredentials()) {
                    output += this.username;
                    if (this.password !== '') {
                        output += ':' + this.password;
                    }
                    output += '@';
                }
                output += this.host.toString();
                if (this.port !== null) {
                    output += ':' + this.port.toString();
                }
            }
            else if ((this.host === null) && (this.scheme === 'file')) {
                output += '//';
            }
            output += this.pathString;
            if (this.query !== null) {
                output += '?' + this.query;
            }
            if (!excludeFragment && (this.fragment !== null)) {
                output += '#' + this.fragment;
            }
        }
        return output;
    }
}
export var URLParserState;
(function (URLParserState) {
    URLParserState[URLParserState["SCHEME_START"] = 0] = "SCHEME_START";
    URLParserState[URLParserState["SCHEME"] = 1] = "SCHEME";
    URLParserState[URLParserState["NO_SCHEME"] = 2] = "NO_SCHEME";
    URLParserState[URLParserState["SPECIAL_RELATIVE_OR_AUTHORITY"] = 3] = "SPECIAL_RELATIVE_OR_AUTHORITY";
    URLParserState[URLParserState["PATH_OR_AUTHORITY"] = 4] = "PATH_OR_AUTHORITY";
    URLParserState[URLParserState["RELATIVE"] = 5] = "RELATIVE";
    URLParserState[URLParserState["RELATIVE_SLASH"] = 6] = "RELATIVE_SLASH";
    URLParserState[URLParserState["SPECIAL_AUTHORITY_SLASHES"] = 7] = "SPECIAL_AUTHORITY_SLASHES";
    URLParserState[URLParserState["SPECIAL_AUTHORITY_IGNORE_SLASHES"] = 8] = "SPECIAL_AUTHORITY_IGNORE_SLASHES";
    URLParserState[URLParserState["AUTHORITY"] = 9] = "AUTHORITY";
    URLParserState[URLParserState["HOST"] = 10] = "HOST";
    URLParserState[URLParserState["HOSTNAME"] = 11] = "HOSTNAME";
    URLParserState[URLParserState["PORT"] = 12] = "PORT";
    URLParserState[URLParserState["FILE"] = 13] = "FILE";
    URLParserState[URLParserState["FILE_SLASH"] = 14] = "FILE_SLASH";
    URLParserState[URLParserState["FILE_HOST"] = 15] = "FILE_HOST";
    URLParserState[URLParserState["PATH_START"] = 16] = "PATH_START";
    URLParserState[URLParserState["PATH"] = 17] = "PATH";
    URLParserState[URLParserState["CANNOT_BY_A_BASE_URL_PATH"] = 18] = "CANNOT_BY_A_BASE_URL_PATH";
    URLParserState[URLParserState["QUERY"] = 19] = "QUERY";
    URLParserState[URLParserState["FRAGMENT"] = 20] = "FRAGMENT";
})(URLParserState || (URLParserState = {}));
export class URLParser {
    static defaultValidationError(message) {
    }
    static parse(input, base, encoding) {
        const url = this.basicURLParser(input, base, encoding);
        if ((url.scheme === 'blob') && (url.path.length !== 0) && IsInBlobURLStore(url.path[0])) {
            url.object = GetBlobFromBlobURLStore(url.path[0]);
        }
        return url;
    }
    static basicURLParser(input, base = null, encoding = 'utf-8', url, stateOverride, validationError = this.defaultValidationError) {
        if (url === void 0) {
            url = new _URL();
            let foundInvalidCharactersError = false;
            input = input.replace(/(^[\u0000-\u0020]+)|([\u0000-\u0020]+$)|[\t\r\n]/g, () => {
                foundInvalidCharactersError = true;
                return '';
            });
            if (foundInvalidCharactersError) {
                validationError('Found invalid characters in url.');
            }
        }
        let state = stateOverride || URLParserState.SCHEME_START;
        let buffer = new StringView();
        let flags = {
            '@': false,
            '[]': false,
            'passwordTokenSeenFlag': false,
        };
        const inputCodePoints = new StringView(input);
        let inputCodePoint;
        for (let pointer = 0, inputCodePointsLength = inputCodePoints.length; pointer <= inputCodePointsLength; pointer++) {
            inputCodePoint = inputCodePoints.charAt(pointer);
            switch (state) {
                case URLParserState.SCHEME_START:
                    if (CodePoint.isASCIIAlpha(inputCodePoint)) {
                        buffer.push(StringView.lowerCase(inputCodePoint));
                        state = URLParserState.SCHEME;
                    }
                    else if (stateOverride === void 0) {
                        state = URLParserState.NO_SCHEME;
                        pointer--;
                    }
                    else {
                        validationError('Invalid scheme');
                        throw new TypeError('Invalid scheme');
                    }
                    break;
                case URLParserState.SCHEME:
                    if (CodePoint.isASCIIAlphanumeric(inputCodePoint) || (inputCodePoint === 0x002b) || (inputCodePoint === 0x002d) || (inputCodePoint === 0x002e)) {
                        buffer.push(StringView.lowerCase(inputCodePoint));
                    }
                    else if (inputCodePoint === 0x003a) {
                        if (stateOverride !== void 0) {
                            const isURLSpecialScheme = this.isSpecialScheme(url.scheme);
                            const isBufferSpecialScheme = this.isSpecialScheme(buffer.toString());
                            if (isURLSpecialScheme && !isBufferSpecialScheme)
                                return null;
                            if (!isURLSpecialScheme && isBufferSpecialScheme)
                                return null;
                            if ((url.includesCredentials() || (url.port !== null)) && (buffer.equals('file')))
                                return null;
                            if ((url.scheme === 'file') && ((url.host === null) || (url.host.value === '')))
                                return null;
                        }
                        url.scheme = buffer.toString();
                        if (stateOverride !== void 0) {
                            if (this.isSchemeDefaultPort(url.scheme, url.port))
                                url.port = null;
                            return null;
                        }
                        buffer.empty();
                        if (url.scheme === 'file') {
                            if (!inputCodePoints.startsWith(new Uint32Array([0x002f, 0x002f]), pointer + 1)) {
                                validationError('scheme should be followed by //');
                            }
                            state = URLParserState.FILE;
                        }
                        else if (url.isSpecial() && (base !== null) && (base.scheme === url.scheme)) {
                            state = URLParserState.SPECIAL_RELATIVE_OR_AUTHORITY;
                        }
                        else if (url.isSpecial()) {
                            state = URLParserState.SPECIAL_AUTHORITY_SLASHES;
                        }
                        else if (inputCodePoints.getAt(pointer + 1) === 0x002f) {
                            state = URLParserState.PATH_OR_AUTHORITY;
                            pointer++;
                        }
                        else {
                            url.cannotBeABaseURL = true;
                            url.path.push('');
                            state = URLParserState.CANNOT_BY_A_BASE_URL_PATH;
                        }
                    }
                    else if (stateOverride === void 0) {
                        buffer.empty();
                        state = URLParserState.NO_SCHEME;
                        pointer = -1;
                    }
                    else {
                        validationError('Invalid scheme');
                        throw new TypeError('Invalid scheme');
                    }
                    break;
                case URLParserState.NO_SCHEME:
                    if ((base === null) || ((base.cannotBeABaseURL) && (inputCodePoint !== 0x0023))) {
                        validationError('Expected #');
                        throw new TypeError('Expected #');
                    }
                    else if ((base.cannotBeABaseURL) && (inputCodePoint === 0x0023)) {
                        url.scheme = base.scheme;
                        url.path = base.path.map(_ => _);
                        url.query = base.query;
                        url.fragment = '';
                        url.cannotBeABaseURL = true;
                        state = URLParserState.FRAGMENT;
                    }
                    else if ((base.scheme !== 'file')) {
                        state = URLParserState.RELATIVE;
                        pointer--;
                    }
                    else {
                        state = URLParserState.FILE;
                        pointer--;
                    }
                    break;
                case URLParserState.SPECIAL_RELATIVE_OR_AUTHORITY:
                    if ((inputCodePoint === 0x002f) && (inputCodePoints.charAt(pointer + 1) === 0x002f)) {
                        state = URLParserState.SPECIAL_AUTHORITY_IGNORE_SLASHES;
                        pointer++;
                    }
                    else {
                        validationError('Expected //');
                        state = URLParserState.RELATIVE;
                        pointer--;
                    }
                    break;
                case URLParserState.PATH_OR_AUTHORITY:
                    if (inputCodePoint === 0x002f) {
                        state = URLParserState.AUTHORITY;
                    }
                    else {
                        state = URLParserState.PATH;
                        pointer--;
                    }
                    break;
                case URLParserState.RELATIVE:
                    url.scheme = base.scheme;
                    switch (inputCodePoint) {
                        case StringView.OOR:
                            url.username = base.username;
                            url.password = base.password;
                            url.host = base.host.clone();
                            url.port = base.port;
                            url.path = base.path.map(_ => _);
                            url.query = base.query;
                            break;
                        case 0x002f:
                            state = URLParserState.RELATIVE_SLASH;
                            break;
                        case 0x003f:
                            url.username = base.username;
                            url.password = base.password;
                            url.host = base.host.clone();
                            url.port = base.port;
                            url.path = base.path.map(_ => _);
                            url.query = '';
                            state = URLParserState.QUERY;
                            break;
                        case 0x0023:
                            url.username = base.username;
                            url.password = base.password;
                            url.host = base.host.clone();
                            url.port = base.port;
                            url.path = base.path.map(_ => _);
                            url.query = base.query;
                            url.fragment = '';
                            state = URLParserState.FRAGMENT;
                            break;
                        default:
                            if (url.isSpecial() && (inputCodePoint === 0x005c)) {
                                validationError('Unexpected \\');
                                state = URLParserState.RELATIVE_SLASH;
                            }
                            else {
                                url.username = base.username;
                                url.password = base.password;
                                url.host = base.host.clone();
                                url.port = base.port;
                                url.path = base.path.map(_ => _);
                                url.path.pop();
                                state = URLParserState.PATH;
                                pointer--;
                            }
                            break;
                    }
                    break;
                case URLParserState.RELATIVE_SLASH:
                    if (url.isSpecial() && ((inputCodePoint === 0x002f) || (inputCodePoint === 0x005c))) {
                        if (inputCodePoint === 0x005c) {
                            validationError('Expect / instead of \\');
                        }
                        state = URLParserState.SPECIAL_AUTHORITY_IGNORE_SLASHES;
                    }
                    else if (inputCodePoint === 0x002f) {
                        state = URLParserState.AUTHORITY;
                    }
                    else {
                        url.username = base.username;
                        url.password = base.password;
                        url.host = base.host.clone();
                        url.port = base.port;
                        state = URLParserState.PATH;
                        pointer--;
                    }
                    break;
                case URLParserState.SPECIAL_AUTHORITY_SLASHES:
                    if ((inputCodePoint === 0x002f) && (inputCodePoints.charAt(pointer + 1) === 0x002f)) {
                        state = URLParserState.SPECIAL_AUTHORITY_IGNORE_SLASHES;
                        pointer++;
                    }
                    else {
                        validationError('Expect //');
                        state = URLParserState.SPECIAL_AUTHORITY_IGNORE_SLASHES;
                        pointer--;
                    }
                    break;
                case URLParserState.SPECIAL_AUTHORITY_IGNORE_SLASHES:
                    if ((inputCodePoint !== 0x002f) && (inputCodePoint !== 0x005c)) {
                        state = URLParserState.AUTHORITY;
                        pointer--;
                    }
                    else {
                        validationError('Unexpected / or \\');
                    }
                    break;
                case URLParserState.AUTHORITY:
                    if (inputCodePoint === 0x0040) {
                        validationError('Unexpected @');
                        if (flags['@'])
                            buffer.prepend('%40');
                        flags['@'] = true;
                        let bufferCodePoint;
                        for (let bufferPointer = 0, bufferPointerLength = buffer.length; bufferPointer < bufferPointerLength; bufferPointer++) {
                            bufferCodePoint = buffer.charAt(bufferPointer);
                            if ((bufferCodePoint === 0x003a) && !flags['passwordTokenSeenFlag']) {
                                flags['passwordTokenSeenFlag'] = true;
                                continue;
                            }
                            const encodedCodePoints = URLPercentEncoder.encodeChar(bufferCodePoint, URLPercentEncoderSets.userInfo);
                            if (flags['passwordTokenSeenFlag']) {
                                url.password += encodedCodePoints;
                            }
                            else {
                                url.username += encodedCodePoints;
                            }
                        }
                        buffer.empty();
                    }
                    else if (((inputCodePoint === StringView.OOR) || (inputCodePoint === 0x002f) || (inputCodePoint === 0x003f) || (inputCodePoint === 0x0023)) ||
                        (url.isSpecial() && (inputCodePoint === 0x005c))) {
                        if (flags['@'] && buffer.isEmpty()) {
                            validationError('Expected credentials');
                            throw new TypeError('Expected credentials');
                        }
                        pointer -= buffer.length + 1;
                        buffer.empty();
                        state = URLParserState.HOST;
                    }
                    else {
                        buffer.push(inputCodePoint);
                    }
                    break;
                case URLParserState.HOST:
                case URLParserState.HOSTNAME:
                    if ((stateOverride !== void 0) && (url.scheme === 'file')) {
                        state = URLParserState.FILE_HOST;
                        pointer--;
                    }
                    else if ((inputCodePoint === 0x003a) && !flags['[]']) {
                        if (buffer.isEmpty()) {
                            validationError('Expected host');
                            throw new TypeError('Expected host');
                        }
                        url.host = new Host(buffer.toString(), url.isSpecial());
                        buffer.empty();
                        state = URLParserState.PORT;
                        if (stateOverride === URLParserState.HOSTNAME)
                            return null;
                    }
                    else if (((inputCodePoint === StringView.OOR) || (inputCodePoint === 0x002f) || (inputCodePoint === 0x003f) || (inputCodePoint === 0x0023)) ||
                        (url.isSpecial() && (inputCodePoint === 0x005c))) {
                        pointer--;
                        if (url.isSpecial() && buffer.isEmpty()) {
                            validationError('Host must not be empty');
                            throw new TypeError('Host must not be empty');
                        }
                        else if ((stateOverride !== void 0) && buffer.isEmpty() && (url.includesCredentials() || (url.port !== null))) {
                            validationError('Host must not be empty');
                            return null;
                        }
                        url.host = new Host(buffer.toString(), url.isSpecial());
                        buffer.empty();
                        state = URLParserState.PATH_START;
                        if (stateOverride !== void 0)
                            return null;
                    }
                    else {
                        if (inputCodePoint === 0x005b)
                            flags['[]'] = true;
                        if (inputCodePoint === 0x005d)
                            flags['[]'] = false;
                        buffer.push(inputCodePoint);
                    }
                    break;
                case URLParserState.PORT:
                    if (CodePoint.isASCIIDigit(inputCodePoint)) {
                        buffer.push(inputCodePoint);
                    }
                    else if (((inputCodePoint === StringView.OOR) || (inputCodePoint === 0x002f) || (inputCodePoint === 0x003f) || (inputCodePoint === 0x0023)) ||
                        (url.isSpecial() && (inputCodePoint === 0x005c)) ||
                        (stateOverride !== void 0)) {
                        if (!buffer.isEmpty()) {
                            url.port = parseInt(buffer.toString());
                            if (isNaN(url.port))
                                throw new TypeError('Invalid port');
                            if (url.port > 0xffff) {
                                validationError('Port must be under 0xffff');
                                throw new TypeError('Port must be under 0xffff');
                            }
                            if (this.isSchemeDefaultPort(url.scheme, url.port)) {
                                url.port = null;
                            }
                            buffer.empty();
                        }
                        if (stateOverride !== void 0)
                            return null;
                        state = URLParserState.PATH_START;
                        pointer--;
                    }
                    else {
                        validationError('Invalid port');
                        throw new TypeError('Invalid port');
                    }
                    break;
                case URLParserState.FILE:
                    url.scheme = 'file';
                    if ((inputCodePoint === 0x002f) || (inputCodePoint === 0x005c)) {
                        if (inputCodePoint === 0x005c) {
                            validationError('Unexpected \\');
                        }
                        state = URLParserState.FILE_SLASH;
                    }
                    else if ((base !== null) && (base.scheme === 'file')) {
                        switch (inputCodePoint) {
                            case StringView.OOR:
                                url.host = base.host.clone();
                                url.path = base.path.map(_ => _);
                                url.query = base.query;
                                break;
                            case 0x003f:
                                url.host = base.host.clone();
                                url.path = base.path.map(_ => _);
                                url.query = '';
                                state = URLParserState.QUERY;
                                break;
                            case 0x0023:
                                url.host = base.host.clone();
                                url.path = base.path.map(_ => _);
                                url.query = base.query;
                                url.fragment = '';
                                state = URLParserState.FRAGMENT;
                                break;
                            default:
                                if (!CodePoint.startsWithAWindowsDriveLetter(inputCodePoints.substr(pointer, 3))) {
                                    url.host = base.host.clone();
                                    url.path = base.path.map(_ => _);
                                    url.shortenPath();
                                }
                                else {
                                    validationError('Unexpected char');
                                }
                                state = URLParserState.PATH;
                                pointer--;
                                break;
                        }
                    }
                    else {
                        state = URLParserState.PATH;
                        pointer--;
                    }
                    break;
                case URLParserState.FILE_SLASH:
                    if ((inputCodePoint === 0x002f) || (inputCodePoint === 0x005c)) {
                        if (inputCodePoint === 0x005c) {
                            validationError('Unexpected \\');
                        }
                        state = URLParserState.FILE_HOST;
                    }
                    else {
                        if ((base !== null)
                            && (base.scheme === 'file')
                            && !CodePoint.startsWithAWindowsDriveLetter(inputCodePoints.substr(pointer, 3))) {
                            if (CodePoint.isNormalizedWindowsDriveLetter(base.path[0])) {
                                url.path.push(base.path[0]);
                            }
                            else {
                                url.host = base.host.clone();
                            }
                        }
                        state = URLParserState.PATH;
                        pointer--;
                    }
                    break;
                case URLParserState.FILE_HOST:
                    if ([StringView.OOR, 0x002f, 0x005c, 0x003f, 0x0023].includes(inputCodePoint)) {
                        pointer--;
                        if ((stateOverride === void 0) && CodePoint.isWindowDriveLetter(buffer)) {
                            validationError('Unexpected windows drive letter');
                            state = URLParserState.PATH;
                        }
                        else if (buffer.isEmpty()) {
                            url.host = new Host();
                            if (stateOverride !== void 0)
                                return null;
                            state = URLParserState.PATH_START;
                        }
                        else {
                            url.host = new Host(buffer.toString(), url.isSpecial());
                            if (url.host.value === 'localhost') {
                                url.host = new Host();
                            }
                            if (stateOverride !== void 0)
                                return null;
                            buffer.empty();
                            state = URLParserState.PATH_START;
                        }
                    }
                    else {
                        buffer.push(inputCodePoint);
                    }
                    break;
                case URLParserState.PATH_START:
                    if (url.isSpecial()) {
                        if (inputCodePoint === 0x005c) {
                            validationError('Unexpected \\');
                        }
                        state = URLParserState.PATH;
                        if ((inputCodePoint !== 0x002f) && (inputCodePoint !== 0x005c)) {
                            pointer--;
                        }
                    }
                    else if ((stateOverride === void 0) && (inputCodePoint === 0x003f)) {
                        url.query = '';
                        state = URLParserState.QUERY;
                    }
                    else if ((stateOverride === void 0) && (inputCodePoint === 0x0023)) {
                        url.fragment = '';
                        state = URLParserState.FRAGMENT;
                    }
                    else if (inputCodePoint !== StringView.OOR) {
                        state = URLParserState.PATH;
                        if (inputCodePoint !== 0x002f) {
                            pointer--;
                        }
                    }
                    break;
                case URLParserState.PATH:
                    if (((inputCodePoint === StringView.OOR) || (inputCodePoint === 0x002f)) ||
                        (url.isSpecial() && (inputCodePoint === 0x005c)) ||
                        ((stateOverride === void 0) && ((inputCodePoint === 0x003f) || (inputCodePoint === 0x0023)))) {
                        if (url.isSpecial() && (inputCodePoint === 0x005c)) {
                            validationError('Unexpected \\');
                        }
                        const bufferString = buffer.toString();
                        const isSingleDotPathSegment = CodePoint.isSingleDotPathSegment(bufferString);
                        if (CodePoint.isDoubleDotPathSegment(bufferString)) {
                            url.shortenPath();
                            if ((inputCodePoint !== 0x002f) && !(url.isSpecial() && (inputCodePoint === 0x005c))) {
                                url.path.push('');
                            }
                        }
                        else if (isSingleDotPathSegment &&
                            ((inputCodePoint !== 0x002f) && !(url.isSpecial() && (inputCodePoint === 0x005c)))) {
                            url.path.push('');
                        }
                        else if (!isSingleDotPathSegment) {
                            if ((url.scheme === 'file') && (url.path.length === 0) && CodePoint.isWindowDriveLetter(buffer)) {
                                if ((url.host !== null) && (url.host.value !== '')) {
                                    validationError('Host should be null for files');
                                    url.host = new Host();
                                }
                                buffer.setAt(1, 0x003a);
                            }
                            url.path.push(buffer.toString());
                        }
                        buffer.empty();
                        if ((url.scheme === 'file') && [StringView.OOR, 0x003f, 0x0023].includes(inputCodePoint)) {
                            while ((url.path.length > 1) && (url.path[0] === '')) {
                                validationError('Empty path part found at beginning');
                                url.path.shift();
                            }
                        }
                        if (inputCodePoint === 0x003f) {
                            url.query = '';
                            state = URLParserState.QUERY;
                        }
                        else if (inputCodePoint === 0x0023) {
                            url.fragment = '';
                            state = URLParserState.FRAGMENT;
                        }
                    }
                    else {
                        this.validatePercentEncoded(inputCodePoints, pointer, validationError);
                        buffer.append(URLPercentEncoder.encodeChar(inputCodePoint, URLPercentEncoderSets.path));
                    }
                    break;
                case URLParserState.CANNOT_BY_A_BASE_URL_PATH:
                    if (inputCodePoint === 0x003f) {
                        url.query = '';
                        state = URLParserState.QUERY;
                    }
                    else if (inputCodePoint === 0x0023) {
                        url.fragment = '';
                        state = URLParserState.FRAGMENT;
                    }
                    else {
                        if (inputCodePoint !== StringView.OOR) {
                            this.validatePercentEncoded(inputCodePoints, pointer, validationError);
                            url.path[0] += URLPercentEncoder.encodeChar(inputCodePoint, URLPercentEncoderSets.C0Control);
                        }
                    }
                    break;
                case URLParserState.QUERY:
                    if ((inputCodePoint === StringView.OOR) || ((stateOverride === void 0) && (inputCodePoint === 0x0023))) {
                        if (!url.isSpecial() || (url.scheme === 'ws') || (url.scheme === 'wss')) {
                            encoding = 'utf-8';
                        }
                        const encoded = new TextEncoder().encode(buffer.toString());
                        let byte;
                        for (let i = 0, l = encoded.length; i < l; i++) {
                            byte = encoded[i];
                            if ((byte < 0x21) || (byte > 0x7e) || [0x22, 0x23, 0x3c, 0x3e].includes(byte)) {
                                url.query += URLPercentEncoder.encodeByte(byte);
                            }
                            else {
                                url.query += String.fromCodePoint(byte);
                            }
                        }
                        buffer.empty();
                        if (inputCodePoint === 0x0023) {
                            url.fragment = '';
                            state = URLParserState.FRAGMENT;
                        }
                    }
                    else {
                        this.validatePercentEncoded(inputCodePoints, pointer, validationError);
                        buffer.push(inputCodePoint);
                    }
                    break;
                case URLParserState.FRAGMENT:
                    switch (inputCodePoint) {
                        case StringView.OOR:
                            break;
                        case 0x0000:
                            validationError('Unexpected NULL char');
                            break;
                        default:
                            this.validatePercentEncoded(inputCodePoints, pointer, validationError);
                            url.fragment += URLPercentEncoder.encodeChar(inputCodePoint, URLPercentEncoderSets.fragment);
                            break;
                    }
                    break;
            }
        }
        return url;
    }
    static isSpecialScheme(scheme) {
        return ['ftp', 'file', 'gopher', 'http', 'https', 'ws', 'wss'].includes(scheme);
    }
    static serialize(url) {
        return url.toString();
    }
    static isSchemeDefaultPort(scheme, port) {
        return (scheme in this.SCHEME_DEFAULT_PORTS) && (this.SCHEME_DEFAULT_PORTS[scheme] === port);
    }
    static validatePercentEncoded(input, pointer, validationError) {
        const inputCodePoint = input.getAt(0);
        if (!CodePoint.isURLCodePoint(inputCodePoint) && (inputCodePoint !== 0x0025)) {
            validationError(`Unexpected character : ${String.fromCodePoint(inputCodePoint)} => ${inputCodePoint}`);
        }
        if ((inputCodePoint === 0x0025) &&
            !(CodePoint.isASCIIHexDigit(input.getAt(pointer + 1)) &&
                CodePoint.isASCIIHexDigit(input.getAt(pointer + 2)))) {
            validationError('Expected 2 hex digits after percent sign (%)');
        }
    }
}
URLParser.SCHEME_DEFAULT_PORTS = {
    'ftp': 21,
    'gopher': 70,
    'http': 80,
    'https': 443,
    'ws': 80,
    'wss': 443,
};
