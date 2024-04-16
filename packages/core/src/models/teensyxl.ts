import { HIDDevice } from '../device'
import { OpenStreamDeckOptions, StreamDeckProperties } from './base'
import { StreamDeckGen2Base } from './base-gen2'
import { DeviceModelId } from '../id'

const teensyxlProperties: StreamDeckProperties = {
	MODEL: DeviceModelId.TEENSYXL,
	PRODUCT_NAME: 'ShitBoxx',
	COLUMNS: 8,
	ROWS: 4,
	ICON_SIZE: 96,
	KEY_DIRECTION: 'ltr',
	KEY_DATA_OFFSET: 3,
}

export class StreamDeckTeensyXL extends StreamDeckGen2Base {
	constructor(device: HIDDevice, options: Required<OpenStreamDeckOptions>) {
		super(device, options, teensyxlProperties)
	}
}
