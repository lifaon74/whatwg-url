export class Base64 {
    static encode(input) {
        return new Buffer(input).toString('base64');
    }
    static decode(input) {
        return new Buffer(input, 'base64').toString();
    }
}
export function btoa(input) {
    return Base64.encode(input);
}
export function atob(input) {
    return Base64.decode(input);
}
