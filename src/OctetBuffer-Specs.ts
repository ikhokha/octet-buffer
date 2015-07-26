import { expect } from 'chai';
import { OctetBuffer } from 'OctetBuffer';

describe('OctetBuffer', () => {

    var buffer: Buffer;
    var octetBuffer: OctetBuffer;
    var serialized: string;

    beforeEach(() => {
        buffer = null;
        octetBuffer = null;
        serialized = null;
    });

    describe('#constructor', () => {

        it('accepts <string>', () => {
            var providedString: string = 'deadbeef'.toUpperCase();

            octetBuffer = new OctetBuffer(providedString);
            expect(octetBuffer).to.exist;
            expect(octetBuffer.available).to.equal(4);
            expect(octetBuffer.position).to.equal(0);
            expect(octetBuffer.remaining).to.equal(4);

            serialized = octetBuffer.serialize();
            expect(serialized).to.equal(providedString);
        });

        it('accepts <Buffer>', () => {
            var providedString = 'deadbeef01'.toUpperCase();
            var providedBuffer: Buffer = new Buffer(providedString, 'hex');

            octetBuffer = new OctetBuffer(providedBuffer);
            expect(octetBuffer).to.exist;
            expect(octetBuffer.available).to.equal(5);
            expect(octetBuffer.position).to.equal(0);
            expect(octetBuffer.remaining).to.equal(5);

            serialized = octetBuffer.serialize();
            expect(serialized).to.equal(providedString);
        });

        it('accepts no argument', () => {
            var expectedString: string = '';

            octetBuffer = new OctetBuffer();
            expect(octetBuffer).to.exist;
            expect(octetBuffer.available).to.equal(0);
            expect(octetBuffer.position).to.equal(0);
            expect(octetBuffer.remaining).to.equal(0);            

            serialized = octetBuffer.serialize();
            expect(serialized).to.equal(expectedString);
        });

        it('fails with other type', () => {
            var providedNumber: number = 23;

            var throwFunction = () => {
                octetBuffer = new OctetBuffer(<any>providedNumber);
            };
            expect(throwFunction).to.throw;
            expect(octetBuffer).to.not.exist;
        });

    });

    describe('#serialize', () => {

        it('returns correct <string>', () => {
            var providedString = '55deadbeef03'.toUpperCase();

            octetBuffer = new OctetBuffer(providedString);
            serialized = octetBuffer.serialize();
            expect(serialized).to.equal(providedString);
        });

    });

    describe('#reset', () => {

        it('resets position', () => {
            var providedString = '55deadbeef03'.toUpperCase();

            octetBuffer = new OctetBuffer(providedString);
            octetBuffer.reset();
            expect(octetBuffer.available).to.equal(6);
            expect(octetBuffer.position).to.equal(0);
            expect(octetBuffer.remaining).to.equal(6);
        });

    });

    describe('#writeUInt8', () => {

        it('accepts <number>(uint8)', () => {
            var providedNumber: number = 0xDE;
            var expectedString: string = 'de'.toUpperCase();

            octetBuffer = new OctetBuffer();
            octetBuffer.writeUInt8(providedNumber);
            expect(octetBuffer.available).to.equal(1);
            expect(octetBuffer.position).to.equal(1);
            expect(octetBuffer.remaining).to.equal(0);

            serialized = octetBuffer.serialize();
            expect(serialized).to.equal(expectedString);
        });

        it('accepts and truncates <number>(uint16)', () => {
            var providedNumber: number = 0xFEDE;
            var expectedString: string = 'de'.toUpperCase();

            octetBuffer = new OctetBuffer();
            octetBuffer.writeUInt8(providedNumber);
            expect(octetBuffer.available).to.equal(1);
            expect(octetBuffer.position).to.equal(1);
            expect(octetBuffer.remaining).to.equal(0);

            serialized = octetBuffer.serialize();
            expect(serialized).to.equal(expectedString);
        });

        it('fails with other type', () => {
            var providedString: string = '0xDE';

            octetBuffer = new OctetBuffer();
            var throwFunction = () => {
                octetBuffer.writeUInt8(<any>providedString);
            };
            expect(throwFunction).to.throw;
        });

    });

    describe('#writeUInt16', () => {

        it('accepts <number>(uint8)', () => {
            var providedNumber: number = 0xDE;
            var expectedString: string = '00de'.toUpperCase();

            octetBuffer = new OctetBuffer();
            octetBuffer.writeUInt16(providedNumber);
            expect(octetBuffer.available).to.equal(2);
            expect(octetBuffer.position).to.equal(2);
            expect(octetBuffer.remaining).to.equal(0);

            serialized = octetBuffer.serialize();
            expect(serialized).to.equal(expectedString);
        });

        it('accepts <number>(uint16)', () => {
            var providedNumber: number = 0x20DE;
            var expectedString: string = '20de'.toUpperCase();

            octetBuffer = new OctetBuffer();
            octetBuffer.writeUInt16(providedNumber);
            expect(octetBuffer.available).to.equal(2);
            expect(octetBuffer.position).to.equal(2);
            expect(octetBuffer.remaining).to.equal(0);

            serialized = octetBuffer.serialize();
            expect(serialized).to.equal(expectedString);
        });

        it('accepts and truncates <number>(uint24)', () => {
            var providedNumber: number = 0xFE02DE;
            var expectedString: string = '02de'.toUpperCase();

            octetBuffer = new OctetBuffer();
            octetBuffer.writeUInt16(providedNumber);
            expect(octetBuffer.available).to.equal(2);
            expect(octetBuffer.position).to.equal(2);
            expect(octetBuffer.remaining).to.equal(0);

            serialized = octetBuffer.serialize();
            expect(serialized).to.equal(expectedString);
        });

        it('fails with other type', () => {
            var providedString: string = '0xDE';

            octetBuffer = new OctetBuffer();
            var throwFunction = () => {
                octetBuffer.writeUInt16(<any>providedString);
            };
            expect(throwFunction).to.throw;
        });

    });

    describe('#writeUInt24', () => {

        it('accepts <number>(uint16)', () => {
            var providedNumber: number = 0x20DE;
            var expectedString: string = '0020de'.toUpperCase();

            octetBuffer = new OctetBuffer();
            octetBuffer.writeUInt24(providedNumber);
            expect(octetBuffer.available).to.equal(3);
            expect(octetBuffer.position).to.equal(3);
            expect(octetBuffer.remaining).to.equal(0);

            serialized = octetBuffer.serialize();
            expect(serialized).to.equal(expectedString);
        });

        it('accepts <number>(uint24)', () => {
            var providedNumber: number = 0xBB20DE;
            var expectedString: string = 'bb20de'.toUpperCase();

            octetBuffer = new OctetBuffer();
            octetBuffer.writeUInt24(providedNumber);
            expect(octetBuffer.available).to.equal(3);
            expect(octetBuffer.position).to.equal(3);
            expect(octetBuffer.remaining).to.equal(0);

            serialized = octetBuffer.serialize();
            expect(serialized).to.equal(expectedString);
        });

        it('accepts and truncates <number>(uint32)', () => {
            var providedNumber: number = 0xFEBB20DE;
            var expectedString: string = 'bb20de'.toUpperCase();

            octetBuffer = new OctetBuffer();
            octetBuffer.writeUInt24(providedNumber);
            expect(octetBuffer.available).to.equal(3);
            expect(octetBuffer.position).to.equal(3);
            expect(octetBuffer.remaining).to.equal(0);

            serialized = octetBuffer.serialize();
            expect(serialized).to.equal(expectedString);
        });

        it('fails with other type', () => {
            var providedString: string = '0xDE';

            octetBuffer = new OctetBuffer();
            var throwFunction = () => {
                octetBuffer.writeUInt24(<any>providedString);
            };
            expect(throwFunction).to.throw;
        });

    });

    describe('#writeUInt32', () => {

        it('accepts <number>(uint24)', () => {
            var providedNumber: number = 0xBB20DE;
            var expectedString: string = '00bb20de'.toUpperCase();

            octetBuffer = new OctetBuffer();
            octetBuffer.writeUInt32(providedNumber);
            expect(octetBuffer.available).to.equal(4);
            expect(octetBuffer.position).to.equal(4);
            expect(octetBuffer.remaining).to.equal(0);

            serialized = octetBuffer.serialize();
            expect(serialized).to.equal(expectedString);
        });

        it('accepts <number>(uint32)', () => {
            var providedNumber: number = 0x07BB20DE;
            var expectedString: string = '07bb20de'.toUpperCase();

            octetBuffer = new OctetBuffer();
            octetBuffer.writeUInt32(providedNumber);
            expect(octetBuffer.available).to.equal(4);
            expect(octetBuffer.position).to.equal(4);
            expect(octetBuffer.remaining).to.equal(0);

            serialized = octetBuffer.serialize();
            expect(serialized).to.equal(expectedString);
        });

        it('accepts and truncates <number>(uint40)', () => {
            var providedNumber: number = 0xFE07BB20DE;
            var expectedString: string = '07bb20de'.toUpperCase();

            octetBuffer = new OctetBuffer();
            octetBuffer.writeUInt32(providedNumber);
            expect(octetBuffer.available).to.equal(4);
            expect(octetBuffer.position).to.equal(4);
            expect(octetBuffer.remaining).to.equal(0);

            serialized = octetBuffer.serialize();
            expect(serialized).to.equal(expectedString);
        });

        it('fails with other type', () => {
            var providedString: string = '0xDE';

            octetBuffer = new OctetBuffer();
            var throwFunction = () => {
                octetBuffer.writeUInt32(<any>providedString);
            };
            expect(throwFunction).to.throw;
        });

    });


    describe('#readUInt8', () => {

        it('returns correct number', () => {
            var providedString: string = 'de'.toUpperCase();
            var expectedNumber: number = 0xDE;

            octetBuffer = new OctetBuffer(providedString);
            var number: number = octetBuffer.readUInt8();
            expect(octetBuffer.available).to.equal(1);
            expect(octetBuffer.position).to.equal(1);
            expect(octetBuffer.remaining).to.equal(0);
            expect(number).to.equal(expectedNumber);
        });

        it('fails in case of missing bytes', () => {
            var providedString: string = '';

            octetBuffer = new OctetBuffer(providedString);
            var throwFunction = () => {
                octetBuffer.readUInt8();
            };
            expect(throwFunction).to.throw;
        });

    });

    describe('#readUInt16', () => {

        it('returns correct number', () => {
            var providedString: string = '23de'.toUpperCase();
            var expectedNumber: number = 0x23DE;

            octetBuffer = new OctetBuffer(providedString);
            var number: number = octetBuffer.readUInt16();
            expect(octetBuffer.available).to.equal(2);
            expect(octetBuffer.position).to.equal(2);
            expect(octetBuffer.remaining).to.equal(0);
            expect(number).to.equal(expectedNumber);
        });

        it('fails in case of missing bytes', () => {
            var providedString: string = '0xde';

            octetBuffer = new OctetBuffer(providedString);
            var throwFunction = () => {
                octetBuffer.readUInt16();
            };
            expect(throwFunction).to.throw;
        });

    });

    describe('#readUInt24', () => {

        it('returns correct number', () => {
            var providedString: string = 'fa23de'.toUpperCase();
            var expectedNumber: number = 0xFA23DE;

            octetBuffer = new OctetBuffer(providedString);
            var number: number = octetBuffer.readUInt24();
            expect(octetBuffer.available).to.equal(3);
            expect(octetBuffer.position).to.equal(3);
            expect(octetBuffer.remaining).to.equal(0);
            expect(number).to.equal(expectedNumber);
        });

        it('fails in case of missing bytes', () => {
            var providedString: string = '0x23de';

            octetBuffer = new OctetBuffer(providedString);
            var throwFunction = () => {
                octetBuffer.readUInt24();
            };
            expect(throwFunction).to.throw;
        });

    });

    describe('#readUInt32', () => {

        it('returns correct number', () => {
            var providedString: string = '90fa23de'.toUpperCase();
            var expectedNumber: number = 0x90FA23DE;

            octetBuffer = new OctetBuffer(providedString);
            var number: number = octetBuffer.readUInt32();
            expect(octetBuffer.available).to.equal(4);
            expect(octetBuffer.position).to.equal(4);
            expect(octetBuffer.remaining).to.equal(0);
            expect(number).to.equal(expectedNumber);
        });

        it('fails in case of missing bytes', () => {
            var providedString: string = '0xfa23de';

            octetBuffer = new OctetBuffer(providedString);
            var throwFunction = () => {
                octetBuffer.readUInt32();
            };
            expect(throwFunction).to.throw;
        });

    });


});
