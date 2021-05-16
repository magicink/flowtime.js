export const cssPrefixes = ['', '-webkit-', '-moz-', '-ms-', '-o-']

export const addListener = (element, type, handler, useCapture) => {
  if (!element) return
  if (element.addEventListener) {
    element.addEventListener(type, handler, useCapture)
  } else if (Object.prototype.hasOwnProperty.call(element, 'attachEvent')) {
    element.attachEvent(`on${type}`, handler)
  }
}
export const removeListener = (element, type, handler) => {
  if (element.removeEventListener) {
    element.removeEventListener(type, handler)
  } else if (Object.prototype.hasOwnProperty.call(element, 'detachEvent')) {
    element.detachEvent(`on${type}`, handler)
  }
}

export const getStyleObject = () => {
  if (Object.prototype.hasOwnProperty.call(window, 'getComputedStyle')) {
    return window.getComputedStyle(document.body)
  } else {
    return document.documentElement.style
  }
}

export function getPrefixed(prop) {
  const o = getStyleObject()
  for (let i = 0; i < cssPrefixes.length; i++) {
    const pre = cssPrefixes[i].replace(/-/g, '')
    let p = prop
    if (pre.length > 0) {
      p = p.charAt(0).toUpperCase() + p.substr(1)
    }
    p = `${pre}${p}`
    if (p in o) {
      return p
    }
  }
  return ''
}

export const getCSSValue = (element, prop) => {
  const p = getPrefixed(prop)
  if (window.getComputedStyle) {
    return window.getComputedStyle(element)[p]
  } else {
    return element.style[p]
  }
}

export function typeOf(obj) {
  return !!obj && Object.prototype.toString.call(obj).match(/(\w+)]/)[1]
}

export function hasClass(el, c) {
  if (el) {
    if (el.classList) {
      return el.classList.contains(c)
    } else if (el.className) {
      return el.className.indexOf(c) !== -1
    }
  }
  return false
}

export function addClass(el, c) {
  if (el.classList) {
    el.classList.add(c)
  } else if (hasClass(el, c) === false) {
    let cl = el.className
    if (cl.length > 0) {
      cl += ' '
    }
    el.className = cl + c
  }
}

export function removeClass(el, c) {
  if (el.classList) {
    el.classList.remove(c)
  } else {
    let cl = el.className
    if (cl.indexOf(c) !== -1) {
      if (cl.indexOf(` ${c}`) !== -1) {
        cl = cl.replace(` ${c}`, '')
      } else if (cl.indexOf(`${c} `) !== -1) {
        cl = cl.replace(`${c} `, '')
      } else {
        cl = cl.replace(c, ``)
      }
    }
    el.className = cl
  }
}

export function distance(pA, pB) {
  let cX
  let cY
  cX = pB.x - pA.x
  cX *= cX
  cY = pB.y - pA.y
  cY *= cY

  return Math.abs(Math.sqrt(cX + cY))
}

export const detectBrowserSupport = () => {
  let browserSupport = true
  try {
    const htmlClass = document.querySelector('html').className.toLowerCase()
    if (
      htmlClass.indexOf('ie7') > -1 ||
      htmlClass.indexOf('ie8') > -1 ||
      htmlClass.indexOf('lt-ie9') > -1
    ) {
      browserSupport = false
    }
  } catch (e) {
    browserSupport = false
  }
  return browserSupport
}

export const detectTouchDevice = () => {
  let isTouchDevice = false
  if (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  ) {
    isTouchDevice = true
  }
  return isTouchDevice
}

export function dispatchEvent(t, ps) {
  if (document.createEvent) {
    const e = document.createEvent('HTMLEvents')
    e.initEvent(t, true, true)
    for (const p in ps) {
      if (Object.prototype.hasOwnProperty.call(ps, p)) {
        e[p] = ps[p]
      }
    }
    document.dispatchEvent(e)
  }
}

export function unsafeAttr(a) {
  if (a.substr(0, 2) === '__') {
    return a.replace(/__/, '')
  } else {
    return a
  }
}
