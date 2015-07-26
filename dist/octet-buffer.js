var OctetBuffer = (function () {
    function OctetBuffer(buffer) {
        if (!buffer) {
            buffer = new Buffer(1);
        }
        this.backingBuffer = buffer;
        this.reset();
    }
    Object.defineProperty(OctetBuffer.prototype, "backingBuffer", {
        get: function () {
            return this._backingBuffer;
        },
        set: function (buffer) {
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
        this.position += incrementBy;
    };
    OctetBuffer.prototype.reset = function () {
        this.position = 0;
    };
    OctetBuffer.prototype.readUInt8 = function () {
        var uint = this.backingBuffer.readUInt8(this.position);
        this.incrementPositionBy(1);
        return uint;
    };
    OctetBuffer.prototype.readUInt16 = function () {
        var uint = this.backingBuffer.readUInt16BE(this.position);
        this.incrementPositionBy(2);
        return uint;
    };
    OctetBuffer.prototype.readUInt24 = function () {
        var uint = OctetBuffer.readUInt24BE(this.backingBuffer, this.position);
        this.incrementPositionBy(3);
        return uint;
    };
    OctetBuffer.prototype.readUInt32 = function () {
        var uint = this.backingBuffer.readUInt32BE(this.position);
        this.incrementPositionBy(4);
        return uint;
    };
    OctetBuffer.prototype.readBufferRemainig = function () {
        var remainingBuffer = this.readBuffer(this.remaining);
        this.incrementPositionBy(remainingBuffer.length);
        return remainingBuffer;
    };
    OctetBuffer.prototype.readBuffer = function (count) {
        if (count === void 0) { count = 1; }
        if (count > this.remaining) {
            return null;
        }
        var readBuffer = new Buffer(count);
        this.backingBuffer.copy(readBuffer, 0, this.position, this.position + count);
        this.incrementPositionBy(count);
        return readBuffer;
    };
    OctetBuffer.prototype.writeUInt8 = function (uint) {
        this.extendBackingBufferToAcceptAdditionalBytes(1);
        this.backingBuffer.writeUInt8(uint, this.position);
        this.incrementPositionBy(1);
        return this;
    };
    OctetBuffer.prototype.writeUInt16 = function (uint) {
        this.extendBackingBufferToAcceptAdditionalBytes(2);
        this.backingBuffer.writeUInt16BE(uint, this.position);
        this.incrementPositionBy(2);
        return this;
    };
    OctetBuffer.prototype.writeUInt24 = function (uint) {
        this.extendBackingBufferToAcceptAdditionalBytes(2);
        OctetBuffer.writeUInt24BE(this.backingBuffer, uint, this.position);
        this.incrementPositionBy(3);
        return this;
    };
    OctetBuffer.prototype.writeUInt32 = function (uint) {
        this.extendBackingBufferToAcceptAdditionalBytes(4);
        this.backingBuffer.writeUInt32BE(uint, this.position);
        this.incrementPositionBy(4);
        return this;
    };
    OctetBuffer.prototype.writeArray = function (array) {
        var buffer = new Buffer(array);
        return this.writeBuffer(buffer);
    };
    OctetBuffer.prototype.writeBuffer = function (buffer) {
        this.extendBackingBufferToAcceptAdditionalBytes(buffer.length);
        this.writeBufferToBackingBuffer(buffer);
        this.incrementPositionBy(buffer.length);
        return this;
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
    OctetBuffer.prototype.toString = function () {
        return this._backingBuffer.toString('hex');
    };
    OctetBuffer.readUInt24BE = function (buffer, position) {
        var uint = 0;
        uint = buffer.readUInt8(position) << 16;
        uint |= buffer.readUInt8(position + 1) << 8;
        uint |= buffer.readUInt8(position + 2) << 0;
        return uint;
    };
    OctetBuffer.writeUInt24BE = function (buffer, uint, positon) {
        buffer.writeUInt8((uint & 0xff0000) >>> 16, positon);
        buffer.writeUInt8((uint & 0x00ff00) >>> 8, positon + 1);
        buffer.writeUInt8((uint & 0x0000ff) >>> 0, positon + 2);
    };
    OctetBuffer.hexStringMatchesHexBitflags = function (value, bitflags) {
        bitflags = bitflags.replace(/\s/g, '');
        var referenceBuffer = new OctetBuffer(new Buffer(value, 'hex'));
        var bitflagsBuffer = new OctetBuffer(new Buffer(bitflags, 'hex'));
        if (referenceBuffer.remaining !== bitflagsBuffer.remaining) {
            return false;
        }
        while (referenceBuffer.remaining > 0) {
            var referenceByte = referenceBuffer.readUInt8();
            var bitflagByte = bitflagsBuffer.readUInt8();
            var bitflagMatches = ((referenceByte & bitflagByte) === bitflagByte);
            if (bitflagMatches === false) {
                return false;
            }
        }
        return true;
    };
    OctetBuffer.hexStringMatchesHexBitpattern = function (value, bitpattern) {
        value = value.replace(/\s/g, '');
        bitpattern = bitpattern.replace(/\s/g, '');
        if (value.length !== bitpattern.length) {
            return false;
        }
        for (var i = 0; i < value.length; i++) {
            var bitpatternBits = bitpattern.charAt(i);
            if (bitpatternBits === 'x') {
                continue;
            }
            if (bitpatternBits === '_') {
                continue;
            }
            var valueBits = value.charAt(i);
            if (valueBits !== bitpatternBits) {
                return false;
            }
        }
        return true;
    };
    return OctetBuffer;
})();
exports.OctetBuffer = OctetBuffer;
