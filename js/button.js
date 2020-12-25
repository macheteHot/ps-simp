/**
 *
 */

import FiltUtil from './file.js'
import Draw from './draw.js'

const draw = new Draw()
class ImgInput {
  constructor () {
    this.inputEle = document.createElement('input')
    this.inputEle.type = 'file'
    this.inputEle.setAttribute('accept', 'image/*')
    this.btn = null
  }

  getInput () {
    return this.inputEle
  }

  setChangeEvent (fn) {
    this.inputEle.addEventListener('change', fn)
    return this
  }
}

class Btn {
  constructor () {
    this.btn = document.createElement('button')
  }

  getBtn () {
    return this.btn
  }

  setClickElement (EleNode) {
    this.btn.addEventListener('click', () => {
      EleNode.click()
    })
    return this
  }

  setText (text) {
    this.btn.textContent = text
    return this
  }
}

async function putLayer ({ target }) {
  const [file] = target.files
  const fileUtil = new FiltUtil(file)
  const img = await fileUtil.convertFileToImg()
  draw.addLayerByImg(img)
}

const addLayer = new ImgInput()
  .setChangeEvent(putLayer)
  .getInput()
const addLayerBtn = new Btn()
  .setClickElement(addLayer)
  .setText('添加图层')
  .getBtn()

let layerid = null
let start = [0, 0]

function mouseDown (event) {
  const { offsetX, offsetY } = event
  layerid = draw.getLayerIdByPoint(event)
  start = [offsetX, offsetY]
  draw.addEventListener('mousemove', mouseMove)
  draw.addEventListener('mouseup', mouseUp)
}
function mouseMove (event) {
  window.requestAnimationFrame(() => {
    const { offsetX, offsetY } = event
    const [startX, startY] = start
    const moves = [offsetX - startX, offsetY - startY]
    draw.moveLayerById(moves, layerid)
  })
}
function mouseUp () {
  draw.removeEventListener('mousemove', mouseMove)
  draw.moveLayerEndById(layerid)
  layerid = null
  start = [0, 0]
}

draw.addEventListener('mousedown', mouseDown)

export default [ addLayerBtn ]
