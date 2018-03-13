export class MapLike {
    constructor() {
        this._map = new Map();
    }
    get size() {
        return this._map.size;
    }
    append(key, value) {
        let list = this._map.get(key);
        if (list === void 0) {
            list = [];
            this._map.set(key, list);
        }
        list.push(value);
    }
    delete(key) {
        this._map.delete(key);
    }
    get(key) {
        const values = this._map.get(key);
        return (values === void 0) ? null : this._getCast(values);
    }
    getAll(key) {
        const values = this._map.get(key);
        return (values === void 0) ? [] : values;
    }
    has(key) {
        return this._map.has(key);
    }
    set(key, value) {
        this._map.set(key, [value]);
    }
    sort() {
        this._map = new Map([...this._map.entries()].sort());
    }
    *entries() {
        for (const entry of this._map.entries()) {
            for (const value of this._entriesCast(entry[1])) {
                yield [entry[0], value];
            }
        }
    }
    *keys() {
        for (const entry of this.entries()) {
            yield entry[0];
        }
    }
    *values() {
        for (const entry of this.entries()) {
            yield entry[1];
        }
    }
    [Symbol.iterator]() {
        return this.entries();
    }
    forEach(callback) {
        for (const entry of this.entries()) {
            callback.call(this, entry[1], entry[0], this);
        }
    }
}
