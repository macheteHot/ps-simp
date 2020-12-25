import dom from './dom.js';


function setLayerBox(layers,delFn,endFn) {
  while (dom.layersBox.hasChildNodes()) {
    dom.layersBox.removeChild(dom.layersBox.childNodes[0])
  }
  const fragment = document.createDocumentFragment()
  for (let i = layers.length - 1; i >= 0; i--) {
    const layer = layers[i];
    const layerNode = document.createElement('div')
    const previewImg = document.createElement('img')
    const showName = document.createElement('p')
    const icon = document.createElement('i')
    layerNode.setAttribute('id', layer.id)
    layerNode.classList.add('flex-flex-start-center','m-t-8', 'border-1', 'border-c-000-85', 'br-4', 'padding-x-8', 'padding-y-4')
    if ( i!== 0 ){
      layerNode.classList.add('cursor-move')
    }
    previewImg.classList.add('m-r-8','square-40')
    previewImg.src = layer.source.currentSrc
    previewImg.alt = layer.id + layer.type
    showName.textContent = layer.name
    icon.classList.add('m-l-auto','iconfont')
    if (i === 0) {
      icon.classList.add('iconlock','curse-not-allowed')
    }else{
      icon.classList.add('iconicon-delete','hover:c-#f00000','cursor-pointer')
      icon.setAttribute('id', layer.id)
      icon.addEventListener('click', delFn)
    }
    layerNode.append(previewImg, showName, icon)
    fragment.appendChild(layerNode)
  }
  dom.layersBox.appendChild(fragment)
  new Sortable(dom.layersBox, {
    animation: 150,
    ghostClass: 'bg-0089ff-25',
    handle:'.cursor-move',
    draggable:'.cursor-move',
    onEnd:endFn,
  });
}

export default setLayerBox