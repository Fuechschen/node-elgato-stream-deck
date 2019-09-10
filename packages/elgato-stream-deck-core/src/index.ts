import * as HID from 'node-hid'

import {
	DeviceModelId,
	OpenStreamDeckOptions,
	StreamDeck,
	StreamDeckDeviceInfo,
	StreamDeckMini,
	StreamDeckOriginal,
	StreamDeckXL
} from './models'

export { DeviceModelId, KeyIndex, StreamDeck, StreamDeckDeviceInfo } from './models'

/*
 * The original StreamDeck uses packet sizes too large for the hidraw driver which is
 * the default on linux. https://github.com/node-hid/node-hid/issues/249
 */
HID.setDriverType('libusb')

/**
 * List detected devices
 */
export function listStreamDecks(): StreamDeckDeviceInfo[] {
	const devices: StreamDeckDeviceInfo[] = []
	for (const dev of HID.devices()) {
		const model = models.find(m => m.productId === dev.productId)

		if (model && dev.vendorId === 0x0fd9 && dev.path) {
			devices.push({
				model: model.id,
				path: dev.path,
				serialNumber: dev.serialNumber
			})
		}
	}
	return devices
}

/**
 * Get the info of a device if the given path is a streamdeck
 */
export function getStreamDeckInfo(path: string): StreamDeckDeviceInfo | undefined {
	return listStreamDecks().find(dev => dev.path === path)
}

const models = [
	{
		id: DeviceModelId.ORIGINAL,
		productId: 0x0060,
		class: StreamDeckOriginal
	},
	{
		id: DeviceModelId.MINI,
		productId: 0x0063,
		class: StreamDeckMini
	},
	{
		id: DeviceModelId.XL,
		productId: 0x006c,
		class: StreamDeckXL
	}
]

export function openStreamDeck(devicePath?: string, options?: OpenStreamDeckOptions): StreamDeck {
	let foundDevices = listStreamDecks()
	if (devicePath) {
		foundDevices = foundDevices.filter(d => d.path === devicePath)
	}

	if (foundDevices.length === 0) {
		if (devicePath) {
			throw new Error(`Device "${devicePath}" was not found`)
		} else {
			throw new Error('No Stream Decks are connected.')
		}
	}

	if (!options) {
		options = {}
	}

	const model = models.find(m => m.id === foundDevices[0].model)
	if (!model) {
		throw new Error('Stream Deck is of unexpected type.')
	}
	return new model.class(foundDevices[0], options)
}
