const { getDeviceList, WebUSBDevice } = require("usb")
const { unpack } = require("./packet")

let getDevice = async () => {
  let devices = getDeviceList()
  console.log({
    count: devices.length,
    devices: devices.map((d) => ({
      vendor: d.deviceDescriptor.idVendor,
      product: d.deviceDescriptor.idProduct,
    })),
  })
  let isPrinter = (device) =>
    device.deviceDescriptor.idVendor === 17224 &&
    device.deviceDescriptor.idProduct === 21892
  let [printer] = devices.filter((device) => isPrinter(device))

  if (!printer) {
    return
  }

  let device = await WebUSBDevice.createInstance(printer)

  await device.open()
  await device.selectConfiguration(1)
  await device.claimInterface(0)

  let transfer = async (data, { read = false } = {}) => {
    let promise = device.transferOut(2, data)
    let ret
    if (read) {
      let result = await device.transferIn(2, 8192)
      ret = unpack(Buffer.from(result.data.buffer))
    }
    let result = await promise
    console.log(result)
    return ret
  }

  return {
    device,
    transfer,
  }
}

module.exports = {
  getDevice,
}
