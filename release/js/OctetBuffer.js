var OctetBufferError = (function () {
    function OctetBufferError(name, message) {
        this.name = name;
        this.message = message;
    }
    OctetBufferError.errorReadingCausedByInsufficientBytes = function (type, missingBytes) {
        return new OctetBufferError('Error reading <' + type + '>', 'Buffer is missing ' + missingBytes + ' bytes');
    };
    OctetBufferError.errorConstructorWrongParameterType = function () {
        return new OctetBufferError('Error creating <OctetBuffer>', 'Provided constructor parameter is not valid');
    };
    OctetBufferError.errorMethodWrongParameterType = function () {
        return new OctetBufferError('Error interacting with <OctetBuffer>', 'Provided parameter is not valid');
    };
    return OctetBufferError;
})();
var UINT8_BYTES = 1;
var UINT16_BYTES = 2;
var UINT24_BYTES = 3;
var UINT32_BYTES = 4;
var OctetBuffer = (function () {
    function OctetBuffer(param) {
        if (typeof param === 'string') {
            var string = param;
            string = string.toUpperCase();
            var buffer = new Buffer(string, 'hex');
            this.backingBuffer = buffer;
        }
        else if (Buffer.isBuffer(param)) {
            this.backingBuffer = param;
        }
        else if (param == null) {
            this.backingBuffer = new Buffer(0);
        }
        else {
            throw OctetBufferError.errorConstructorWrongParameterType();
        }
        this.reset();
    }
    Object.defineProperty(OctetBuffer.prototype, "backingBuffer", {
        get: function () {
            return this._backingBuffer;
        },
        set: function (buffer) {
            this.checkParameterIsBuffer(buffer);
            this._backingBuffer = buffer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OctetBuffer.prototype, "position", {
        get: function () {
            return this._position;
        },
        set: function (position) {
            this._position = position;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OctetBuffer.prototype, "available", {
        get: function () {
            return this.backingBuffer.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OctetBuffer.prototype, "remaining", {
        get: function () {
            return this.available - this.position;
        },
        enumerable: true,
        configurable: true
    });
    OctetBuffer.prototype.incrementPositionBy = function (incrementBy) {
        this.checkParameterIsNumber(incrementBy);
        this.position += incrementBy;
    };
    OctetBuffer.prototype.reset = function () {
        this.position = 0;
    };
    OctetBuffer.prototype.readUInt8 = function () {
        this.checkRemainingBytesAndThrow('uint8', UINT8_BYTES);
        var uint = this.backingBuffer.readUInt8(this.position);
        this.incrementPositionBy(UINT8_BYTES);
        return uint;
    };
    OctetBuffer.prototype.readUInt16 = function () {
        this.checkRemainingBytesAndThrow('uint16', UINT16_BYTES);
        var uint = this.backingBuffer.readUInt16BE(this.position);
        this.incrementPositionBy(UINT16_BYTES);
        return uint;
    };
    OctetBuffer.prototype.readUInt24 = function () {
        this.checkRemainingBytesAndThrow('uint24', UINT24_BYTES);
        var uint = OctetBuffer.readUInt24BE(this.backingBuffer, this.position);
        this.incrementPositionBy(UINT24_BYTES);
        return uint;
    };
    OctetBuffer.prototype.readUInt32 = function () {
        this.checkRemainingBytesAndThrow('uint32', UINT32_BYTES);
        var uint = this.backingBuffer.readUInt32BE(this.position);
        this.incrementPositionBy(UINT32_BYTES);
        return uint;
    };
    OctetBuffer.prototype.readBuffer = function (count) {
        if (count === void 0) { count = 1; }
        this.checkParameterIsNumber(count);
        this.checkRemainingBytesAndThrow('Buffer', count);
        var readBuffer = new Buffer(count);
        this.backingBuffer.copy(readBuffer, 0, this.position, this.position + count);
        this.incrementPositionBy(count);
        return readBuffer;
    };
    OctetBuffer.prototype.readBufferRemaining = function () {
        var readBuffer = this.readBuffer(this.remaining);
        return readBuffer;
    };
    OctetBuffer.prototype.writeUInt8 = function (uint) {
        this.checkParameterIsNumber(uint);
        this.extendBackingBufferToAcceptAdditionalBytes(UINT8_BYTES);
        OctetBuffer.writeUInt8(this.backingBuffer, uint, this.position);
        this.incrementPositionBy(UINT8_BYTES);
        return this;
    };
    OctetBuffer.prototype.writeUInt16 = function (uint) {
        this.checkParameterIsNumber(uint);
        this.extendBackingBufferToAcceptAdditionalBytes(UINT16_BYTES);
        OctetBuffer.writeUInt16BE(this.backingBuffer, uint, this.position);
        this.incrementPositionBy(UINT16_BYTES);
        return this;
    };
    OctetBuffer.prototype.writeUInt24 = function (uint) {
        this.checkParameterIsNumber(uint);
        this.extendBackingBufferToAcceptAdditionalBytes(UINT24_BYTES);
        OctetBuffer.writeUInt24BE(this.backingBuffer, uint, this.position);
        this.incrementPositionBy(UINT24_BYTES);
        return this;
    };
    OctetBuffer.prototype.writeUInt32 = function (uint) {
        this.checkParameterIsNumber(uint);
        this.extendBackingBufferToAcceptAdditionalBytes(UINT32_BYTES);
        OctetBuffer.writeUInt32BE(this.backingBuffer, uint, this.position);
        this.incrementPositionBy(UINT32_BYTES);
        return this;
    };
    OctetBuffer.prototype.writeArray = function (array) {
        this.checkParameterIsArray(array);
        var buffer = new Buffer(array);
        return this.writeBuffer(buffer);
    };
    OctetBuffer.prototype.writeBuffer = function (buffer) {
        this.checkParameterIsBuffer(buffer);
        this.extendBackingBufferToAcceptAdditionalBytes(buffer.length);
        this.writeBufferToBackingBuffer(buffer);
        this.incrementPositionBy(buffer.length);
        return this;
    };
    OctetBuffer.prototype.serialize = function () {
        var hex = this._backingBuffer.toString('hex');
        hex = hex.toUpperCase();
        return hex;
    };
    OctetBuffer.prototype.peek = function () {
        this.checkRemainingBytesAndThrow('uint8', UINT8_BYTES);
        var uint = this.backingBuffer.readUInt8(this.position);
        return uint;
    };
    OctetBuffer.prototype.extendBackingBufferToAcceptAdditionalBytes = function (additionalBytes) {
        if (this.remaining >= additionalBytes) {
            return;
        }
        var missingBytes = additionalBytes - this.remaining;
        var extendedBuffer = new Buffer(this.available + missingBytes);
        this.backingBuffer.copy(extendedBuffer, 0, 0, this.available);
        this.backingBuffer = extendedBuffer;
    };
    OctetBuffer.prototype.writeBufferToBackingBuffer = function (buffer) {
        buffer.copy(this.backingBuffer, this.position, 0, buffer.length);
    };
    OctetBuffer.readUInt24BE = function (buffer, position) {
        var uint = 0;
        uint = buffer.readUInt8(position) << 16;
        uint |= buffer.readUInt8(position + 1) << 8;
        uint |= buffer.readUInt8(position + 2) << 0;
        return uint;
    };
    OctetBuffer.writeUInt8 = function (buffer, uint, positon) {
        buffer.writeUInt8((uint & 0xff) >>> 0, positon);
    };
    OctetBuffer.writeUInt16BE = function (buffer, uint, positon) {
        buffer.writeUInt8((uint & 0xff00) >>> 8, positon);
        buffer.writeUInt8((uint & 0x00ff) >>> 0, positon + 1);
    };
    OctetBuffer.writeUInt24BE = function (buffer, uint, positon) {
        buffer.writeUInt8((uint & 0xff0000) >>> 16, positon);
        buffer.writeUInt8((uint & 0x00ff00) >>> 8, positon + 1);
        buffer.writeUInt8((uint & 0x0000ff) >>> 0, positon + 2);
    };
    OctetBuffer.writeUInt32BE = function (buffer, uint, positon) {
        buffer.writeUInt8((uint & 0xff000000) >>> 24, positon);
        buffer.writeUInt8((uint & 0x00ff0000) >>> 16, positon + 1);
        buffer.writeUInt8((uint & 0x0000ff00) >>> 8, positon + 2);
        buffer.writeUInt8((uint & 0x000000ff) >>> 0, positon + 3);
    };
    OctetBuffer.prototype.checkRemainingBytesAndThrow = function (type, requiredBytes) {
        if (requiredBytes > this.remaining) {
            var missingBytes = requiredBytes - this.remaining;
            throw OctetBufferError.errorReadingCausedByInsufficientBytes(type, missingBytes);
        }
    };
    OctetBuffer.prototype.checkParameterIsNumber = function (param) {
        if (param == null) {
            throw OctetBufferError.errorMethodWrongParameterType();
        }
        else if (typeof param !== 'number') {
            throw OctetBufferError.errorMethodWrongParameterType();
        }
    };
    OctetBuffer.prototype.checkParameterIsArray = function (param) {
        if (param == null) {
            throw OctetBufferError.errorMethodWrongParameterType();
        }
        else if (!Array.isArray(param)) {
            throw OctetBufferError.errorMethodWrongParameterType();
        }
    };
    OctetBuffer.prototype.checkParameterIsBuffer = function (param) {
        if (param == null) {
            throw OctetBufferError.errorMethodWrongParameterType();
        }
        else if (!Buffer.isBuffer(param)) {
            throw OctetBufferError.errorMethodWrongParameterType();
        }
    };
    return OctetBuffer;
})();
exports.OctetBuffer = OctetBuffer;
