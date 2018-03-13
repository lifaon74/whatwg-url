import { UnicodeIDNAProcessing, UnicodeIDNAProcessingOption } from '../parser/UnicodeIDNAProcessing';
import { IPv4 } from './IPv4';
import { IPv6 } from './IPv6';
import { StringView } from '../_dependencies/StringView.ts-26f2d4aad97e9bad00cdcd15d216b758b934d509682ae8b608aaaec4d0780756';
import { URLPercentEncoder, URLPercentEncoderSets } from '../URLPercentEncoder';
export class Host {
    static domainToASCII(domain, beStrict = false) {
        return UnicodeIDNAProcessing.unicodeToASCII(domain, false, true, true, beStrict, UnicodeIDNAProcessingOption.nonTransitional, beStrict);
    }
    constructor(input = '', isSpecial = true) {
        if (typeof input === 'string') {
            if (input === '') {
                this._value = '';
            }
            else if (input.startsWith('[')) {
                if (!input.endsWith(']')) {
                    throw new TypeError('Close bracket (]) not found');
                }
                this._value = new IPv6(input.substring(1, input.length - 1));
                this._type = 'ipv6';
            }
            else {
                if (!isSpecial) {
                    const codePoints = new StringView(input);
                    let codePoint;
                    let output = '';
                    const forbiddenHostCodePoints = [0x0000, 0x0009, 0x000a, 0x000d, 0x0020, 0x0023, 0x002f, 0x003a, 0x003f, 0x0040, 0x005b, 0x005c, 0x005d];
                    for (let i = 0, l = codePoints.length; i < l; i++) {
                        codePoint = codePoints.getAt(i);
                        if (forbiddenHostCodePoints.includes(codePoint))
                            throw new TypeError('Invalid host character detected');
                        output += URLPercentEncoder.encodeChar(codePoint, URLPercentEncoderSets.C0Control);
                    }
                    this._value = output;
                    this._type = 'opaque';
                }
                else {
                    const asciiDomain = Host.domainToASCII(URLPercentEncoder.decode(input));
                    const asciiDomainCodePoints = new StringView(asciiDomain);
                    const forbiddenHostCodePoints = [0x0000, 0x0009, 0x000a, 0x000d, 0x0020, 0x0023, 0x0025, 0x002f, 0x003a, 0x003f, 0x0040, 0x005b, 0x005c, 0x005d];
                    for (let i = 0, l = asciiDomainCodePoints.length; i < l; i++) {
                        if (forbiddenHostCodePoints.includes(asciiDomainCodePoints.getAt(i)))
                            throw new TypeError('Invalid domain character detected');
                    }
                    try {
                        this._value = new IPv4(asciiDomain);
                        this._type = 'ipv4';
                    }
                    catch (error) {
                        this._value = asciiDomain;
                        this._type = 'domain';
                    }
                }
            }
        }
        else if (input instanceof Host) {
            this._type = input._type;
            if (typeof input._value === 'string') {
                this._value = input._value;
            }
            else if (input._value instanceof IPv4) {
                this._value = input._value.clone();
            }
            else if (input._value instanceof IPv6) {
                this._value = input._value.clone();
            }
        }
        else {
            throw new TypeError('Invalid Host input');
        }
        if ((typeof this._value === 'string') && (this._value === '')) {
            this._type = 'empty';
        }
    }
    get type() {
        return this._type;
    }
    get value() {
        return this._value;
    }
    clone() {
        return new Host(this);
    }
    toString() {
        switch (this._type) {
            case 'ipv4':
                return this._value.toString();
            case 'ipv6':
                return '[' + this._value.toString() + ']';
            default:
                return this._value;
        }
    }
}
