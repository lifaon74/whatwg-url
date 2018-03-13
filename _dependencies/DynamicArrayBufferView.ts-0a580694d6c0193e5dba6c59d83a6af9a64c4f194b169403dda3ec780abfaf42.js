export var CompareResult;
(function (CompareResult) {
    CompareResult[CompareResult["EQUAL"] = 0] = "EQUAL";
    CompareResult[CompareResult["GREATER"] = 1] = "GREATER";
    CompareResult[CompareResult["LESS"] = 2] = "LESS";
})(CompareResult || (CompareResult = {}));
export class DynamicArrayBufferView {
    constructor(input = new Uint8Array(0)) {
        if (input !== null)
            this.set(input);
    }
    getMargins(size) {
        return [Math.max(Math.round(size * 0.1), 10), Math.max(Math.round(size * 0.2), 10)];
    }
    get type() {
        return this._buffer.constructor;
    }
    get allocated() {
        return this._buffer.length;
    }
    get length() {
        return this._end - this._start;
    }
    get typedArray() {
        return this._buffer.subarray(this._start, this._end);
    }
    set typedArray(array) {
        this.set(array);
    }
    set(array) {
        if (array instanceof DynamicArrayBufferView) {
            return this.set(array.typedArray);
        }
        else if (ArrayBuffer.isView(array)) {
            this._buffer = array;
            this._start = 0;
            this._end = this._buffer.length;
            const [startMargin, endMargin] = this.getMargins(array.length);
            this._startLimit = this._start + startMargin;
            this._endLimit = this._end - endMargin;
            return this;
        }
        else {
            throw new TypeError('Expected ArrayBufferView');
        }
    }
    getAt(index) {
        if ((index < 0) || (index >= this.length))
            throw new RangeError('Index out of range');
        return this._buffer[this._start + index];
    }
    setAt(index, value) {
        if ((index < 0) || (index >= this.length))
            throw new RangeError('Index out of range');
        this._buffer[this._start + index] = value;
        return this;
    }
    empty() {
        return this.set(new (this.type)(0));
    }
    isEmpty() {
        return this.length === 0;
    }
    compact() {
        return this.set(this.typedArray);
    }
    push(value) {
        const newEnd = this._end + 1;
        if (newEnd > this._buffer.length) {
            this._expand(this._end - this._start, 1);
        }
        else {
            this._end = newEnd;
        }
        this._buffer[this._end - 1] = value;
        return this;
    }
    pop() {
        const newEnd = this._end - 1;
        const value = this._buffer[newEnd];
        if (newEnd < this._endLimit) {
            this._expand(this._end - this._start, -1);
        }
        else {
            this._end = newEnd;
        }
        return value;
    }
    append(array) {
        if (array instanceof DynamicArrayBufferView) {
            return this.append(array.typedArray);
        }
        else if (ArrayBuffer.isView(array)) {
            const length = array.length;
            const newEnd = this._end + length;
            if (newEnd > this._buffer.length) {
                this._expand(this._end - this._start, length);
            }
            else {
                this._end = newEnd;
            }
            for (let i = 0, offset = this._end - length; i < length; i++) {
                this._buffer[i + offset] = array[i];
            }
            return this;
        }
        else {
            throw new TypeError('Expected ArrayBufferView');
        }
    }
    subtract(array) {
        if (array instanceof DynamicArrayBufferView) {
            return this.subtract(array.typedArray);
        }
        else {
            const length = array.length;
            const newEnd = this._end - length;
            for (let i = 0, offset = this._end - length; i < length; i++) {
                array[i] = this._buffer[i + offset];
            }
            if (newEnd < this._endLimit) {
                this._expand(this._end - this._start, -length);
            }
            else {
                this._end = newEnd;
            }
            return new DynamicArrayBufferView(array);
        }
    }
    unshift(value) {
        const newStart = this._start - 1;
        if (newStart < 0) {
            this._expand(0, 1);
        }
        else {
            this._start = newStart;
        }
        this._buffer[this._start] = value;
        return this;
    }
    shift() {
        const newStart = this._start + 1;
        const value = this._buffer[this._start];
        if (newStart > this._startLimit) {
            this._expand(0, -1);
        }
        else {
            this._start = newStart;
        }
        return value;
    }
    prepend(array) {
        if (array instanceof DynamicArrayBufferView) {
            return this.prepend(array.typedArray);
        }
        else if (ArrayBuffer.isView(array)) {
            const length = array.length;
            const newStart = this._start - length;
            if (newStart < 0) {
                this._expand(0, length);
            }
            else {
                this._start = newStart;
            }
            for (let i = 0; i < length; i++) {
                this._buffer[i + this._start] = array[i];
            }
            return this;
        }
        else {
            throw new TypeError('Expected ArrayBufferView');
        }
    }
    presubtract(array) {
        if (array instanceof DynamicArrayBufferView) {
            return this.presubtract(array.typedArray);
        }
        else {
            const length = array.length;
            const newStart = this._start + length;
            for (let i = 0; i < length; i++) {
                array[i] = this._buffer[i + this._start];
            }
            if (newStart > this._startLimit) {
                this._expand(0, -length);
            }
            else {
                this._start = newStart;
            }
            return new DynamicArrayBufferView(array);
        }
    }
    expand(offset, shift, fillWith = null) {
        if (offset < 0)
            offset += this.length;
        offset = Math.min(Math.max(offset, 0), this.length);
        if (shift < 0)
            shift = Math.max(shift, -(this.length - offset));
        if (offset < (this.length - offset + Math.min(shift, 0))) {
            const newStart = this._start - shift;
            if ((newStart < 0) || (newStart > this._startLimit)) {
                this._expand(offset, shift, fillWith);
            }
            else {
                const end = this._start + offset;
                this._shift(-shift, this._start, end);
                this._start = newStart;
                if (fillWith !== null) {
                    for (let i = end - shift; i < end; i++) {
                        this._buffer[i] = fillWith;
                    }
                }
            }
        }
        else {
            const newEnd = this._end + shift;
            if ((newEnd > this._buffer.length) || (newEnd < this._endLimit)) {
                this._expand(offset, shift, fillWith);
            }
            else {
                const start = this._start + offset - Math.min(shift, 0);
                this._shift(shift, start, this._end);
                this._end = newEnd;
                if (fillWith !== null) {
                    for (let i = start, l = start + shift; i < l; i++) {
                        this._buffer[i] = fillWith;
                    }
                }
            }
        }
        return this;
    }
    concat(array) {
        if (array instanceof DynamicArrayBufferView) {
            return this.concat(array.typedArray);
        }
        else {
            const length1 = this._end - this._start;
            const length2 = array.length;
            const buffer = new (this.type)(length1 + length2);
            for (let i = 0; i < length1; i++)
                buffer[i] = this._buffer[this._start + i];
            for (let i = 0; i < length2; i++)
                buffer[length1 + i] = array[i];
            return new DynamicArrayBufferView(buffer);
        }
    }
    fill(value, start = 0, end = this.length) {
        start = Math.max(start, 0) + this._start;
        end = Math.min(end, this.length) + this._start;
        for (let i = start; i < end; i++)
            this._buffer[i] = value;
        return this;
    }
    slice(start = 0, end = this.length) {
        if (start < 0)
            start += this.length;
        start = Math.min(Math.max(start, 0), this.length);
        if (end < 0)
            end += this.length;
        end = Math.min(Math.max(end, start), this.length);
        const buffer = new (this.type)(end - start);
        for (let i = 0, l = end - start, o = this._start + start; i < l; i++) {
            buffer[i] = this._buffer[i + o];
        }
        return new DynamicArrayBufferView(buffer);
    }
    subarray(start = 0, end = this.length) {
        return new DynamicArrayBufferView(this._buffer.subarray(start, end));
    }
    repeat(count) {
        if ((count < 0) || !Number.isFinite(count))
            throw new RangeError('Count must be in range [ 0, +∞[');
        const buffer = new (this.type)(this.length * count);
        let k = 0;
        for (let i = 0; i < count; i++) {
            for (let j = this._start; j < this._end; j++) {
                buffer[k++] = this._buffer[j];
            }
        }
        return new DynamicArrayBufferView(buffer);
    }
    trimLeft(length) {
        length = Math.min(Math.max(length, 0), this.length);
        this.expand(0, -length);
        return this;
    }
    trimRight(length) {
        length = Math.min(Math.max(length, 0), this.length);
        this.expand(this.length - length, -length);
        return this;
    }
    trim(start, end) {
        start = Math.min(Math.max(start, 0), this.length);
        end = Math.min(Math.max(end, 0), this.length - start);
        const newStart = this._start + start;
        const newEnd = this._end - end;
        if ((newStart > this._startLimit) || (newEnd < this._endLimit)) {
            this._trim(newStart, newEnd);
        }
        else {
            this._start = newStart;
            this._end = newEnd;
        }
        return this;
    }
    padStart(length, array = new (this.type)([0])) {
        if (array instanceof DynamicArrayBufferView) {
            return this.padStart(length, array.typedArray);
        }
        else {
            const d = length - this.length;
            if (d > 0) {
                this.expand(0, d);
                for (let i = 0, arrayLength = array.length; i < d; i++) {
                    this._buffer[this._start + i] = array[i % arrayLength];
                }
            }
            return this;
        }
    }
    padEnd(length, array = new (this.type)([0])) {
        if (array instanceof DynamicArrayBufferView) {
            return this.padEnd(length, array.typedArray);
        }
        else {
            const oldLength = this.length;
            const d = length - oldLength;
            if (d > 0) {
                this.expand(oldLength, d);
                for (let i = 0, arrayLength = array.length, o = this._start + oldLength; i < d; i++) {
                    this._buffer[o + i] = array[i % arrayLength];
                }
            }
            return this;
        }
    }
    reverse() {
        let swap;
        for (let i = this._start, a = this._start + this._end, l = a / 2, o = a - 1; i < l; i++) {
            swap = this._buffer[i];
            this._buffer[i] = this._buffer[o - i];
            this._buffer[o - i] = swap;
        }
        return this;
    }
    indexOf(value, offset = 0) {
        if (offset < 0)
            offset += this.length;
        offset = Math.min(Math.max(offset, 0), this.length);
        offset += this._start;
        for (let i = offset; i < this._end; i++) {
            if (this._buffer[i] === value)
                return (i - this._start);
        }
        return DynamicArrayBufferView.OOR;
    }
    indexOfSequence(array, offset = 0) {
        if (array instanceof DynamicArrayBufferView) {
            return this.indexOfSequence(array.typedArray, offset);
        }
        else {
            if (offset < 0)
                offset += this.length;
            offset = Math.min(Math.max(offset, 0), this.length);
            if ((this.length - offset) < array.length)
                return -1;
            offset += this._start;
            const length = array.length;
            let j;
            for (let i = offset; i < this._end; i++) {
                for (j = 0; j < length; j++) {
                    if (this._buffer[i + j] !== array[j])
                        break;
                }
                if (j === length)
                    return (i - this._start);
            }
            return DynamicArrayBufferView.OOR;
        }
    }
    includes(value, offset = 0) {
        return this.indexOf(value, offset) !== DynamicArrayBufferView.OOR;
    }
    includesSequence(array, offset = 0) {
        return this.indexOfSequence(array, offset) !== DynamicArrayBufferView.OOR;
    }
    compare(array) {
        if (array instanceof DynamicArrayBufferView) {
            return this.compare(array.typedArray);
        }
        else {
            let a, b;
            let length = this._end - this._start;
            for (let i = 0, l = Math.min(length, array.length); i < l; i++) {
                a = array[i];
                b = this._buffer[this._start + i];
                if (a < b) {
                    return CompareResult.GREATER;
                }
                else if (a > b) {
                    return CompareResult.LESS;
                }
            }
            if (length > array.length) {
                return CompareResult.GREATER;
            }
            else if (length < array.length) {
                return CompareResult.LESS;
            }
            else {
                return CompareResult.EQUAL;
            }
        }
    }
    equals(array) {
        if (array instanceof DynamicArrayBufferView) {
            return this.equals(array.typedArray);
        }
        else {
            if (array.length !== this.length)
                return false;
            for (let i = 0, l = array.length; i < l; i++) {
                if (array[i] !== this._buffer[this._start + i])
                    return false;
            }
            return true;
        }
    }
    greaterThan(array) {
        return (this.compare(array) === CompareResult.GREATER);
    }
    greaterThanOrEquals(array) {
        const result = this.compare(array);
        return (result === CompareResult.GREATER) || (result === CompareResult.EQUAL);
    }
    lessThan(array) {
        return (this.compare(array) === CompareResult.LESS);
    }
    lessThanOrEquals(array) {
        const result = this.compare(array);
        return (result === CompareResult.LESS) || (result === CompareResult.EQUAL);
    }
    startsWith(array, position = 0) {
        if (array instanceof DynamicArrayBufferView) {
            return this.startsWith(array.typedArray, position);
        }
        else {
            position = Math.min(this.length, Math.max(0, position));
            if ((this.length - position) < array.length)
                return false;
            position += this._start;
            for (let i = 0, l = array.length; i < l; i++) {
                if (array[i] !== this._buffer[i + position])
                    return false;
            }
            return true;
        }
    }
    endsWith(array, position = this.length) {
        if (array instanceof DynamicArrayBufferView) {
            return this.endsWith(array.typedArray, position);
        }
        else {
            position = Math.min(this.length, Math.max(0, position));
            if (position < array.length)
                return false;
            const offset1 = array.length - 1;
            const offset2 = position + this._start - 1;
            for (let i = 0; i < array.length; i++) {
                if (array[offset1 - i] !== this._buffer[offset2 - i])
                    return false;
            }
            return true;
        }
    }
    clone() {
        return new DynamicArrayBufferView(this.typedArray.slice());
    }
    _expand(offset, shift, fillWith = null) {
        const oldLength = this._end - this._start;
        const newLength = oldLength + shift;
        let [startMargin, endMargin] = this.getMargins(newLength);
        const _buffer = new (this.type)(startMargin + newLength + endMargin);
        for (let i = this._start, l = this._start + offset, o = startMargin - this._start; i < l; i++) {
            _buffer[i + o] = this._buffer[i];
        }
        for (let i = this._start + offset - Math.min(shift, 0), l = this._start + oldLength, o = startMargin + shift - this._start; i < l; i++) {
            _buffer[i + o] = this._buffer[i];
        }
        if (fillWith !== null) {
            for (let i = startMargin + offset, l = i + shift; i < l; i++) {
                _buffer[i] = fillWith;
            }
        }
        this._buffer = _buffer;
        this._start = startMargin;
        this._end = this._start + newLength;
        this._startLimit = this._start + startMargin;
        this._endLimit = this._end - endMargin;
    }
    _trim(start, end) {
        const newLength = end - start;
        let [startMargin, endMargin] = this.getMargins(newLength);
        const _buffer = new (this.type)(startMargin + newLength + endMargin);
        for (let i = start, o = startMargin - start; i < end; i++) {
            _buffer[i + o] = this._buffer[i];
        }
        this._buffer = _buffer;
        this._start = startMargin;
        this._end = this._start + newLength;
        this._startLimit = this._start + startMargin;
        this._endLimit = this._end - endMargin;
    }
    _shift(offset, start, end) {
        if (offset < 0) {
            for (let i = start; i < end; i++) {
                this._buffer[i + offset] = this._buffer[i];
            }
        }
        else if (offset > 0) {
            for (let i = end - 1; i >= start; i--) {
                this._buffer[i + offset] = this._buffer[i];
            }
        }
    }
    debug() {
        console.log(this._buffer, this._start, this._end);
    }
}
DynamicArrayBufferView.OOR = -1;
