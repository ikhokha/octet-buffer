# octet-buffer

[![npm version](https://badge.fury.io/js/octet-buffer.svg)](https://www.npmjs.com/package/octet-buffer)
[![travis status](https://travis-ci.org/eumes/octet-buffer.svg?branch=develop)](https://travis-ci.org/eumes/octet-buffer)

> Streaming access for Node Buffer

A lightweight wrapper around Node's native Buffer implementation, providing continuous read and write operations for various primitive types (uint8 to uint32).

## Usage

### Importing the Module

```js
//typescript
import { OctetBuffer } from './node_modules/src/OctetBuffer.ts';

//javascript
var OctetBuffer = require('octet-buffer');
```

### Initializing a new OctetBuffer

```js
//without any initial content
var octetBuffer = new OctetBuffer();

//with hex string
var hex = 'deadbeef';
var octetBuffer = new OctetBuffer(hex);

//with existing Buffer
var hex = 'deadbeef';
var buffer = new Buffer(hex, 'hex');
var octetBuffer = new OctetBuffer(buffer);
```

### Accessing OctetBuffer Properties

```js
//remaining bytes (or octets if you like) to read
var remaining = octetBuffer.remaining;
//remaining -> 4

//current position from where to read or to where to write next
var position = octetBuffer.position;
//position -> 0

//overall capacity of the backing Buffer
var available = octetBuffer.available;
//available -> 4
```

### Reading Values

```js
//primitives
var num = octetBuffer.readUInt8();
var num = octetBuffer.readUInt16();
var num = octetBuffer.readUInt24();
var num = octetBuffer.readUInt32();

//specific number of bytes
var num = 10
var buffer = octetBuffer.readBuffer(num);

//all remaining
var buffer = octetBuffer.readBufferRemaining();

//next byte without incrementing position
var next = octetBuffer.peek();
```

### Writing Values

> Note: If the backing buffer has not enough capacity for the new data, it will be extended.

```js
//primitives
var num = 22;
octetBuffer.writeUInt8(num);
octetBuffer.writeUInt16(num);
octetBuffer.writeUInt24(num);
octetBuffer.writeUInt32(num);

//array containing bytes
var array = [0xde, 0xad, 0xbe, 0xef];
octetBuffer.writeArray(array);

//another buffer
var buffer = new Buffer('deadbeef', 'hex');
octetBuffer.writeBuffer(buffer);
```

### Additional

```js
//serializing to hex string
var hex = octetBuffer.serialize();
//hex -> 'deadbeef'

//resetting position to 0
octetBuffer.reset();
```

## Development

### Prerequisites

The project is build on `Typescript` for strong javascript typing and uses `DefinitelyTyped` for downloading typescript definitions for development dependencies. In the end, everything is glued together by `Gulp`.

```bash
npm install gulp -g
npm install typescript -g
npm install tsd -g
```

### Build

```bash
gulp build
```

> Note: The ts.d file for the resulting javascript is currently created manually after the build.

### Test

```bash
gulp test
```

## License
```
The MIT License (MIT)

Copyright (c) 2015 Simon Eumes

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
