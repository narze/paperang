let { getDevice } = require("./device")
let { pack, unpack, commands } = require("./packet")
let { ImageData } = require("./image")
let { createImageData } = require("./png")
let { sleep } = require("./sleep")
const fs = require("fs")
const text2png = require("text2png")
const sharp = require("sharp")
fs.writeFileSync(
  "./images/out.png",
  text2png("narzeLIVE\nทดสอบภาษาไทย\nඞඞඞඞඞඞඞඞඞ", {
    backgroundColor: "white",
    padding: 2,
  })
)
;(async () => {
  sharp("./images/out.png").resize(384).toFile("./images/out_resized.png")

  let { device, transfer } = await getDevice()

  if (!device) {
    console.log("no device")
    return
  }

  let space = (v = 1) => transfer(commands.printFeedLine(v))

  // get temperature: 0x12
  // receive temperature: 0x13

  // let getTemperature = async () => {
  //   let result = await transfer(pack(0x12), { read: true });
  //   if(result.data.length > 0) {
  //     return result.data.readUInt8(0);
  //   } else {
  //     return 0;
  //   }
  // };

  // console.log('baseline', await getTemperature());

  let full = true

  if (full) {
    await space(150)
    await transfer(commands.paperType(0))

    for (let i = 0; i < 1; i++) {
      let buffers = await createImageData()
      for (let buffer of buffers) {
        console.log(buffers[0], buffers[0].length)
        console.log(pack(0x00, buffers[0]))
        await transfer(pack(0x00, buffer))
      }
    }
    // const text = "hello"
    // const data = new Uint8Array(
    //   text.split("").map((char) => char.charCodeAt(0))
    // )
    // console.log(pack(0x00, data.buffer))
    // const result = await device.transferOut(2, pack(0x00, data))
    // console.log({ result })
  }

  await space(250)
})()
