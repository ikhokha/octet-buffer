import events = require("events");
import net = require("net");
import stream = require("stream");
import child  = require("child_process");
import tls = require("tls");
import http = require("http");
import crypto = require("crypto");
class OctetBufferError implements Error {
    constructor(public name: string, public message: string) {}

    static errorReadingCausedByInsufficientBytes(type: string, missingBytes: number): OctetBufferError {
        return new OctetBufferError('Error reading <' + type + '>', 'Buffer is missing ' + missingBytes + ' bytes');
    }

    static errorConstructorWrongParameterType(): OctetBufferError {
        return new OctetBufferError('Error creating <OctetBuffer>', 'Provided constructor parameter is not valid');
    }

    static errorMethodWrongParameterType(): OctetBufferError {
        return new OctetBufferError('Error interacting with <OctetBuffer>', 'Provided parameter is not valid');
    }
}

const UINT8_BYTES: number = 1;
const UINT16_BYTES: number = 2;
const UINT24_BYTES: number = 3;
const UINT32_BYTES: number = 4;

export class OctetBuffer {

        private _backingBuffer: Buffer;
        private _position: number;

        get backingBuffer(): Buffer {
            return this._backingBuffer;
        }
        set backingBuffer(buffer: Buffer) {
            this.checkParameterIsBuffer(buffer);
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

        constructor(param?: Buffer | string){
            if (typeof param === 'string'){
                var buffer = new Buffer(<string>param, 'hex');
                this.backingBuffer = buffer;
            }
            else if (Buffer.isBuffer(param)){
                this.backingBuffer = <Buffer>param;
            }
            else if (param == null){
                this.backingBuffer = new Buffer(0);
            }
            else {
                throw OctetBufferError.errorConstructorWrongParameterType();
            }

            this.reset();
        }

        private incrementPositionBy(incrementBy: number): void {
            this.checkParameterIsNumber(incrementBy);
            this.position += incrementBy;
        }

        reset(): void {
            this.position = 0;
        }

        readUInt8(): number {
            this.checkRemainingBytesAndThrow('uint8', UINT8_BYTES);
            var uint: number = this.backingBuffer.readUInt8(this.position);
            this.incrementPositionBy(UINT8_BYTES);
            return uint;
        }
        readUInt16(): number {
            this.checkRemainingBytesAndThrow('uint16', UINT16_BYTES);
            var uint: number = this.backingBuffer.readUInt16BE(this.position);
            this.incrementPositionBy(UINT16_BYTES);
            return uint;
        }
        readUInt24(): number {
            this.checkRemainingBytesAndThrow('uint24', UINT24_BYTES);
            var uint: number = OctetBuffer.readUInt24BE(this.backingBuffer, this.position);
            this.incrementPositionBy(UINT24_BYTES);
            return uint;
        }
        readUInt32(): number {
            this.checkRemainingBytesAndThrow('uint32', UINT32_BYTES);
            var uint: number = this.backingBuffer.readUInt32BE(this.position);
            this.incrementPositionBy(UINT32_BYTES);
            return uint;
        }

        readBuffer(count: number = 1): Buffer {
            this.checkParameterIsNumber(count);
            this.checkRemainingBytesAndThrow('Buffer', count);
            var readBuffer = new Buffer(count);
            this.backingBuffer.copy(readBuffer, 0, this.position, this.position + count);
            this.incrementPositionBy(count);
            return readBuffer;
        }

        readBufferRemainig(): Buffer {
            var readBuffer = this.readBuffer(this.remaining);
            return readBuffer;
        }

        writeUInt8(uint: number): OctetBuffer {
            this.checkParameterIsNumber(uint);
            this.extendBackingBufferToAcceptAdditionalBytes(UINT8_BYTES);
            OctetBuffer.writeUInt8(this.backingBuffer, uint, this.position);
            this.incrementPositionBy(UINT8_BYTES);
            return this;
        }

        writeUInt16(uint: number): OctetBuffer {
            this.checkParameterIsNumber(uint);
            this.extendBackingBufferToAcceptAdditionalBytes(UINT16_BYTES);
            OctetBuffer.writeUInt16BE(this.backingBuffer, uint, this.position);
            this.incrementPositionBy(UINT16_BYTES);
            return this;
        }
        writeUInt24(uint: number): OctetBuffer {
            this.checkParameterIsNumber(uint);
            this.extendBackingBufferToAcceptAdditionalBytes(UINT24_BYTES);
            OctetBuffer.writeUInt24BE(this.backingBuffer, uint, this.position);
            this.incrementPositionBy(UINT24_BYTES);
            return this;
        }
        writeUInt32(uint: number): OctetBuffer {
            this.checkParameterIsNumber(uint);
            this.extendBackingBufferToAcceptAdditionalBytes(UINT32_BYTES);
            OctetBuffer.writeUInt32BE(this.backingBuffer, uint, this.position);
            this.incrementPositionBy(UINT32_BYTES);
            return this;
        }

        writeArray(array: number[]): OctetBuffer {
            this.checkParameterIsArray(array);
            var buffer = new Buffer(array);
            return this.writeBuffer(buffer);
        }

        writeBuffer(buffer: Buffer): OctetBuffer {
            this.checkParameterIsBuffer(buffer);
            this.extendBackingBufferToAcceptAdditionalBytes(buffer.length);
            this.writeBufferToBackingBuffer(buffer);
            this.incrementPositionBy(buffer.length);
            return this;
        }

        serialize(): string {
            return this._backingBuffer.toString('hex').toUpperCase();
        }

        peek(): number {
            this.checkRemainingBytesAndThrow('uint8', UINT8_BYTES);
            var uint: number = this.backingBuffer.readUInt8(this.position);
            return uint;
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

        private static readUInt24BE(buffer: Buffer, position: number): number {
            var uint: number = 0;
            uint = buffer.readUInt8(position) << 16;
            uint |= buffer.readUInt8(position + 1) << 8;
            uint |= buffer.readUInt8(position + 2) << 0;
            return uint;
        }

        private static writeUInt8(buffer: Buffer, uint: number, positon: number): void {
            buffer.writeUInt8((uint & 0xff) >>> 0, positon);
        }

        private static writeUInt16BE(buffer: Buffer, uint: number, positon: number): void {
            buffer.writeUInt8((uint & 0xff00) >>> 8, positon);
            buffer.writeUInt8((uint & 0x00ff) >>> 0, positon + 1);
        }

        private static writeUInt24BE(buffer: Buffer, uint: number, positon: number): void {
            buffer.writeUInt8((uint & 0xff0000) >>> 16, positon);
            buffer.writeUInt8((uint & 0x00ff00) >>> 8, positon + 1);
            buffer.writeUInt8((uint & 0x0000ff) >>> 0, positon + 2);
        }

        private static writeUInt32BE(buffer: Buffer, uint: number, positon: number): void {
            buffer.writeUInt8((uint & 0xff000000) >>> 24, positon);
            buffer.writeUInt8((uint & 0x00ff0000) >>> 16, positon + 1);
            buffer.writeUInt8((uint & 0x0000ff00) >>> 8, positon + 2);
            buffer.writeUInt8((uint & 0x000000ff) >>> 0, positon + 3);
        }

        private checkRemainingBytesAndThrow(type: string, requiredBytes: number){
            if (requiredBytes > this.remaining) {
                var missingBytes = requiredBytes - this.remaining;
                throw OctetBufferError.errorReadingCausedByInsufficientBytes(type, missingBytes);
            }
        }
        private checkParameterIsNumber(param: any){
            if (param == null){
                throw OctetBufferError.errorMethodWrongParameterType();
            }
            else if (typeof param !== 'number'){
                throw OctetBufferError.errorMethodWrongParameterType();
            }
        }

        private checkParameterIsArray(param: any[]){
            if (param == null){
                throw OctetBufferError.errorMethodWrongParameterType();
            }
            else if (typeof param !== 'number'){
                throw OctetBufferError.errorMethodWrongParameterType();
            }
        }
        private checkParameterIsBuffer(param: any){
            if (param == null){
                throw OctetBufferError.errorMethodWrongParameterType();
            }
            else if (!Buffer.isBuffer(param)){
                throw OctetBufferError.errorMethodWrongParameterType();
            }
        }
}

