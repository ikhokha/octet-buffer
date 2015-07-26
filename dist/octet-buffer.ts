import events = require("events");
import net = require("net");
import stream = require("stream");
import child  = require("child_process");
import tls = require("tls");
import http = require("http");
import crypto = require("crypto");
export class OctetBuffer {

        private _backingBuffer: Buffer;
        private _position: number;

        get backingBuffer(): Buffer {
            return this._backingBuffer;
        }
        set backingBuffer(buffer: Buffer) {
            this._backingBuffer = buffer;
        }

        get position(): number {
            return this._position;
        }

        set position(position: number) {
            this._position = position;
        }

        get available(): number {
            return this.backingBuffer.length;
        }

        get remaining(): number {
            return this.available - this.position;
        }

        constructor(buffer?: Buffer) {
            if (!buffer){
                buffer = new Buffer(1);
            }
            this.backingBuffer = buffer;
            this.reset();
        }

        private incrementPositionBy(incrementBy: number): void {
            this.position += incrementBy;
        }

        reset(): void {
            this.position = 0;
        }

        readUInt8(): number {
            //TODO: throw error here!
            var uint: number = this.backingBuffer.readUInt8(this.position);
            this.incrementPositionBy(1);
            return uint;
        }
        readUInt16(): number {
            //TODO: throw error here!
            var uint: number = this.backingBuffer.readUInt16BE(this.position);
            this.incrementPositionBy(2);
            return uint;
        }
        readUInt24(): number {
            //TODO: throw error here!
            var uint: number = OctetBuffer.readUInt24BE(this.backingBuffer, this.position);
            this.incrementPositionBy(3);
            return uint;
        }
        readUInt32(): number {
            //TODO: throw error here!
            var uint: number = this.backingBuffer.readUInt32BE(this.position);
            this.incrementPositionBy(4);
            return uint;
        }

        readBufferRemainig(): Buffer {
            //TODO: throw error here!
            var remainingBuffer = this.readBuffer(this.remaining);
            this.incrementPositionBy(remainingBuffer.length);
            return remainingBuffer;
        }

        readBuffer(count: number = 1): Buffer {
            if (count > this.remaining) {
                //TODO: throw error here!
                //console.log("not enough data available, stopping now");
                return null;
            }

            var readBuffer = new Buffer(count);
            this.backingBuffer.copy(readBuffer, 0, this.position, this.position + count);
            this.incrementPositionBy(count);
            return readBuffer;
        }

        writeUInt8(uint: number): OctetBuffer {
            this.extendBackingBufferToAcceptAdditionalBytes(1);
            this.backingBuffer.writeUInt8(uint, this.position);
            this.incrementPositionBy(1);
            return this;
        }

        writeUInt16(uint: number): OctetBuffer {
            this.extendBackingBufferToAcceptAdditionalBytes(2);
            this.backingBuffer.writeUInt16BE(uint, this.position);
            this.incrementPositionBy(2);
            return this;
        }
        writeUInt24(uint: number): OctetBuffer {
            this.extendBackingBufferToAcceptAdditionalBytes(2);
            OctetBuffer.writeUInt24BE(this.backingBuffer, uint, this.position);
            this.incrementPositionBy(3);
            return this;
        }
        writeUInt32(uint: number): OctetBuffer {
            this.extendBackingBufferToAcceptAdditionalBytes(4);
            this.backingBuffer.writeUInt32BE(uint, this.position);
            this.incrementPositionBy(4);
            return this;
        }

        writeArray(array: number[]): OctetBuffer {
            var buffer = new Buffer(array);
            return this.writeBuffer(buffer);
        }

        writeBuffer(buffer: Buffer): OctetBuffer {
            this.extendBackingBufferToAcceptAdditionalBytes(buffer.length);
            this.writeBufferToBackingBuffer(buffer);
            this.incrementPositionBy(buffer.length);
            return this;
        }

        private extendBackingBufferToAcceptAdditionalBytes(additionalBytes: number): void {
            if (this.remaining >= additionalBytes) {
                return;
            }

            var missingBytes = additionalBytes - this.remaining;
            var extendedBuffer = new Buffer(this.available + missingBytes);
            this.backingBuffer.copy(extendedBuffer, 0, 0, this.available);
            this.backingBuffer = extendedBuffer;
        }

        private writeBufferToBackingBuffer(buffer: Buffer): void {
            buffer.copy(this.backingBuffer, this.position, 0, buffer.length);
        }

        toString(): string {
            return this._backingBuffer.toString('hex');
        }

        private static readUInt24BE(buffer: Buffer, position: number): number {
            var uint: number = 0;
            uint = buffer.readUInt8(position) << 16;
            uint |= buffer.readUInt8(position + 1) << 8;
            uint |= buffer.readUInt8(position + 2) << 0;
            return uint;
        }

        private static writeUInt24BE(buffer: Buffer, uint: number, positon: number): void {
            buffer.writeUInt8((uint & 0xff0000) >>> 16, positon);
            buffer.writeUInt8((uint & 0x00ff00) >>> 8, positon + 1);
            buffer.writeUInt8((uint & 0x0000ff) >>> 0, positon + 2);
        }

        public static hexStringMatchesHexBitflags(value: string, bitflags: string): boolean {
            bitflags = bitflags.replace(/\s/g, '');
            var referenceBuffer: OctetBuffer = new OctetBuffer(new Buffer(value, 'hex'));
            var bitflagsBuffer: OctetBuffer = new OctetBuffer(new Buffer(bitflags, 'hex'));

            if (referenceBuffer.remaining !== bitflagsBuffer.remaining){
                return false;
            }

            while (referenceBuffer.remaining > 0){
                var referenceByte: number = referenceBuffer.readUInt8();
                var bitflagByte: number = bitflagsBuffer.readUInt8();
                var bitflagMatches: boolean = ((referenceByte & bitflagByte) === bitflagByte);
                if (bitflagMatches === false){
                    return false;
                }
            }
            return true;
        }

        public static hexStringMatchesHexBitpattern(value: string, bitpattern: string): boolean {
            value = value.replace(/\s/g, '');
            bitpattern = bitpattern.replace(/\s/g, '');

            if (value.length !== bitpattern.length){
                return false;
            }

            for (var i: number = 0; i < value.length; i++){
                var bitpatternBits: string = bitpattern.charAt(i);
                if (bitpatternBits === 'x'){
                    continue;
                }
                if (bitpatternBits === '_'){
                    continue;
                }

                var valueBits: string = value.charAt(i);
                if (valueBits !== bitpatternBits){
                    return false;
                }
            }

            return true;
        }
}
