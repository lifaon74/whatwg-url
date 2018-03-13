import { IterableIterator } from './_dependencies/Iterable.ts-f8e632057672542afa142967cd22650204ea006b83388a81a145d9ce03e6f831';
import { KeyValueTupleList } from './_dependencies/types.ts-9635b6186d61d9614c9a0879c9f7731fad9b307eacfc613ac08dead92be51303';
export declare class ApplicationXWWWFormUrlencoded {
    static deserialize(input: string): KeyValueTupleList;
    static serialize(tuples: KeyValueTupleList | IterableIterator<void, [string, string]>, encoding?: string): string;
    static serializeByteString(bytes: Uint8Array): string;
}
