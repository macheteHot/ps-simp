export default class Utils {
  static sleep (time = 0) {
    return new Promise((resolve) => {
      setTimeout(resolve, time)
    })
  }

  static getServerDate () {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open('GET', '/', true)
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 3) {
          resolve(Date(xhr.getResponseHeader('Date')))
        }
      }
      xhr.send(null)
    })
  }

  static GeneratorUuid () {
    let d = Date.now() + performance.now()
    return 'hguuid-xxxxxx-xxxx-wxxx-xxxx-xxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = (d + Math.random() * 16) % 16 | 0
      d = Math.floor(d / 16)
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
    })
  }
}
