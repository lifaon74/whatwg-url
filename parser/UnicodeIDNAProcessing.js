import { IDNAMappingTable } from './IDNAMappingTable';
import { Punycode } from './Punycode';
import { StringView } from '../_dependencies/StringView.ts-26f2d4aad97e9bad00cdcd15d216b758b934d509682ae8b608aaaec4d0780756';
var IdnaMappingTableStatus;
(function (IdnaMappingTableStatus) {
    IdnaMappingTableStatus[IdnaMappingTableStatus["valid"] = 0] = "valid";
    IdnaMappingTableStatus[IdnaMappingTableStatus["ignored"] = 1] = "ignored";
    IdnaMappingTableStatus[IdnaMappingTableStatus["mapped"] = 2] = "mapped";
    IdnaMappingTableStatus[IdnaMappingTableStatus["deviation"] = 3] = "deviation";
    IdnaMappingTableStatus[IdnaMappingTableStatus["disallowed"] = 4] = "disallowed";
    IdnaMappingTableStatus[IdnaMappingTableStatus["disallowed_STD3_valid"] = 5] = "disallowed_STD3_valid";
    IdnaMappingTableStatus[IdnaMappingTableStatus["disallowed_STD3_mapped"] = 6] = "disallowed_STD3_mapped";
})(IdnaMappingTableStatus || (IdnaMappingTableStatus = {}));
var Idna2008MappingTableStatus;
(function (Idna2008MappingTableStatus) {
    Idna2008MappingTableStatus[Idna2008MappingTableStatus["NV8"] = 0] = "NV8";
    Idna2008MappingTableStatus[Idna2008MappingTableStatus["XV8"] = 1] = "XV8";
})(Idna2008MappingTableStatus || (Idna2008MappingTableStatus = {}));
export var UnicodeIDNAProcessingOption;
(function (UnicodeIDNAProcessingOption) {
    UnicodeIDNAProcessingOption[UnicodeIDNAProcessingOption["transitional"] = 0] = "transitional";
    UnicodeIDNAProcessingOption[UnicodeIDNAProcessingOption["nonTransitional"] = 1] = "nonTransitional";
})(UnicodeIDNAProcessingOption || (UnicodeIDNAProcessingOption = {}));
export class UnicodeIDNAProcessing {
    static findIDNAMappingTableRow(codePoint) {
        let start = 0;
        let end = IDNAMappingTable.length;
        let current;
        let row;
        if (codePoint > IDNAMappingTable[IDNAMappingTable.length - 1][0]) {
            throw new RangeError('codePoint out of range of unicode');
        }
        while (end - start > 0) {
            current = Math.floor((start + end) / 2);
            row = IDNAMappingTable[current];
            const value = row[0];
            if (value < codePoint) {
                start = current + 1;
            }
            else if (value > codePoint) {
                end = current;
            }
            else {
                break;
            }
        }
        current = Math.floor((start + end) / 2);
        row = IDNAMappingTable[current];
        return row;
    }
    static processing(domainName, checkHyphens, checkBidi, checkJoiners, useSTD3ASCIIRules, processingOption) {
        if (typeof domainName === 'string')
            domainName = new StringView(domainName);
        let codePoint;
        let output = new StringView();
        for (let i = 0, l = domainName.length; i < l; i++) {
            codePoint = domainName.getAt(i);
            const row = this.findIDNAMappingTableRow(codePoint);
            let status = row[1];
            switch (status) {
                case IdnaMappingTableStatus.disallowed_STD3_valid:
                    status = useSTD3ASCIIRules ? IdnaMappingTableStatus.disallowed : IdnaMappingTableStatus.valid;
                    break;
                case IdnaMappingTableStatus.disallowed_STD3_mapped:
                    status = useSTD3ASCIIRules ? IdnaMappingTableStatus.disallowed : IdnaMappingTableStatus.mapped;
                    break;
            }
            switch (status) {
                case IdnaMappingTableStatus.disallowed:
                    throw new TypeError('Invalid character');
                case IdnaMappingTableStatus.ignored:
                    break;
                case IdnaMappingTableStatus.mapped:
                    output.push(row[2][0]);
                    break;
                case IdnaMappingTableStatus.deviation:
                    switch (processingOption) {
                        case UnicodeIDNAProcessingOption.transitional:
                            output.push(row[2][0]);
                            break;
                        case UnicodeIDNAProcessingOption.nonTransitional:
                            output.push(codePoint);
                            break;
                    }
                    break;
                case IdnaMappingTableStatus.valid:
                    output.push(codePoint);
                    break;
            }
        }
        const labels = output.toString().split('.');
        for (let i = 0, l = labels.length; i < l; i++) {
            if (labels[i].startsWith('xn--')) {
                labels[i] = 'xn--' + Punycode.encode(labels[i].slice(4));
                this.checkValidity(labels[i], checkHyphens, UnicodeIDNAProcessingOption.nonTransitional);
            }
            else {
                this.checkValidity(labels[i], checkHyphens, processingOption);
            }
        }
        return labels.join('.');
    }
    static checkValidity(label, checkHyphens, processingOption) {
        if (checkHyphens && ((label.charAt(2) === '-') && (label.charAt(3) === '-'))) {
            throw new TypeError('The label must not contain a U+002D HYPHEN-MINUS character in both the third and fourth positions');
        }
        if (checkHyphens && (label.startsWith('-') || label.endsWith('-'))) {
            throw new TypeError('The label must neither begin nor end with a U+002D HYPHEN-MINUS character');
        }
        if (label.includes('.')) {
            throw new TypeError('The label must not contain a U+002E ( . ) FULL STOP');
        }
        if (this.isCombiningMark(label.codePointAt(0))) {
            throw new TypeError('The label must not begin with a combining mark');
        }
        const codePointsLabel = new StringView(label);
        let codePoint;
        for (let i = 0, l = codePointsLabel.length; i < l; i++) {
            codePoint = codePointsLabel.getAt(i);
            const row = this.findIDNAMappingTableRow(codePoint);
            switch (row[1]) {
                case IdnaMappingTableStatus.valid:
                    break;
                case IdnaMappingTableStatus.deviation:
                    if (processingOption !== UnicodeIDNAProcessingOption.nonTransitional) {
                        throw new TypeError('\'deviation\' status only allowed in nonTransitional processing');
                    }
                    break;
                default:
                    throw new TypeError('Invalid  : ' + IdnaMappingTableStatus[row[1]] + ' for U+' + codePoint.toString(16) + ' (' + String.fromCodePoint(codePoint) + ' => ' + codePoint + ')');
            }
        }
    }
    static isCombiningMark(codePoint) {
        return ((0x0300 <= codePoint) && (codePoint <= 0x036f)) ||
            ((0x1ab0 <= codePoint) && (codePoint <= 0x1aff)) ||
            ((0x1dc0 <= codePoint) && (codePoint <= 0x1dff)) ||
            ((0x20d0 <= codePoint) && (codePoint <= 0x20ff)) ||
            ((0xfe20 <= codePoint) && (codePoint <= 0xfe2f));
    }
    static unicodeToASCII(domainName, checkHyphens, checkBidi, checkJoiners, useSTD3ASCIIRules, processingOption, verifyDnsLength) {
        const domainNameProcessed = this.processing(domainName, checkHyphens, checkBidi, checkJoiners, useSTD3ASCIIRules, processingOption);
        const labels = domainNameProcessed.split('.');
        for (let i = 0, l = labels.length; i < l; i++) {
            if (/[^\0-\x7E]/.test(labels[i])) {
                labels[i] = 'xn--' + Punycode.encode(labels[i]);
            }
        }
        if (verifyDnsLength) {
            const l = labels.slice(0, -1).join('').length;
            if ((l < 1) || (l > 253))
                throw new TypeError('Invalid domainName length');
            for (const label of labels) {
                if (labels.length > 63)
                    throw new TypeError('Invalid domainName label length');
            }
        }
        return labels.join('.');
    }
}
