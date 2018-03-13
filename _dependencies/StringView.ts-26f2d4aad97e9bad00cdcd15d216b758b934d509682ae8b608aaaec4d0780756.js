import { DynamicArrayBufferView } from './DynamicArrayBufferView.ts-0a580694d6c0193e5dba6c59d83a6af9a64c4f194b169403dda3ec780abfaf42';
function BytesPerCharToTypedArray(bytesPerChar) {
    switch (bytesPerChar) {
        case 1:
            return Uint8Array;
        case 2:
            return Uint16Array;
        case 4:
            return Uint32Array;
        default:
            throw new TypeError('Invalid bytesPerChar');
    }
}
function TypedArrayToBytesPerChar(array) {
    if (array instanceof Uint8Array) {
        return 1;
    }
    else if (array instanceof Uint16Array) {
        return 2;
    }
    else if (array instanceof Uint32Array) {
        return 4;
    }
    else {
        throw new TypeError('Invalid typedArray');
    }
}
function StringToTypedArray(input, bytesPerChar = 4) {
    const type = BytesPerCharToTypedArray(bytesPerChar);
    if (typeof Array.from === 'function') {
        return new type(Array.from(input).map((char, i) => {
            const codePoint = char.codePointAt(0);
            CheckInvalidCharRange(codePoint, bytesPerChar, i);
            return codePoint;
        }));
    }
    else {
        const length = input.length;
        const buffer = new type(length);
        let index = 0;
        let codePoint;
        for (let i = 0; i < length; i++) {
            codePoint = input.codePointAt(i);
            buffer[index] = codePoint;
            CheckInvalidCharRange(codePoint, bytesPerChar, i);
            if (codePoint > 0xffff)
                i++;
            index++;
        }
        return buffer.subarray(0, index);
    }
}
function TypedArrayToString(buffer) {
    return String.fromCodePoint.apply(String.fromCodePoint, buffer);
}
function CheckInvalidCharRange(codePoint, bytesPerChar, index) {
    if (((codePoint > 0xffff) && (bytesPerChar < 4)) || ((codePoint > 0xff) && (bytesPerChar < 2))) {
        ThrowInvalidCharRange(codePoint, bytesPerChar, index);
    }
}
function ThrowInvalidCharRange(codePoint, bytesPerChar, index) {
    throw new RangeError('The unicode char ' +
        '(0x' + codePoint.toString(16).padStart(8, '0') + ' => ' + String.fromCodePoint(codePoint) + ')' +
        ' requires more than ' + bytesPerChar + ' bytes to be stored' +
        ((index === void 0) ? '' : (' at ' + index)));
}
export class StringView extends DynamicArrayBufferView {
    constructor(input = new Uint32Array(0), bytesPerChar) {
        super(null);
        this.set(input, bytesPerChar);
    }
    static lowerCase(codePoint) {
        return ((0x0041 <= codePoint) && (codePoint <= 0x005a)) ? (codePoint + 0x0020) : codePoint;
    }
    static upperCase(codePoint) {
        return ((0x0061 <= codePoint) && (codePoint <= 0x007a)) ? (codePoint - 0x0020) : codePoint;
    }
    static isWhiteChar(codePoint) {
        for (let i = 0, l = StringView.trimChars.length; i < l; i++) {
            if (codePoint === StringView.trimChars[i])
                return true;
        }
        return false;
    }
    get string() {
        return TypedArrayToString(this.typedArray);
    }
    set string(value) {
        this.set(value);
    }
    get bytesPerChar() {
        return this._bytesPerChar;
    }
    set bytesPerChar(bytesPerChar) {
        if (bytesPerChar < this._bytesPerChar)
            throw new RangeError('bytesPerChar can\'t be lower than previous value.');
        this.set(new (BytesPerCharToTypedArray(bytesPerChar))(this._buffer));
    }
    set(input, bytesPerChar) {
        if (typeof input === 'string') {
            return this.set(StringToTypedArray(input, bytesPerChar));
        }
        else {
            super.set(input);
            this._bytesPerChar = TypedArrayToBytesPerChar(this._buffer);
            return this;
        }
    }
    charAt(index, returnType = 'number') {
        if (returnType === 'string') {
            const char = this.charAt(index, 'number');
            return (char === DynamicArrayBufferView.OOR)
                ? ''
                : String.fromCodePoint(char);
        }
        else if (returnType === 'number') {
            return ((0 <= index) && (index < this.length))
                ? this._buffer[this._start + index]
                : DynamicArrayBufferView.OOR;
        }
        else {
            throw new TypeError('Invalid returnType value');
        }
    }
    setAt(index, value) {
        if (typeof value === 'string') {
            return this.setAt(index, value.codePointAt(0));
        }
        else {
            CheckInvalidCharRange(value, this._bytesPerChar);
            return super.setAt(index, value);
        }
    }
    compact() {
        let bytesPerChar = 1;
        for (let i = this._start; i < this._end; i++) {
            if (this._buffer[i] > 0xffff) {
                bytesPerChar = 4;
                break;
            }
            else if (this._buffer[i] > 0xff) {
                bytesPerChar = 2;
            }
        }
        this.bytesPerChar = bytesPerChar;
        return this;
    }
    push(value) {
        if (typeof value === 'string') {
            return this.push(value.codePointAt(0));
        }
        else {
            CheckInvalidCharRange(value, this._bytesPerChar);
            return super.push(value);
        }
    }
    pop(returnType = 'number') {
        if (returnType === 'string') {
            return String.fromCodePoint(this.pop('number'));
        }
        else if (returnType === 'number') {
            return super.pop();
        }
        else {
            throw new TypeError('Invalid returnType value');
        }
    }
    append(input) {
        if (typeof input === 'string') {
            return this.append(StringToTypedArray(input, this._bytesPerChar));
        }
        else {
            return super.append(input);
        }
    }
    subtract(input) {
        return new StringView(super.subtract(input));
    }
    unshift(value) {
        if (typeof value === 'string') {
            return this.unshift(value.codePointAt(0));
        }
        else {
            CheckInvalidCharRange(value, this._bytesPerChar);
            return super.unshift(value);
        }
    }
    shift(returnType = 'number') {
        if (returnType === 'string') {
            return String.fromCodePoint(this.shift('number'));
        }
        else if (returnType === 'number') {
            return super.shift();
        }
        else {
            throw new TypeError('Invalid returnType value');
        }
    }
    prepend(input) {
        if (typeof input === 'string') {
            return this.prepend(StringToTypedArray(input, this._bytesPerChar));
        }
        else {
            return super.prepend(input);
        }
    }
    presubtract(input) {
        return new StringView(super.presubtract(input));
    }
    expand(offset, shift, fillWith) {
        if (typeof fillWith === 'string') {
            return this.expand(offset, shift, fillWith.codePointAt(0));
        }
        else {
            return super.expand(offset, shift, fillWith);
        }
    }
    concat(input) {
        return new StringView(super.concat(input));
    }
    fill(value, start, end) {
        if (typeof value === 'string') {
            return this.fill(value.codePointAt(0), start, end);
        }
        else {
            return super.fill(value, start, end);
        }
    }
    slice(start, end) {
        return new StringView(super.slice(start, end));
    }
    subarray(start = 0, end = this.length) {
        return new StringView(super.subarray(start, end));
    }
    repeat(count) {
        return new StringView(super.repeat(count));
    }
    trimLeft() {
        return super.trimLeft(this._whiteSpaceLeft());
    }
    trimRight() {
        return super.trimRight(this._whiteSpaceRight());
    }
    trim() {
        return super.trim(this._whiteSpaceLeft(), this._whiteSpaceRight());
    }
    padStart(length, input) {
        if (typeof input === 'string') {
            return this.padStart(length, StringToTypedArray(input, this._bytesPerChar));
        }
        else {
            return super.padStart(length, input);
        }
    }
    padEnd(length, input) {
        if (typeof input === 'string') {
            return this.padEnd(length, StringToTypedArray(input, this._bytesPerChar));
        }
        else {
            return super.padEnd(length, input);
        }
    }
    indexOf(value, offset) {
        if (typeof value === 'string') {
            return this.indexOf(value.codePointAt(0), offset);
        }
        else {
            return super.indexOf(value, offset);
        }
    }
    indexOfSequence(input, offset) {
        if (typeof input === 'string') {
            return this.indexOfSequence(StringToTypedArray(input, this._bytesPerChar), offset);
        }
        else {
            return super.indexOfSequence(input, offset);
        }
    }
    includes(value, offset) {
        if (typeof value === 'string') {
            return this.includes(value.codePointAt(0), offset);
        }
        else {
            return super.includes(value, offset);
        }
    }
    includesSequence(input, offset) {
        if (typeof input === 'string') {
            return this.includesSequence(StringToTypedArray(input, this._bytesPerChar), offset);
        }
        else {
            return super.includesSequence(input, offset);
        }
    }
    substr(start, length = this.length) {
        return this.slice(start, Math.max(0, start) + length);
    }
    substring(start, end = this.length) {
        if (isNaN(start) || (start < 0))
            start = 0;
        if (isNaN(end) || (end < 0))
            end = 0;
        if (end > start) {
            const swap = start;
            start = end;
            end = swap;
        }
        return this.slice(start, end);
    }
    split(separator, limit) {
        return this.toString().split(separator, limit).map(_ => new StringView(_));
    }
    toLowerCase() {
        for (let i = this._start; i < this._end; i++) {
            this._buffer[i] = StringView.lowerCase(this._buffer[i]);
        }
    }
    toUpperCase() {
        for (let i = this._start; i < this._end; i++) {
            this._buffer[i] = StringView.upperCase(this._buffer[i]);
        }
    }
    compare(input) {
        if (typeof input === 'string') {
            return this.compare(StringToTypedArray(input, this._bytesPerChar));
        }
        else {
            return super.compare(input);
        }
    }
    equals(input) {
        if (typeof input === 'string') {
            return this.equals(StringToTypedArray(input, this._bytesPerChar));
        }
        else {
            return super.equals(input);
        }
    }
    greaterThan(input) {
        if (typeof input === 'string') {
            return this.greaterThan(StringToTypedArray(input, this._bytesPerChar));
        }
        else {
            return super.greaterThan(input);
        }
    }
    greaterThanOrEquals(input) {
        if (typeof input === 'string') {
            return this.greaterThanOrEquals(StringToTypedArray(input, this._bytesPerChar));
        }
        else {
            return super.greaterThanOrEquals(input);
        }
    }
    lessThan(input) {
        if (typeof input === 'string') {
            return this.lessThan(StringToTypedArray(input, this._bytesPerChar));
        }
        else {
            return super.lessThan(input);
        }
    }
    lessThanOrEquals(input) {
        if (typeof input === 'string') {
            return this.lessThanOrEquals(StringToTypedArray(input, this._bytesPerChar));
        }
        else {
            return super.lessThanOrEquals(input);
        }
    }
    startsWith(input, position = 0) {
        if (typeof input === 'string') {
            return this.startsWith(StringToTypedArray(input, this._bytesPerChar));
        }
        else {
            return super.startsWith(input);
        }
    }
    endsWith(input, position = this.length) {
        if (typeof input === 'string') {
            return this.endsWith(StringToTypedArray(input, this._bytesPerChar));
        }
        else {
            return super.endsWith(input);
        }
    }
    clone() {
        return new StringView(this.typedArray.slice());
    }
    toString() {
        return this.string;
    }
    valueOf() {
        return this.toString();
    }
    [Symbol.toPrimitive](type) {
        return this.toString();
    }
    get [Symbol.toStringTag]() {
        return 'StringView : ' + this.toString();
    }
    _whiteSpaceLeft() {
        let i = this._start;
        for (; i < this._end; i++) {
            if (!StringView.isWhiteChar(this._buffer[i]))
                break;
        }
        return i;
    }
    _whiteSpaceRight() {
        let i = this._end - 1;
        for (; i >= this._start; i--) {
            if (!StringView.isWhiteChar(this._buffer[i]))
                break;
        }
        return this._end - 1 - i;
    }
}
StringView.trimChars = new Uint16Array([
    0x0020,
    0x000c,
    0x000a,
    0x000d,
    0x0009,
    0x000b,
    0x00a0,
    0x1680,
    0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006, 0x2007, 0x2008, 0x2009, 0x200a,
    0x2028,
    0x2029,
    0x202f,
    0x205f,
    0x3000,
    0xfeff,
]);
