type UbjsonValue = any;

export type UbjsonDecoderCustomHandler = (
	storage: { array: Uint8Array, view: DataView },
	offset: number,
	byteLength: number
) => UbjsonValue;

export interface UbjsonEncoderOptions {
	optimizeArrays: boolean | 'onlyTypedArrays';
	optimizeObjects: boolean;
}

export interface UbjsonDecoderOptions {
	int64Handling: 'error' | 'skip' | 'raw' | UbjsonDecoderCustomHandler;
	highPrecisionNumberHandling: 'error' | 'skip' | 'raw' | UbjsonDecoderCustomHandler;
	useTypedArrays: boolean;
}

export declare class UbjsonEncoder {
	constructor(options?: Partial<UbjsonEncoderOptions>);
	encode(value: UbjsonValue): ArrayBuffer;
}

export declare class UbjsonDecoder {
	constructor(options?: Partial<UbjsonDecoderOptions>);
	decode(buffer: ArrayBuffer): UbjsonValue;
}

export declare function encode(
	value: UbjsonValue,
	options?: Partial<UbjsonEncoderOptions>
): ArrayBuffer;

export declare function decode(
	buffer: ArrayBuffer,
	options?: Partial<UbjsonDecoderOptions>
): UbjsonValue;

export type Ubjson = {
	encode(value: UbjsonValue, options?: Partial<UbjsonEncoderOptions>): ArrayBuffer;
	decode(buffer: ArrayBuffer, options?: Partial<UbjsonDecoderOptions>): UbjsonValue;
};
