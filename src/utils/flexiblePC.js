;(function (window, document) {
  let dpr = window.devicePixelRatio || 1
  let rootHhtml = document.documentElement
  // html 设置font大小  主要给div等类大小
  function setRootFontSize() {
    let rem, rootWidth
    // 限制展现页面的最小宽度
    rootWidth =
      rootHhtml.clientWidth < 960
        ? 960
        : rootHhtml.clientWidth > 1300
        ? 1300
        : rootHhtml.clientWidth
    rem = rootWidth / 19.2
    // 动态写入样式
    rootHhtml.style.fontSize = `${rem}px`
  }
  setRootFontSize()
  window.addEventListener('resize', setRootFontSize, false)
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      setRemUnit()
    }
  })

  // body 设置font大小  主要给字体大小
  function setBodyFontSize() {
    let fontSize =
      rootHhtml.clientWidth < 960
        ? 20
        : rootHhtml.clientWidth > 1300
        ? 24
        : (rootHhtml.clientWidth - 960) * (4 / 340) + 20

    if (document.body) {
      document.body.style.fontSize = fontSize + 'px'
    } else {
      document.addEventListener('DOMContentLoaded', setBodyFontSize)
    }
  }
  setBodyFontSize()
  window.addEventListener('resize', setBodyFontSize, false)
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      setBodyFontSize()
    }
  })

  if (dpr >= 2) {
    var fakeBody = document.createElement('body')
    var testElement = document.createElement('div')
    testElement.style.border = '.5px solid transparent'
    fakeBody.appendChild(testElement)
    docEl.appendChild(fakeBody)
    if (testElement.offsetHeight === 1) {
      docEl.classList.add('hairlines')
    }
    docEl.removeChild(fakeBody)
  }
})(window, document)
