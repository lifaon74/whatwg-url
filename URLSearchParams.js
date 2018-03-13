import { MapLike } from './_dependencies/MapLike.ts-feeaac6e629acf9670b5ec1395d703b34a6ef04c2632d16967121c1ef1953e4d';
import { ApplicationXWWWFormUrlencoded } from './ApplicationXWWWFormUrlencoded';
function UpdateURL(urlSearchParams) {
    if (urlSearchParams._url !== null) {
        urlSearchParams._url._url.query = urlSearchParams.toString();
    }
}
export class URLSearchParams extends MapLike {
    constructor(init) {
        super();
        this[Symbol.toStringTag] = 'URLSearchParams';
        this._url = null;
        if (typeof init === 'string') {
            if (init.startsWith('?'))
                init = init.slice(1);
            init = ApplicationXWWWFormUrlencoded.deserialize(init);
        }
        if (init instanceof URLSearchParams) {
            init._map.forEach((values, name) => {
                values.forEach((value) => {
                    this.append(name, value);
                });
            });
        }
        else if (Array.isArray(init)) {
            for (const pair of init) {
                if (!Array.isArray(pair) || (pair.length !== 2)) {
                    throw new TypeError('\'Failed to construct \'URLSearchParams\': Invalid value');
                }
                else {
                    this.append(pair[0], pair[1]);
                }
            }
        }
        else if (typeof init === 'object') {
            for (const [key, value] of Object.entries(init)) {
                this.set(key, value);
            }
        }
        else {
            throw new TypeError('Failed to construct \'URLSearchParams\': The value provided is neither an array, nor does it have indexed properties.');
        }
    }
    append(name, value) {
        super.append(name, value);
        UpdateURL(this);
    }
    delete(name) {
        super.delete(name);
        UpdateURL(this);
    }
    set(name, value) {
        super.set(name, value);
        UpdateURL(this);
    }
    sort() {
        super.sort();
        UpdateURL(this);
    }
    toString() {
        return ApplicationXWWWFormUrlencoded.serialize(this.entries());
    }
    _getCast(values) {
        return values[0];
    }
    _entriesCast(values) {
        return values;
    }
}
