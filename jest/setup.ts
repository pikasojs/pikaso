if (global.document) {
  global.document.createElement = (function (create) {
    return function () {
      const element: HTMLElement = create.apply(this, arguments)

      if (element.tagName === 'IMG') {
        setTimeout(() => {
          let src = element.getAttribute('src') || ''

          if (/\d+x\d+/gm.test(src) === false) {
            src = '1200x800'
          }

          const [width, height] = src.split('x')

          element.setAttribute('width', width)
          element.setAttribute('naturalWidth', width)
          element.setAttribute('height', height)
          element.setAttribute('naturalHeight', height)

          element.onload!(new Event('load'))
        }, 100)
      }

      return element
    }
  })(document.createElement)
}
