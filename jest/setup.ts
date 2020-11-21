global.document.createElement = (function (create) {
  return function () {
    const element: HTMLElement = create.apply(this, arguments)

    if (element.tagName === 'IMG') {
      setTimeout(() => {
        const [width, height] = element.getAttribute('src')!.split('x')

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
