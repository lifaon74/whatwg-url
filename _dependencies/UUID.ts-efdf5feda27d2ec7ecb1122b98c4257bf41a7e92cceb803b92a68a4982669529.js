export class UUID {
    static get() {
        this.clock++;
        const timestamp = Date.now();
        const time_low = (timestamp & 0xffffffff) >>> 0;
        const time_mid = ((timestamp >> 32) & 0xffff) >>> 0;
        const time_hi_and_version = (((timestamp >> 48) & 0xfff0) | (this.version & 0x000f)) >>> 0;
        const clock_seq_low = this.clock & 0xff;
        const clock_seq_hi_and_reserved = (((this.clock >> 8) & 0b00111111) | 0b01000000);
        const node = Math.floor(Math.random() * (2 ** 48));
        return this.toHex(time_low, 8) + '-' +
            this.toHex(time_mid, 4) + '-' +
            this.toHex(time_hi_and_version, 4) + '-' +
            this.toHex(clock_seq_hi_and_reserved, 2) + this.toHex(clock_seq_low, 2) + '-' +
            this.toHex(node, 12);
    }
    static toHex(number, size) {
        let output = number.toString(16);
        output = '0'.repeat(Math.max(0, size - output.length)) + output;
        return output;
    }
}
UUID.version = 1;
UUID.clock = Math.floor(Math.random() * 0xffffffff);
UUID.node = Math.floor(Math.random() * (2 ** 48));
