
import Utils from './utils.js'
import dom from './dom.js';
import setLayerBox from './layerBox.js';

function getLayer (img, x = 0, y = 0) {
  const [all,name,type] = img.fileName.match(/^([\s\S]+)\.([a-zA-Z]+)$/)
  const { width, height } = img
  return {
    id: Utils.GeneratorUuid(),
    name:name.substr(0,5),
    source: img, // 源
    type, // 类型
    polylinePoints: [
      [0, 0],
      [width, 0],
      [width, height],
      [0, height],
      [0, 0]
    ], // 所有点的坐标 [[x,y]] 形成闭环
    x,
    y,
    offsetX: 0,
    offsetY: 0,
    width,
    height
  }
}
// 重新计算坐标系
function getLayerPolylinePointsByOffset (layer, offsetX, offsetY) {
  const { x, y, width, height } = layer
  return [
    [x + offsetX, y + offsetY],
    [width + offsetX + x, offsetY + y],
    [width + offsetX + x, height + offsetY + y],
    [offsetX + x, height + offsetY + y],
    [offsetX + x, offsetY + y]
  ]
}

// 射线判断点在多边形内部
function rayCasting (p, poly) {
  const px = p.x
  const py = p.y
  let flag = false
  for (let i = 0, l = poly.length, j = l - 1; i < l; j = i, i++) {
    const sx = poly[i][0]
    const sy = poly[i][1]
    const tx = poly[j][0]
    const ty = poly[j][1]
    if ((sx === px && sy === py) || (tx === px && ty === py)) {
      return false
    }
    if ((sy < py && ty >= py) || (sy >= py && ty < py)) {
      const x = sx + (py - sy) * (tx - sx) / (ty - sy)
      if (x === px) {
        return false
      }
      if (x > px) {
        flag = !flag
      }
    }
  }
  return flag
}

class Draw {
  constructor () {
    this.defaultImg = null
    this.canvas = dom.canvas
    this.canvas.width = 0
    this.canvas.height = 0
    this.ctx = this.canvas.getContext('2d')
    // 图层
    this.layers = []
  }

  // 判断点在哪一个图层 优先取上面的图层
  getLayerIdByPoint (event) {
    const x = event.offsetX
    const y = event.offsetY
    for (let i = this.layers.length - 1; i >= 0; i--) {
      const layer = this.layers[i]
      if (rayCasting({ x, y }, layer.polylinePoints)) {
        return layer.id
      }
    }
    return null
  }

  reDraw () {
    const [defaultLatyer, ...layers] = this.layers
    this.canvas.width = defaultLatyer.width
    this.canvas.height = defaultLatyer.height
    this.ctx.clearRect(0, 0, defaultLatyer.width, defaultLatyer.height)
    this.ctx.drawImage(defaultLatyer.source, defaultLatyer.x, defaultLatyer.y)
    layers.forEach(layer => {
      this.ctx.drawImage(layer.source, layer.x + layer.offsetX, layer.y + layer.offsetY)
    })
  }

  getLayerById (layerId) {
    return this.layers.find(({ id }) => id === layerId)
  }

  moveLayerById ([offsetX, offsetY], layerId) {
    const layer = this.getLayerById(layerId)
    if (this.layers[0].id === layerId) {
      return null
    }
    if (layer) {
      layer.offsetX = offsetX
      layer.offsetY = offsetY
      this.reDraw()
      this.ctx.strokeStyle = 'red'
      this.ctx.lineWidth = 6
      this.ctx.strokeRect(layer.x + layer.offsetX, layer.y + layer.offsetY, layer.width, layer.height)
    }
  }

  // 移动完成
  moveLayerEndById (layerId) {
    const layer = this.getLayerById(layerId)
    layer.polylinePoints = getLayerPolylinePointsByOffset(layer, layer.offsetX, layer.offsetY)
    if (layer) {
      layer.x = layer.x + layer.offsetX
      layer.y = layer.y + layer.offsetY
      layer.offsetX = 0
      layer.offsetY = 0
    }
    this.reDraw()
  }

  sortLayer ({target}){
    const idList = [...target.children].map(_=>_.getAttribute('id'))
    this.layers  = this.layers.sort((a,b)=>idList.indexOf(b.id) - idList.indexOf(a.id))
    this.reDraw()
  }

  delLayerByEvent({target}) { 
    const layerId = target.getAttribute('id')
    this.layers = this.layers.filter(layer => layer.id !== layerId)
    setLayerBox(this.layers,this.delLayerByEvent.bind(this),this.sortLayer.bind(this))
    this.reDraw()
  }

  addLayerByImg (img) {
    this.layers.push(getLayer(img))
    setLayerBox(this.layers,this.delLayerByEvent.bind(this),this.sortLayer.bind(this))
    this.reDraw()
  }

  addEventListener (...args) {
    this.canvas.addEventListener(...args)
  }

  removeEventListener (...args) {
    this.canvas.removeEventListener(...args)
  }
}

export default Draw
