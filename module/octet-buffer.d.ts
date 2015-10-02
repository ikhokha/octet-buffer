declare module OctetBuffer{
  export class OctetBuffer {
    private _backingBuffer;
    private _position;
    backingBuffer: Buffer;
    position: number;
    available: number;
    remaining: number;
    constructor(param?: Buffer | string);
    private incrementPositionBy(incrementBy);
    reset(): void;
    readUInt8(): number;
    readUInt16(): number;
    readUInt24(): number;
    readUInt32(): number;
    readBuffer(count?: number): Buffer;
    readBufferRemaining(): Buffer;
    writeUInt8(uint: number): OctetBuffer;
    writeUInt16(uint: number): OctetBuffer;
    writeUInt24(uint: number): OctetBuffer;
    writeUInt32(uint: number): OctetBuffer;
    writeArray(array: number[]): OctetBuffer;
    writeBuffer(buffer: Buffer): OctetBuffer;
    serialize(): string;
    peek(): number;
    private extendBackingBufferToAcceptAdditionalBytes(additionalBytes);
    private writeBufferToBackingBuffer(buffer);
    private static readUInt24BE(buffer, position);
    private static writeUInt8(buffer, uint, positon);
    private static writeUInt16BE(buffer, uint, positon);
    private static writeUInt24BE(buffer, uint, positon);
    private static writeUInt32BE(buffer, uint, positon);
    private checkRemainingBytesAndThrow(type, requiredBytes);
    private checkParameterIsNumber(param);
    private checkParameterIsArray(param);
    private checkParameterIsBuffer(param);
  }
}

declare module 'octet-buffer'{
  export = OctetBuffer;
}
