# UBJSON encoder/decoder

[![npm](https://img.shields.io/npm/v/@shelacek/ubjson.svg)](https://www.npmjs.com/package/@shelacek/ubjson)
[![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@shelacek/ubjson.svg)](https://bundlephobia.com/result?p=@shelacek/ubjson)
[![Bitbucket Pipelines](https://img.shields.io/bitbucket/pipelines/shelacek/ubjson.svg)](https://bitbucket.org/shelacek/ubjson/addon/pipelines/home)
[![Codecov](https://img.shields.io/codecov/c/bb/shelacek/ubjson.svg)](https://codecov.io/bb/shelacek/ubjson)

*Lightweight, quick and dirty UBJSON encoder/decoder for the browser and node.js.*

This library implements [Universal Binary JSON] Draft 12 encoder/decoder in JavaScript.

> ⚠ There are some changes between unstable versions and version 1.0.0. Please have a look
> at the [CHANGELOG.md].

Encoding and decoding working as far as I know. If you encounter an bug, please [create an issue].

[Universal Binary JSON]: http://ubjson.org/
[create an issue]: https://bitbucket.org/shelacek/ubjson/issues
[CHANGELOG.md]: https://bitbucket.org/shelacek/ubjson/src/master/CHANGELOG.md


## Example (browser)

```js
import { Ubjson } from '@shelacek/ubjson';
const buffer = Ubjson.encode({ hello: 'world', from: ['UBJSON'] });
const obj = Ubjson.decode(buffer);
console.log(obj); // { hello: 'world', from: ['UBJSON'] }
```


## Example (node.js)

```js
const ubjson = require('@shelacek/ubjson');
const buffer = ubjson.encode({ hello: 'world', from: ['UBJSON'] });
const obj = ubjson.decode(buffer);
console.log(obj); // { hello: 'world', from: ['UBJSON'] }
```


## API

> Note: For full API and exported symbols, please see typings at
> https://bitbucket.org/shelacek/ubjson/src/master/src/ubjson.d.ts.


### `Ubjson.encode(value, [options])`

- `value: any` - input value/object/array to serialize.
- `options: Object` (optional) - encoding options.
    - `options.optimizeArrays: boolean | 'onlyTypedArrays'` (default `false`) - enable use
      [optimized format] for arrays. If `'onlyTypedArrays'` is used, only *TypedArrays* use strongly
      typed container.
    - `options.optimizeObjects: boolean` (default `false`) - enable use [optimized format]
      for objects.

Method returns `ArrayBuffer` with *UBJSON* data.

[optimized format]: http://ubjson.org/type-reference/container-types/#optimized-format


### `Ubjson.decode(buffer, [options])`

- `buffer: ArrayBuffer` - input buffer with *UBJSON* data.
- `options: Object` (optional) - decoding options.
    - `options.int64Handling: 'error' | 'skip' | 'raw' | UbjsonDecoderCustomHandler` (default `error`) - Handling
      of unsupported *int64* values. 'error' throws exception, 'skip' ignore that value (or key/value pair) and 'raw'
      returns Uint8Array with *int64* bytes.
    - `options.highPrecisionNumberHandling: 'error' | 'skip' | 'raw' | UbjsonDecoderCustomHandler` (default `error`) -
      Handling of unsupported *high-precision numbers*. 'error' throws exception, 'skip' ignore that value
      (or key/value pair) and 'raw' returns string represents of that number.
    - `options.useTypedArrays: boolean` (default `false`) - enable use of *TypedArrays* for strongly
      typed containers.

Method returns decoded *UBJSON* value/object/array (`any`).

`UbjsonDecoderCustomHandler` is function:

```ts
(storage: { array: Uint8Array, view: DataView }, offset: number, byteLength: number) => UbjsonValue;
```


## Limitations

Javascript not support [64-bit integers]&nbsp;(yet) and [high-precision numbers] as well
as the library. You can use `'raw'` option in `int64Handling`/`highPrecisionNumberHandling`
to retrive original data or custom handling function.

[no-op value]: http://ubjson.org/type-reference/value-types/#noop
[64-bit integers]: http://ubjson.org/type-reference/value-types/#numeric-64bit
[high-precision numbers]: http://ubjson.org/type-reference/value-types/#numeric-gt-64bit


## Compatibility

The library needs a `TextEncoder` and `TextDecoder` (or `util.TextEncoder`/`util.TextDecoder`
on node.js), support for `TypedArrays` and `class` keyword. Library should work on
*Firefox*&nbsp;>=45, *Chrome*&nbsp;>=49, *Safari*&nbsp;>=10.1, *Opera*&nbsp;>=36,
*Node*&nbsp;>=8.11.3. *Edge* needs TextEncoder/TextDecoder polyfill.

In case of interest, I can reduce requirements.


## Alternatives

There are some great alternatives:

- [Sannis/node-ubjson] - node.js (only) library, that implements draft 8.
- [artcompiler/L16] - written in asm.js and implements draft 8.
- [zentner-kyle/ubjson.js] - no documentation, but it is cjs module and implements draft 12?!

> *\[Please correct me if this information is obsolete or wrong.\]*

This library was created because I needed to work with UBJSON in browser - and there are no
reasonable draft 12 implementation :-(.

[Sannis/node-ubjson]: https://github.com/Sannis/node-ubjson
[artcompiler/L16]: https://github.com/artcompiler/L16
[zentner-kyle/ubjson.js]: https://github.com/zentner-kyle/ubjson.js
