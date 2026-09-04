import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
import { ReadableStream, TransformStream } from 'stream/web';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;
global.ReadableStream = ReadableStream as any;
global.TransformStream = TransformStream as any;

const { Request, Response, Headers, fetch, FormData, File } = require('undici');
global.Request = Request as any;
global.Response = Response as any;
global.Headers = Headers as any;
global.fetch = fetch as any;
global.FormData = FormData as any;
global.File = File as any;
