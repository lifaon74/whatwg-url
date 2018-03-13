import { _URL, Origin } from '../URLParser';
import { Host } from '../host/Host';
export function GetBaseURL() {
    return new _URL({
        scheme: 'http',
        host: new Host('localhost'),
        port: 80
    });
}
export function GetOrigin() {
    return new Origin({
        scheme: 'http',
        host: new Host('localhost'),
        port: 1234
    });
}
