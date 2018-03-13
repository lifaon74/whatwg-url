import { StringView } from '../_dependencies/StringView.ts-26f2d4aad97e9bad00cdcd15d216b758b934d509682ae8b608aaaec4d0780756';
export class Punycode {
    static encode(input) {
        if (typeof input === 'string')
            input = new StringView(input);
        const output = new StringView();
        let n = this.initialN;
        let delta = 0;
        let bias = this.initialBias;
        const inputLength = input.length;
        for (let i = 0; i < inputLength; i++) {
            if (input.charAt(i) < n)
                output.push(input.charAt(i));
        }
        let basicLength = output.length;
        let handledCPCount = basicLength;
        if (basicLength > 0) {
            output.push(this.delimiter);
        }
        while (handledCPCount < inputLength) {
            let m = this.maxInt;
            let codePoint;
            for (let i = 0; i < inputLength; i++) {
                codePoint = input.charAt(i);
                if ((codePoint >= n) && (codePoint < m)) {
                    m = codePoint;
                }
            }
            const handledCPCountPlusOne = handledCPCount + 1;
            if (m - n > Math.floor((this.maxInt - delta) / handledCPCountPlusOne)) {
                throw new RangeError('Overflow');
            }
            delta += (m - n) * handledCPCountPlusOne;
            n = m;
            for (let i = 0; i < inputLength; i++) {
                codePoint = input.charAt(i);
                if ((codePoint < n) && (++delta > this.maxInt)) {
                    throw new RangeError('Overflow');
                }
                if (codePoint === n) {
                    let q = delta;
                    for (let k = this.base;; k += this.base) {
                        const t = (k <= bias) ?
                            this.tMin :
                            ((k >= (bias + this.tMax)) ?
                                this.tMax :
                                k - bias);
                        if (q < t)
                            break;
                        const qMinusT = q - t;
                        const baseMinusT = this.base - t;
                        output.push(this.digitToBasic(t + qMinusT % baseMinusT));
                        q = Math.floor(qMinusT / baseMinusT);
                    }
                    output.push(this.digitToBasic(q));
                    bias = this.adapt(delta, handledCPCountPlusOne, handledCPCount === basicLength);
                    delta = 0;
                    handledCPCount++;
                }
            }
            delta++;
            n++;
        }
        return output.toString();
    }
    static adapt(delta, numPoints, firstTime) {
        let k = 0;
        delta = firstTime ? Math.floor(delta / this.damp) : (delta >> 1);
        delta += Math.floor(delta / numPoints);
        for (; delta > (this.baseMinusTMin * (this.tMax >> 1)); k += this.base) {
            delta = Math.floor(delta / this.baseMinusTMin);
        }
        return Math.floor(k + (((this.baseMinusTMin + 1) * delta) / (delta + this.skew)));
    }
    ;
    static digitToBasic(digit) {
        return digit + 22 + 75 * (digit < 26);
    }
    ;
}
Punycode.maxInt = 0x7FFFFFFF;
Punycode.base = 36;
Punycode.tMin = 1;
Punycode.tMax = 26;
Punycode.skew = 38;
Punycode.damp = 700;
Punycode.initialBias = 72;
Punycode.initialN = 0x80;
Punycode.delimiter = 0x2d;
Punycode.baseMinusTMin = Punycode.base - Punycode.tMin;
