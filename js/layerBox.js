import dom from './dom.js';

function setLayerBox(layers,delFn) {
  while (dom.layersBox.hasChildNodes()) {
    dom.layersBox.removeChild(dom.layersBox.childNodes[0])
  }
  const fragment = document.createDocumentFragment()
  for (let i = layers.length - 1; i >= 0; i--) {
    const layer = layers[i];
    const layerNode = document.createElement('div')
    const previewImg = document.createElement('img')
    const showName = document.createElement('p')
    const iconDel = document.createElement('i')
    layerNode.className = 'flex-flex-start-center m-t-8 border-1 border-c-#333 br-2 padding-x-8 padding-y-4'
    if ( i!== 0 ){
      layerNode.setAttribute('draggable',true)
    }
    previewImg.className = 'm-r-8 square-40'
    previewImg.src = layer.source.currentSrc
    previewImg.alt = layer.id + layer.type
    showName.textContent = layer.name
    // iconMove.classList.add('iconfont')
    iconDel.classList.add('iconfont', 'iconicon-delete')
    iconDel.setAttribute('data-id', layer.id)
    iconDel.addEventListener('click', delFn)
    if (i === 0) {
      // iconMove.classList.add('iconlock')
      // iconMove.style.cssText = 'margin-left: auto;cursor:not-allowed;'
      iconDel.style.cssText = 'display:none;'
    } else {
      // // iconMove.classList.add('iconmove')
      // iconMove.style.cssText = 'cursor: move;'
      iconDel.style.cssText = 'margin:0 4px 0 auto;cursor: pointer;'
      iconDel.classList.add('hover:c-red')
    }
    layerNode.append(previewImg, showName, iconDel, iconMove)
    fragment.appendChild(layerNode)
  }
  dom.layersBox.appendChild(fragment)
}

export default setLayerBox