import { expect } from 'chai';
import { OctetBuffer } from './OctetBuffer';

describe('OctetBuffer', () => {

    let octetBuffer: OctetBuffer;
    let serialized: string;

    beforeEach(() => {
    });

    describe('#constructor', () => {

        it('accepts <string>(lowercase)', () => {
            let providedString: string = 'deadbeef';
            let expectedString: string = providedString.toUpperCase();

            octetBuffer = new OctetBuffer(providedString);
            expect(octetBuffer).to.exist;
            expect(octetBuffer.available).to.equal(4);
            expect(octetBuffer.position).to.equal(0);
            expect(octetBuffer.remaining).to.equal(4);

            serialized = octetBuffer.serialize();
            expect(serialized).to.equal(expectedString);
        });

        it('accepts <string>(uppercase)', () => {
            let providedString: string = 'deadbeef'.toUpperCase();
            let expectedString: string = providedString;

            octetBuffer = new OctetBuffer(providedString);
            expect(octetBuffer).to.exist;
            expect(octetBuffer.available).to.equal(4);
            expect(octetBuffer.position).to.equal(0);
            expect(octetBuffer.remaining).to.equal(4);

            serialized = octetBuffer.serialize();
            expect(serialized).to.equal(expectedString);
        });

        it('accepts <Buffer>', () => {
            let providedString = 'deadbeef01'.toUpperCase();
            let providedBuffer: Buffer = Buffer.from(providedString, 'hex');

            octetBuffer = new OctetBuffer(providedBuffer);
            expect(octetBuffer).to.exist;
            expect(octetBuffer.available).to.equal(5);
            expect(octetBuffer.position).to.equal(0);
            expect(octetBuffer.remaining).to.equal(5);

            serialized = octetBuffer.serialize();
            expect(serialized).to.equal(providedString);
        });

        it('accepts no argument', () => {
            let expectedString: string = '';

            octetBuffer = new OctetBuffer();
            expect(octetBuffer).to.exist;
            expect(octetBuffer.available).to.equal(0);
            expect(octetBuffer.position).to.equal(0);
            expect(octetBuffer.remaining).to.equal(0);

            serialized = octetBuffer.serialize();
            expect(serialized).to.equal(expectedString);
        });

        it('fails with other type', () => {
            let providedNumber: number = 23;

            let throwFunction = () => {
                octetBuffer = new OctetBuffer(<any>providedNumber);
            };
            expect(throwFunction).to.throw;
        });

    });

    describe('#serialize', () => {

        it('returns correct <string>', () => {
            let providedString = '55deadbeef03'.toUpperCase();

            octetBuffer = new OctetBuffer(providedString);
            serialized = octetBuffer.serialize();
            expect(serialized).to.equal(providedString);
        });

    });

    describe('#peek', () => {

        it('returns correct number', () => {
            let providedString: string = 'de'.toUpperCase();
            let expectedNumber: number = 0xDE;

            octetBuffer = new OctetBuffer(providedString);
            let number: number = octetBuffer.peek();
            expect(octetBuffer.available).to.equal(1);
            expect(octetBuffer.position).to.equal(0);
            expect(octetBuffer.remaining).to.equal(1);
            expect(number).to.equal(expectedNumber);
        });

        it('fails in case of missing bytes', () => {
            let providedString: string = '';

            octetBuffer = new OctetBuffer(providedString);
            let throwFunction = () => {
                octetBuffer.peek();
            };
            expect(throwFunction).to.throw;
        });

    });

    describe('#reset', () => {

        it('resets position', () => {
            let providedString = '55deadbeef03'.toUpperCase();

            octetBuffer = new OctetBuffer(providedString);
            octetBuffer.reset();
            expect(octetBuffer.available).to.equal(6);
            expect(octetBuffer.position).to.equal(0);
            expect(octetBuffer.remaining).to.equal(6);
        });

    });

    describe('#writeUInt8', () => {

        it('accepts <number>(uint8)', () => {
            let providedNumber: number = 0xDE;
            let expectedString: string = 'de'.toUpperCase();

            octetBuffer = new OctetBuffer();
            octetBuffer.writeUInt8(providedNumber);
            expect(octetBuffer.available).to.equal(1);
            expect(octetBuffer.position).to.equal(1);
            expect(octetBuffer.remaining).to.equal(0);

            serialized = octetBuffer.serialize();
            expect(serialized).to.equal(expectedString);
        });

        it('accepts and truncates <number>(uint16)', () => {
            let providedNumber: number = 0xFEDE;
            let expectedString: string = 'de'.toUpperCase();

            octetBuffer = new OctetBuffer();
            octetBuffer.writeUInt8(providedNumber);
            expect(octetBuffer.available).to.equal(1);
            expect(octetBuffer.position).to.equal(1);
            expect(octetBuffer.remaining).to.equal(0);

            serialized = octetBuffer.serialize();
            expect(serialized).to.equal(expectedString);
        });

        it('fails with other type', () => {
            let providedString: string = '0xDE';

            octetBuffer = new OctetBuffer();
            let throwFunction = () => {
                octetBuffer.writeUInt8(<any>providedString);
            };
            expect(throwFunction).to.throw;
        });

    });

    describe('#writeUInt16', () => {

        it('accepts <number>(uint8)', () => {
            let providedNumber: number = 0xDE;
            let expectedString: string = '00de'.toUpperCase();

            octetBuffer = new OctetBuffer();
            octetBuffer.writeUInt16(providedNumber);
            expect(octetBuffer.available).to.equal(2);
            expect(octetBuffer.position).to.equal(2);
            expect(octetBuffer.remaining).to.equal(0);

            serialized = octetBuffer.serialize();
            expect(serialized).to.equal(expectedString);
        });

        it('accepts <number>(uint16)', () => {
            let providedNumber: number = 0x20DE;
            let expectedString: string = '20de'.toUpperCase();

            octetBuffer = new OctetBuffer();
            octetBuffer.writeUInt16(providedNumber);
            expect(octetBuffer.available).to.equal(2);
            expect(octetBuffer.position).to.equal(2);
            expect(octetBuffer.remaining).to.equal(0);

            serialized = octetBuffer.serialize();
            expect(serialized).to.equal(expectedString);
        });

        it('accepts and truncates <number>(uint24)', () => {
            let providedNumber: number = 0xFE02DE;
            let expectedString: string = '02de'.toUpperCase();

            octetBuffer = new OctetBuffer();
            octetBuffer.writeUInt16(providedNumber);
            expect(octetBuffer.available).to.equal(2);
            expect(octetBuffer.position).to.equal(2);
            expect(octetBuffer.remaining).to.equal(0);

            serialized = octetBuffer.serialize();
            expect(serialized).to.equal(expectedString);
        });

        it('fails with other type', () => {
            let providedString: string = '0xDE';

            octetBuffer = new OctetBuffer();
            let throwFunction = () => {
                octetBuffer.writeUInt16(<any>providedString);
            };
            expect(throwFunction).to.throw;
        });

    });

    describe('#writeUInt24', () => {

        it('accepts <number>(uint16)', () => {
            let providedNumber: number = 0x20DE;
            let expectedString: string = '0020de'.toUpperCase();

            octetBuffer = new OctetBuffer();
            octetBuffer.writeUInt24(providedNumber);
            expect(octetBuffer.available).to.equal(3);
            expect(octetBuffer.position).to.equal(3);
            expect(octetBuffer.remaining).to.equal(0);

            serialized = octetBuffer.serialize();
            expect(serialized).to.equal(expectedString);
        });

        it('accepts <number>(uint24)', () => {
            let providedNumber: number = 0xBB20DE;
            let expectedString: string = 'bb20de'.toUpperCase();

            octetBuffer = new OctetBuffer();
            octetBuffer.writeUInt24(providedNumber);
            expect(octetBuffer.available).to.equal(3);
            expect(octetBuffer.position).to.equal(3);
            expect(octetBuffer.remaining).to.equal(0);

            serialized = octetBuffer.serialize();
            expect(serialized).to.equal(expectedString);
        });

        it('accepts and truncates <number>(uint32)', () => {
            let providedNumber: number = 0xFEBB20DE;
            let expectedString: string = 'bb20de'.toUpperCase();

            octetBuffer = new OctetBuffer();
            octetBuffer.writeUInt24(providedNumber);
            expect(octetBuffer.available).to.equal(3);
            expect(octetBuffer.position).to.equal(3);
            expect(octetBuffer.remaining).to.equal(0);

            serialized = octetBuffer.serialize();
            expect(serialized).to.equal(expectedString);
        });

        it('fails with other type', () => {
            let providedString: string = '0xDE';

            octetBuffer = new OctetBuffer();
            let throwFunction = () => {
                octetBuffer.writeUInt24(<any>providedString);
            };
            expect(throwFunction).to.throw;
        });

    });

    describe('#writeUInt32', () => {

        it('accepts <number>(uint24)', () => {
            let providedNumber: number = 0xBB20DE;
            let expectedString: string = '00bb20de'.toUpperCase();

            octetBuffer = new OctetBuffer();
            octetBuffer.writeUInt32(providedNumber);
            expect(octetBuffer.available).to.equal(4);
            expect(octetBuffer.position).to.equal(4);
            expect(octetBuffer.remaining).to.equal(0);

            serialized = octetBuffer.serialize();
            expect(serialized).to.equal(expectedString);
        });

        it('accepts <number>(uint32)', () => {
            let providedNumber: number = 0x07BB20DE;
            let expectedString: string = '07bb20de'.toUpperCase();

            octetBuffer = new OctetBuffer();
            octetBuffer.writeUInt32(providedNumber);
            expect(octetBuffer.available).to.equal(4);
            expect(octetBuffer.position).to.equal(4);
            expect(octetBuffer.remaining).to.equal(0);

            serialized = octetBuffer.serialize();
            expect(serialized).to.equal(expectedString);
        });

        it('accepts and truncates <number>(uint40)', () => {
            let providedNumber: number = 0xFE07BB20DE;
            let expectedString: string = '07bb20de'.toUpperCase();

            octetBuffer = new OctetBuffer();
            octetBuffer.writeUInt32(providedNumber);
            expect(octetBuffer.available).to.equal(4);
            expect(octetBuffer.position).to.equal(4);
            expect(octetBuffer.remaining).to.equal(0);

            serialized = octetBuffer.serialize();
            expect(serialized).to.equal(expectedString);
        });

        it('fails with other type', () => {
            let providedString: string = '0xDE';

            octetBuffer = new OctetBuffer();
            let throwFunction = () => {
                octetBuffer.writeUInt32(<any>providedString);
            };
            expect(throwFunction).to.throw;
        });

    });

    describe('#writeArray', () => {

        it('accepts <Array>', () => {
            let providedArray: number[] = [0x00, 0xbb, 0x20, 0xde];
            let expectedString: string = '00bb20de'.toUpperCase();

            octetBuffer = new OctetBuffer();
            octetBuffer.writeArray(providedArray);
            expect(octetBuffer.available).to.equal(4);
            expect(octetBuffer.position).to.equal(4);
            expect(octetBuffer.remaining).to.equal(0);

            serialized = octetBuffer.serialize();
            expect(serialized).to.equal(expectedString);
        });

        it('fails with other type', () => {
            let providedString: string = '0xDE';

            octetBuffer = new OctetBuffer();
            let throwFunction = () => {
                octetBuffer.writeArray(<any>providedString);
            };
            expect(throwFunction).to.throw;
        });

    });

    describe('#writeBuffer', () => {

        it('accepts <Buffer>', () => {
            let providedBuffer: Buffer = Buffer.from('00BB20DE', 'hex');
            let expectedString: string = '00bb20de'.toUpperCase();

            octetBuffer = new OctetBuffer();
            octetBuffer.writeBuffer(providedBuffer);
            expect(octetBuffer.available).to.equal(4);
            expect(octetBuffer.position).to.equal(4);
            expect(octetBuffer.remaining).to.equal(0);

            serialized = octetBuffer.serialize();
            expect(serialized).to.equal(expectedString);
        });

        it('fails with other type', () => {
            let providedString: string = '0xDE';

            octetBuffer = new OctetBuffer();
            let throwFunction = () => {
                octetBuffer.writeBuffer(<any>providedString);
            };
            expect(throwFunction).to.throw;
        });

    });

    describe('#writeString', () => {

        it('accepts <string>(uppercase)', () => {
            let providedString: string = '00bb20de'.toUpperCase();
            let expectedString: string = providedString;

            octetBuffer = new OctetBuffer();
            octetBuffer.writeString(providedString);
            expect(octetBuffer.available).to.equal(4);
            expect(octetBuffer.position).to.equal(4);
            expect(octetBuffer.remaining).to.equal(0);

            serialized = octetBuffer.serialize();
            expect(serialized).to.equal(expectedString);
        });

        it('accepts <string>(lowercase)', () => {
            let providedString: string = '00bb20de';
            let expectedString: string = providedString.toUpperCase();

            octetBuffer = new OctetBuffer();
            octetBuffer.writeString(providedString);
            expect(octetBuffer.available).to.equal(4);
            expect(octetBuffer.position).to.equal(4);
            expect(octetBuffer.remaining).to.equal(0);

            serialized = octetBuffer.serialize();
            expect(serialized).to.equal(expectedString);
        });

        it('fails with other type', () => {
            let providedString: string = '0xDE';

            octetBuffer = new OctetBuffer();
            let throwFunction = () => {
                octetBuffer.writeBuffer(<any>providedString);
            };
            expect(throwFunction).to.throw;
        });

    });


    describe('#readUInt8', () => {

        it('returns correct number', () => {
            let providedString: string = 'de'.toUpperCase();
            let expectedNumber: number = 0xDE;

            octetBuffer = new OctetBuffer(providedString);
            let number: number = octetBuffer.readUInt8();
            expect(octetBuffer.available).to.equal(1);
            expect(octetBuffer.position).to.equal(1);
            expect(octetBuffer.remaining).to.equal(0);
            expect(number).to.equal(expectedNumber);
        });

        it('fails in case of missing bytes', () => {
            let providedString: string = '';

            octetBuffer = new OctetBuffer(providedString);
            let throwFunction = () => {
                octetBuffer.readUInt8();
            };
            expect(throwFunction).to.throw;
        });

    });

    describe('#readUInt16', () => {

        it('returns correct number', () => {
            let providedString: string = '23de'.toUpperCase();
            let expectedNumber: number = 0x23DE;

            octetBuffer = new OctetBuffer(providedString);
            let number: number = octetBuffer.readUInt16();
            expect(octetBuffer.available).to.equal(2);
            expect(octetBuffer.position).to.equal(2);
            expect(octetBuffer.remaining).to.equal(0);
            expect(number).to.equal(expectedNumber);
        });

        it('fails in case of missing bytes', () => {
            let providedString: string = '0xde';

            octetBuffer = new OctetBuffer(providedString);
            let throwFunction = () => {
                octetBuffer.readUInt16();
            };
            expect(throwFunction).to.throw;
        });

    });

    describe('#readUInt24', () => {

        it('returns correct number', () => {
            let providedString: string = 'fa23de'.toUpperCase();
            let expectedNumber: number = 0xFA23DE;

            octetBuffer = new OctetBuffer(providedString);
            let number: number = octetBuffer.readUInt24();
            expect(octetBuffer.available).to.equal(3);
            expect(octetBuffer.position).to.equal(3);
            expect(octetBuffer.remaining).to.equal(0);
            expect(number).to.equal(expectedNumber);
        });

        it('fails in case of missing bytes', () => {
            let providedString: string = '0x23de';

            octetBuffer = new OctetBuffer(providedString);
            let throwFunction = () => {
                octetBuffer.readUInt24();
            };
            expect(throwFunction).to.throw;
        });

    });

    describe('#readUInt32', () => {

        it('returns correct number', () => {
            let providedString: string = '90fa23de'.toUpperCase();
            let expectedNumber: number = 0x90FA23DE;

            octetBuffer = new OctetBuffer(providedString);
            let number: number = octetBuffer.readUInt32();
            expect(octetBuffer.available).to.equal(4);
            expect(octetBuffer.position).to.equal(4);
            expect(octetBuffer.remaining).to.equal(0);
            expect(number).to.equal(expectedNumber);
        });

        it('fails in case of missing bytes', () => {
            let providedString: string = '0xfa23de';

            octetBuffer = new OctetBuffer(providedString);
            let throwFunction = () => {
                octetBuffer.readUInt32();
            };
            expect(throwFunction).to.throw;
        });

    });

    describe('#readBuffer', () => {

        it('returns correct buffer', () => {
            let providedString: string = '90fa23de'.toUpperCase();
            let expectedString: string = '90fa'.toUpperCase();

            octetBuffer = new OctetBuffer(providedString);
            let buffer: Buffer = octetBuffer.readBuffer(2);
            let bufferString = buffer.toString('hex').toUpperCase();

            expect(octetBuffer.available).to.equal(4);
            expect(octetBuffer.position).to.equal(2);
            expect(octetBuffer.remaining).to.equal(2);
            expect(bufferString).to.equal(expectedString);
        });

        it('fails in case of missing bytes', () => {
            let providedString: string = '0xfa23de';

            octetBuffer = new OctetBuffer(providedString);
            let throwFunction = () => {
                octetBuffer.readBuffer(4);
            };
            expect(throwFunction).to.throw;
        });

    });

    describe('#readBufferRemaining', () => {

        it('returns correct buffer', () => {
            let providedString: string = '90fa23de'.toUpperCase();

            octetBuffer = new OctetBuffer(providedString);
            let buffer: Buffer = octetBuffer.readBufferRemaining();
            let bufferString = buffer.toString('hex').toUpperCase();

            expect(octetBuffer.available).to.equal(4);
            expect(octetBuffer.position).to.equal(4);
            expect(octetBuffer.remaining).to.equal(0);
            expect(bufferString).to.equal(providedString);
        });
    });


});
