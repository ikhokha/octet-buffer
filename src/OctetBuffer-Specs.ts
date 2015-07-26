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
            var providedString: string = 'deadbeef';

            octetBuffer = new OctetBuffer(providedString);
            expect(octetBuffer).to.exist;

            serialized = octetBuffer.serialize();
            expect(serialized).to.equal(providedString);
        });

        it('accepts <Buffer>', () => {
            var providedString = 'deadbeef01';
            var providedBuffer: Buffer = new Buffer(providedString, 'hex');

            octetBuffer = new OctetBuffer(providedBuffer);
            expect(octetBuffer).to.exist;

            serialized = octetBuffer.serialize();
            expect(serialized).to.equal(providedString);
        });

        it('accepts no argument', () => {
            var expectedString: string = '';

            octetBuffer = new OctetBuffer();
            expect(octetBuffer).to.exist;

            serialized = octetBuffer.serialize();
            expect(serialized).to.equal(expectedString);
        });

        it('fails with other type', () => {
            var providedNumber: number = 23;

            var throwFunction = () => {
                octetBuffer = new OctetBuffer(<any>providedNumber);
            }
            expect(throwFunction).to.throw;
            expect(octetBuffer).to.not.exist;
        });

    });

});
