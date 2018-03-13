export class IPv4 {
    constructor(input) {
        this._address = new Uint8Array(4);
        if (typeof input === 'number') {
            if ((input < 0) || (input >= (2 ** 32))) {
                throw new RangeError('IPv4 as number should be in range [0 - 2^32[');
            }
            for (let i = 0; i < 4; i++) {
                this._address[3 - i] = input % 256;
                input = Math.floor(input / 256);
            }
        }
        else if (typeof input === 'string') {
            const parts = input.split('.');
            if (parts[parts.length - 1] === '') {
                console.warn('IPv4 should not finish by a dot (.)');
                parts.pop();
            }
            if (parts.length > 4)
                throw new TypeError('IPv4 should have no more than 4 members');
            const numbers = [];
            for (let part of parts) {
                if (part === '')
                    throw new TypeError('IPv4 should not have empty members');
                let radix = 10;
                if (part.startsWith('0x') || part.startsWith('0X')) {
                    radix = 16;
                    part = part.substr(2);
                    console.warn('Hex notation detected as IPv4 number');
                }
                else if ((part.length > 2) && part.startsWith('0')) {
                    part = part.substr(1);
                    radix = 8;
                    console.warn('Octal notation detected as IPv4 number');
                }
                const number = parseInt(part, radix);
                if (isNaN(number))
                    throw new Error('Invalid IPv4 number');
                numbers.push(number);
            }
            for (let i = 0; i < numbers.length - 1; i++) {
                if (numbers[i] > 255)
                    throw new TypeError('IPv4 should not have a number greater than 255');
            }
            if (numbers[numbers.length - 1] > (256 ** (5 - numbers.length))) {
                throw new TypeError('IPv4 is invalid');
            }
            let ipv4 = numbers.pop();
            for (let i = 0; i < numbers.length; i++) {
                ipv4 += numbers[i] * (256 ** (3 - i));
            }
            for (let i = 0; i < 4; i++) {
                this._address[3 - i] = ipv4 % 256;
                ipv4 = Math.floor(ipv4 / 256);
            }
        }
        else if (Array.isArray(input) || ArrayBuffer.isView(input)) {
            if (input.length !== 4)
                throw new TypeError('IPv4 should have 4 members');
            for (let i = 0; i < 4; i++) {
                this._address[i] = input[i];
            }
        }
        else if (input instanceof IPv4) {
            this._address.set(input._address);
        }
        else {
            throw new TypeError('Invalid IPv4 input');
        }
    }
    get address() {
        return this._address;
    }
    clone() {
        return new IPv4(this);
    }
    toInt32() {
        let number = 0;
        for (let i = 0; i < 4; i++) {
            number = number * 256 + this._address[i];
        }
        return number;
    }
    toString() {
        let output = '';
        for (let i = 0; i < this._address.length; i++) {
            if (i > 0)
                output += '.';
            output += String(this._address[i]);
        }
        return output;
    }
}
