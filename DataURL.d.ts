import { Blob } from './_dependencies/Blob.ts-88eb8f0b227e0c051ba48b82a4b85d0de9f0286d13fafa73b3fcad25a76fab4b';
export declare class DataURL {
    static serialize(blob: Blob, base64Encode?: boolean): string;
    static deserialize(input: string): Blob;
}
