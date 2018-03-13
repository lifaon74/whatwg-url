import { StringView } from '../_dependencies/StringView.ts-26f2d4aad97e9bad00cdcd15d216b758b934d509682ae8b608aaaec4d0780756';
export declare class Punycode {
    static maxInt: number;
    static base: number;
    static tMin: number;
    static tMax: number;
    static skew: number;
    static damp: number;
    static initialBias: number;
    static initialN: number;
    static delimiter: number;
    static baseMinusTMin: number;
    static encode(input: string | StringView): string;
    static adapt(delta: number, numPoints: number, firstTime: boolean): number;
    static digitToBasic(digit: number): number;
}
