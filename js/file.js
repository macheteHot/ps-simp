
export default class FiltUtil {
  constructor (file) {
    this.file = file
  }

  convertFileToImg () {
    return new Promise((resolve, reject) => {
      const img = new Image()
      const reader = new FileReader()
      reader.readAsDataURL(this.file)
      reader.onloadend = ({ target }) => {
        img.src = target.result
      }
      img.onload = () => { resolve(img) }
    })
  }
}
