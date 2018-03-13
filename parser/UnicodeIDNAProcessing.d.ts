import { StringView } from '../_dependencies/StringView.ts-26f2d4aad97e9bad00cdcd15d216b758b934d509682ae8b608aaaec4d0780756';
export declare enum UnicodeIDNAProcessingOption {
    transitional = 0,
    nonTransitional = 1,
}
export declare class UnicodeIDNAProcessing {
    static findIDNAMappingTableRow(codePoint: number): any[];
    static processing(domainName: string | StringView, checkHyphens: boolean, checkBidi: boolean, checkJoiners: boolean, useSTD3ASCIIRules: boolean, processingOption: UnicodeIDNAProcessingOption): any;
    static checkValidity(label: string, checkHyphens: boolean, processingOption: UnicodeIDNAProcessingOption): void;
    static isCombiningMark(codePoint: number): boolean;
    static unicodeToASCII(domainName: string | StringView, checkHyphens: boolean, checkBidi: boolean, checkJoiners: boolean, useSTD3ASCIIRules: boolean, processingOption: any, verifyDnsLength: boolean): string;
}
