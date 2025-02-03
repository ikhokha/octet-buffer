import { expect } from "chai"
import { OctetBuffer } from "./OctetBuffer"

describe("OctetBuffer", () => {
	let octetBuffer: OctetBuffer
	let serialized: string

	beforeEach(() => {})

	describe("#constructor", () => {
		it("accepts <string>(lowercase)", () => {
			const providedString = "deadbeef"
			const expectedString: string = providedString.toUpperCase()

			octetBuffer = new OctetBuffer(providedString)
			expect(octetBuffer).to.exist
			expect(octetBuffer.available).to.equal(4)
			expect(octetBuffer.position).to.equal(0)
			expect(octetBuffer.remaining).to.equal(4)

			serialized = octetBuffer.serialize()
			expect(serialized).to.equal(expectedString)
		})

		it("accepts <string>(uppercase)", () => {
			const providedString: string = "deadbeef".toUpperCase()
			const expectedString: string = providedString

			octetBuffer = new OctetBuffer(providedString)
			expect(octetBuffer).to.exist
			expect(octetBuffer.available).to.equal(4)
			expect(octetBuffer.position).to.equal(0)
			expect(octetBuffer.remaining).to.equal(4)

			serialized = octetBuffer.serialize()
			expect(serialized).to.equal(expectedString)
		})

		it("accepts <Buffer>", () => {
			const providedString = "deadbeef01".toUpperCase()
			const providedBuffer: Buffer = Buffer.from(providedString, "hex")

			octetBuffer = new OctetBuffer(providedBuffer)
			expect(octetBuffer).to.exist
			expect(octetBuffer.available).to.equal(5)
			expect(octetBuffer.position).to.equal(0)
			expect(octetBuffer.remaining).to.equal(5)

			serialized = octetBuffer.serialize()
			expect(serialized).to.equal(providedString)
		})

		it("accepts no argument", () => {
			const expectedString = ""

			octetBuffer = new OctetBuffer()
			expect(octetBuffer).to.exist
			expect(octetBuffer.available).to.equal(0)
			expect(octetBuffer.position).to.equal(0)
			expect(octetBuffer.remaining).to.equal(0)

			serialized = octetBuffer.serialize()
			expect(serialized).to.equal(expectedString)
		})

		it("fails with other type", () => {
			const providedNumber = 23

			const throwFunction = () => {
				octetBuffer = new OctetBuffer(<any>providedNumber)
			}
			expect(throwFunction).to.throw
		})
	})

	describe("#serialize", () => {
		it("returns correct <string>", () => {
			const providedString = "55deadbeef03".toUpperCase()

			octetBuffer = new OctetBuffer(providedString)
			serialized = octetBuffer.serialize()
			expect(serialized).to.equal(providedString)
		})
	})

	describe("#peek", () => {
		it("returns correct number", () => {
			const providedString: string = "de".toUpperCase()
			const expectedNumber = 0xde

			octetBuffer = new OctetBuffer(providedString)
			const number: number = octetBuffer.peek()
			expect(octetBuffer.available).to.equal(1)
			expect(octetBuffer.position).to.equal(0)
			expect(octetBuffer.remaining).to.equal(1)
			expect(number).to.equal(expectedNumber)
		})

		it("fails in case of missing bytes", () => {
			const providedString = ""

			octetBuffer = new OctetBuffer(providedString)
			const throwFunction = () => {
				octetBuffer.peek()
			}
			expect(throwFunction).to.throw
		})
	})

	describe("#reset", () => {
		it("resets position", () => {
			const providedString = "55deadbeef03".toUpperCase()

			octetBuffer = new OctetBuffer(providedString)
			octetBuffer.reset()
			expect(octetBuffer.available).to.equal(6)
			expect(octetBuffer.position).to.equal(0)
			expect(octetBuffer.remaining).to.equal(6)
		})
	})

	describe("#writeUInt8", () => {
		it("accepts <number>(uint8)", () => {
			const providedNumber = 0xde
			const expectedString: string = "de".toUpperCase()

			octetBuffer = new OctetBuffer()
			octetBuffer.writeUInt8(providedNumber)
			expect(octetBuffer.available).to.equal(1)
			expect(octetBuffer.position).to.equal(1)
			expect(octetBuffer.remaining).to.equal(0)

			serialized = octetBuffer.serialize()
			expect(serialized).to.equal(expectedString)
		})

		it("accepts and truncates <number>(uint16)", () => {
			const providedNumber = 0xfede
			const expectedString: string = "de".toUpperCase()

			octetBuffer = new OctetBuffer()
			octetBuffer.writeUInt8(providedNumber)
			expect(octetBuffer.available).to.equal(1)
			expect(octetBuffer.position).to.equal(1)
			expect(octetBuffer.remaining).to.equal(0)

			serialized = octetBuffer.serialize()
			expect(serialized).to.equal(expectedString)
		})

		it("fails with other type", () => {
			const providedString = "0xDE"

			octetBuffer = new OctetBuffer()
			const throwFunction = () => {
				octetBuffer.writeUInt8(<any>providedString)
			}
			expect(throwFunction).to.throw
		})
	})

	describe("#writeUInt16", () => {
		it("accepts <number>(uint8)", () => {
			const providedNumber = 0xde
			const expectedString: string = "00de".toUpperCase()

			octetBuffer = new OctetBuffer()
			octetBuffer.writeUInt16(providedNumber)
			expect(octetBuffer.available).to.equal(2)
			expect(octetBuffer.position).to.equal(2)
			expect(octetBuffer.remaining).to.equal(0)

			serialized = octetBuffer.serialize()
			expect(serialized).to.equal(expectedString)
		})

		it("accepts <number>(uint16)", () => {
			const providedNumber = 0x20de
			const expectedString: string = "20de".toUpperCase()

			octetBuffer = new OctetBuffer()
			octetBuffer.writeUInt16(providedNumber)
			expect(octetBuffer.available).to.equal(2)
			expect(octetBuffer.position).to.equal(2)
			expect(octetBuffer.remaining).to.equal(0)

			serialized = octetBuffer.serialize()
			expect(serialized).to.equal(expectedString)
		})

		it("accepts and truncates <number>(uint24)", () => {
			const providedNumber = 0xfe02de
			const expectedString: string = "02de".toUpperCase()

			octetBuffer = new OctetBuffer()
			octetBuffer.writeUInt16(providedNumber)
			expect(octetBuffer.available).to.equal(2)
			expect(octetBuffer.position).to.equal(2)
			expect(octetBuffer.remaining).to.equal(0)

			serialized = octetBuffer.serialize()
			expect(serialized).to.equal(expectedString)
		})

		it("fails with other type", () => {
			const providedString = "0xDE"

			octetBuffer = new OctetBuffer()
			const throwFunction = () => {
				octetBuffer.writeUInt16(<any>providedString)
			}
			expect(throwFunction).to.throw
		})
	})

	describe("#writeUInt24", () => {
		it("accepts <number>(uint16)", () => {
			const providedNumber = 0x20de
			const expectedString: string = "0020de".toUpperCase()

			octetBuffer = new OctetBuffer()
			octetBuffer.writeUInt24(providedNumber)
			expect(octetBuffer.available).to.equal(3)
			expect(octetBuffer.position).to.equal(3)
			expect(octetBuffer.remaining).to.equal(0)

			serialized = octetBuffer.serialize()
			expect(serialized).to.equal(expectedString)
		})

		it("accepts <number>(uint24)", () => {
			const providedNumber = 0xbb20de
			const expectedString: string = "bb20de".toUpperCase()

			octetBuffer = new OctetBuffer()
			octetBuffer.writeUInt24(providedNumber)
			expect(octetBuffer.available).to.equal(3)
			expect(octetBuffer.position).to.equal(3)
			expect(octetBuffer.remaining).to.equal(0)

			serialized = octetBuffer.serialize()
			expect(serialized).to.equal(expectedString)
		})

		it("accepts and truncates <number>(uint32)", () => {
			const providedNumber = 0xfebb20de
			const expectedString: string = "bb20de".toUpperCase()

			octetBuffer = new OctetBuffer()
			octetBuffer.writeUInt24(providedNumber)
			expect(octetBuffer.available).to.equal(3)
			expect(octetBuffer.position).to.equal(3)
			expect(octetBuffer.remaining).to.equal(0)

			serialized = octetBuffer.serialize()
			expect(serialized).to.equal(expectedString)
		})

		it("fails with other type", () => {
			const providedString = "0xDE"

			octetBuffer = new OctetBuffer()
			const throwFunction = () => {
				octetBuffer.writeUInt24(<any>providedString)
			}
			expect(throwFunction).to.throw
		})
	})

	describe("#writeUInt32", () => {
		it("accepts <number>(uint24)", () => {
			const providedNumber = 0xbb20de
			const expectedString: string = "00bb20de".toUpperCase()

			octetBuffer = new OctetBuffer()
			octetBuffer.writeUInt32(providedNumber)
			expect(octetBuffer.available).to.equal(4)
			expect(octetBuffer.position).to.equal(4)
			expect(octetBuffer.remaining).to.equal(0)

			serialized = octetBuffer.serialize()
			expect(serialized).to.equal(expectedString)
		})

		it("accepts <number>(uint32)", () => {
			const providedNumber = 0x07bb20de
			const expectedString: string = "07bb20de".toUpperCase()

			octetBuffer = new OctetBuffer()
			octetBuffer.writeUInt32(providedNumber)
			expect(octetBuffer.available).to.equal(4)
			expect(octetBuffer.position).to.equal(4)
			expect(octetBuffer.remaining).to.equal(0)

			serialized = octetBuffer.serialize()
			expect(serialized).to.equal(expectedString)
		})

		it("accepts and truncates <number>(uint40)", () => {
			const providedNumber = 0xfe07bb20de
			const expectedString: string = "07bb20de".toUpperCase()

			octetBuffer = new OctetBuffer()
			octetBuffer.writeUInt32(providedNumber)
			expect(octetBuffer.available).to.equal(4)
			expect(octetBuffer.position).to.equal(4)
			expect(octetBuffer.remaining).to.equal(0)

			serialized = octetBuffer.serialize()
			expect(serialized).to.equal(expectedString)
		})

		it("fails with other type", () => {
			const providedString = "0xDE"

			octetBuffer = new OctetBuffer()
			const throwFunction = () => {
				octetBuffer.writeUInt32(<any>providedString)
			}
			expect(throwFunction).to.throw
		})
	})

	describe("#writeArray", () => {
		it("accepts <Array>", () => {
			const providedArray: number[] = [0x00, 0xbb, 0x20, 0xde]
			const expectedString: string = "00bb20de".toUpperCase()

			octetBuffer = new OctetBuffer()
			octetBuffer.writeArray(providedArray)
			expect(octetBuffer.available).to.equal(4)
			expect(octetBuffer.position).to.equal(4)
			expect(octetBuffer.remaining).to.equal(0)

			serialized = octetBuffer.serialize()
			expect(serialized).to.equal(expectedString)
		})

		it("fails with other type", () => {
			const providedString = "0xDE"

			octetBuffer = new OctetBuffer()
			const throwFunction = () => {
				octetBuffer.writeArray(<any>providedString)
			}
			expect(throwFunction).to.throw
		})
	})

	describe("#writeBuffer", () => {
		it("accepts <Buffer>", () => {
			const providedBuffer: Buffer = Buffer.from("00BB20DE", "hex")
			const expectedString: string = "00bb20de".toUpperCase()

			octetBuffer = new OctetBuffer()
			octetBuffer.writeBuffer(providedBuffer)
			expect(octetBuffer.available).to.equal(4)
			expect(octetBuffer.position).to.equal(4)
			expect(octetBuffer.remaining).to.equal(0)

			serialized = octetBuffer.serialize()
			expect(serialized).to.equal(expectedString)
		})

		it("fails with other type", () => {
			const providedString = "0xDE"

			octetBuffer = new OctetBuffer()
			const throwFunction = () => {
				octetBuffer.writeBuffer(<any>providedString)
			}
			expect(throwFunction).to.throw
		})
	})

	describe("#writeString", () => {
		it("accepts <string>(uppercase)", () => {
			const providedString: string = "00bb20de".toUpperCase()
			const expectedString: string = providedString

			octetBuffer = new OctetBuffer()
			octetBuffer.writeString(providedString)
			expect(octetBuffer.available).to.equal(4)
			expect(octetBuffer.position).to.equal(4)
			expect(octetBuffer.remaining).to.equal(0)

			serialized = octetBuffer.serialize()
			expect(serialized).to.equal(expectedString)
		})

		it("accepts <string>(lowercase)", () => {
			const providedString = "00bb20de"
			const expectedString: string = providedString.toUpperCase()

			octetBuffer = new OctetBuffer()
			octetBuffer.writeString(providedString)
			expect(octetBuffer.available).to.equal(4)
			expect(octetBuffer.position).to.equal(4)
			expect(octetBuffer.remaining).to.equal(0)

			serialized = octetBuffer.serialize()
			expect(serialized).to.equal(expectedString)
		})

		it("fails with other type", () => {
			const providedString = "0xDE"

			octetBuffer = new OctetBuffer()
			const throwFunction = () => {
				octetBuffer.writeBuffer(<any>providedString)
			}
			expect(throwFunction).to.throw
		})
	})

	describe("#readUInt8", () => {
		it("returns correct number", () => {
			const providedString: string = "de".toUpperCase()
			const expectedNumber = 0xde

			octetBuffer = new OctetBuffer(providedString)
			const number: number = octetBuffer.readUInt8()
			expect(octetBuffer.available).to.equal(1)
			expect(octetBuffer.position).to.equal(1)
			expect(octetBuffer.remaining).to.equal(0)
			expect(number).to.equal(expectedNumber)
		})

		it("fails in case of missing bytes", () => {
			const providedString = ""

			octetBuffer = new OctetBuffer(providedString)
			const throwFunction = () => {
				octetBuffer.readUInt8()
			}
			expect(throwFunction).to.throw
		})
	})

	describe("#readUInt16", () => {
		it("returns correct number", () => {
			const providedString: string = "23de".toUpperCase()
			const expectedNumber = 0x23de

			octetBuffer = new OctetBuffer(providedString)
			const number: number = octetBuffer.readUInt16()
			expect(octetBuffer.available).to.equal(2)
			expect(octetBuffer.position).to.equal(2)
			expect(octetBuffer.remaining).to.equal(0)
			expect(number).to.equal(expectedNumber)
		})

		it("fails in case of missing bytes", () => {
			const providedString = "0xde"

			octetBuffer = new OctetBuffer(providedString)
			const throwFunction = () => {
				octetBuffer.readUInt16()
			}
			expect(throwFunction).to.throw
		})
	})

	describe("#readUInt24", () => {
		it("returns correct number", () => {
			const providedString: string = "fa23de".toUpperCase()
			const expectedNumber = 0xfa23de

			octetBuffer = new OctetBuffer(providedString)
			const number: number = octetBuffer.readUInt24()
			expect(octetBuffer.available).to.equal(3)
			expect(octetBuffer.position).to.equal(3)
			expect(octetBuffer.remaining).to.equal(0)
			expect(number).to.equal(expectedNumber)
		})

		it("fails in case of missing bytes", () => {
			const providedString = "0x23de"

			octetBuffer = new OctetBuffer(providedString)
			const throwFunction = () => {
				octetBuffer.readUInt24()
			}
			expect(throwFunction).to.throw
		})
	})

	describe("#readUInt32", () => {
		it("returns correct number", () => {
			const providedString: string = "90fa23de".toUpperCase()
			const expectedNumber = 0x90fa23de

			octetBuffer = new OctetBuffer(providedString)
			const number: number = octetBuffer.readUInt32()
			expect(octetBuffer.available).to.equal(4)
			expect(octetBuffer.position).to.equal(4)
			expect(octetBuffer.remaining).to.equal(0)
			expect(number).to.equal(expectedNumber)
		})

		it("fails in case of missing bytes", () => {
			const providedString = "0xfa23de"

			octetBuffer = new OctetBuffer(providedString)
			const throwFunction = () => {
				octetBuffer.readUInt32()
			}
			expect(throwFunction).to.throw
		})
	})

	describe("#readBuffer", () => {
		it("returns correct buffer", () => {
			const providedString: string = "90fa23de".toUpperCase()
			const expectedString: string = "90fa".toUpperCase()

			octetBuffer = new OctetBuffer(providedString)
			const buffer: Buffer = octetBuffer.readBuffer(2)
			const bufferString = buffer.toString("hex").toUpperCase()

			expect(octetBuffer.available).to.equal(4)
			expect(octetBuffer.position).to.equal(2)
			expect(octetBuffer.remaining).to.equal(2)
			expect(bufferString).to.equal(expectedString)
		})

		it("fails in case of missing bytes", () => {
			const providedString = "0xfa23de"

			octetBuffer = new OctetBuffer(providedString)
			const throwFunction = () => {
				octetBuffer.readBuffer(4)
			}
			expect(throwFunction).to.throw
		})
	})

	describe("#readBufferRemaining", () => {
		it("returns correct buffer", () => {
			const providedString: string = "90fa23de".toUpperCase()

			octetBuffer = new OctetBuffer(providedString)
			const buffer: Buffer = octetBuffer.readBufferRemaining()
			const bufferString = buffer.toString("hex").toUpperCase()

			expect(octetBuffer.available).to.equal(4)
			expect(octetBuffer.position).to.equal(4)
			expect(octetBuffer.remaining).to.equal(0)
			expect(bufferString).to.equal(providedString)
		})
	})
})
