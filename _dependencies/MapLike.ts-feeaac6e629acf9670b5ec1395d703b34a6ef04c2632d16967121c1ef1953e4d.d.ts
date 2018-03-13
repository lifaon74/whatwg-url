import { IterableForEachCallback, IterableMap, IterableIterator } from './Iterable.ts-f8e632057672542afa142967cd22650204ea006b83388a81a145d9ce03e6f831';
export declare abstract class MapLike<TKey = string, TValue = string, TGet = TValue> implements IterableMap<TKey, TGet> {
    protected _map: Map<TKey, TValue[]>;
    constructor();
    readonly size: number;
    append(key: TKey, value: TValue): void;
    delete(key: TKey): void;
    get(key: TKey): TGet | null;
    getAll(key: TKey): TValue[];
    has(key: TKey): boolean;
    set(key: TKey, value: TValue): void;
    sort(): void;
    entries(): IterableIterator<void, [TKey, TGet]>;
    keys(): IterableIterator<void, TKey>;
    values(): IterableIterator<void, TGet>;
    [Symbol.iterator](): IterableIterator<void, [TKey, TGet]>;
    forEach(callback: IterableForEachCallback<TKey, TGet>): void;
    protected abstract _getCast(values: TValue[]): TGet;
    protected abstract _entriesCast(values: TValue[]): TGet[];
}
