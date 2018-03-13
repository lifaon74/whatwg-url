import { Blob } from './_dependencies/Blob.ts-88eb8f0b227e0c051ba48b82a4b85d0de9f0286d13fafa73b3fcad25a76fab4b';
import { Base64 } from './_dependencies/Base64.ts-9d61fb178d8427d08bcdc3b454f8802e20928246e1936fe22fa4b2246d91b40a';
import { TextDecoder } from './_dependencies/TextDecoder.ts-4717824bdeccb79673eb6238044dd4dc919f57657b15417de6dfd5364b4d01b9';
export class DataURL {
    static serialize(blob, base64Encode = true) {
        const content = new TextDecoder().decode(blob._buffer);
        return 'data:' + blob.type + (base64Encode ? ';base64' : '') + ','
            + (base64Encode ? Base64.encode(content) : encodeURIComponent(content));
    }
    static deserialize(input) {
        if (!input.startsWith('data:')) {
            throw new Error(`Invalid DataURL : must start with 'data:'`);
        }
        let i = 5;
        for (let l = input.length; i < l; i++) {
            if (input.charCodeAt(i) === 0x002c)
                break;
        }
        if (i === input.length) {
            throw new Error(`Invalid DataURL : must contain comma (,) followed by data`);
        }
        let type = input.substring(5, i);
        let match = (/;base64 *$/g).exec(type);
        let isBase64 = (match !== null);
        if (isBase64)
            type = type.substring(0, match.index);
        const content = decodeURIComponent(input.substring(i + 1));
        return new Blob([
            isBase64
                ? Base64.decode(content)
                : content
        ], { type: type });
    }
}
