import {
  addClass,
  addListener,
  getCSSValue,
  distance,
  getStyleObject,
  getPrefixed,
  hasClass,
  removeListener,
  removeClass,
  typeOf,
  polyfillWheelListener,
  detectTouchDevice,
  detectBrowserSupport
} from './index'
describe('utils', () => {
  describe('addListener()', () => {
    it('uses addEventListener', () => {
      const element = {
        addEventListener: jest.fn(),
        attachEvent: jest.fn()
      }
      const handler = jest.fn()
      addListener(element, 'eventname', handler, true)
      expect(element.addEventListener).toHaveBeenCalled()
      expect(element.attachEvent).not.toHaveBeenCalled()
    })
    it('uses attachElement', () => {
      const element = {
        attachEvent: jest.fn()
      }
      const handler = jest.fn()
      addListener(element, 'eventname', handler, true)
      expect(element.attachEvent).toHaveBeenCalled()
    })
  })
  describe('removeListener()', () => {
    it('uses removeEventListener', () => {
      const element = {
        removeEventListener: jest.fn(),
        detachEvent: jest.fn()
      }
      const handler = jest.fn()
      removeListener(element, 'eventname', handler)
      expect(element.removeEventListener).toHaveBeenCalled()
      expect(element.detachEvent).not.toHaveBeenCalled()
    })
    it('uses detachElement', () => {
      const element = {
        detachEvent: jest.fn()
      }
      const handler = jest.fn()
      removeListener(element, 'eventname', handler)
      expect(element.detachEvent).toHaveBeenCalled()
    })
  })
  describe('getStyleObject', () => {
    it('does not throw an error', () => {
      expect(() => {
        getStyleObject()
      }).not.toThrow()
      const result = getStyleObject()
      expect(result).not.toBeNull()
    })
  })
  describe('getPrefixed', () => {
    it('returns the prefixed CSS property', () => {
      const expected = 'margin'
      const result = getPrefixed(expected)
      expect(result).toEqual(expected)
    })
  })

  describe('getCSSValue', () => {
    beforeAll(() => {
      const el = document.createElement('div')
      el.setAttribute('id', 'test-div')
      el.setAttribute('style', 'padding: 1px')
      document.body.appendChild(el)
    })
    it('returns the style of an element', () => {
      const el = document.getElementById('test-div')
      expect(el).not.toBeNull()
      const result = getCSSValue(el, 'padding')
      expect(result).toEqual('1px')
    })
  })

  describe('typeOf', () => {
    it('returns the object type', () => {
      expect(typeOf({}) === typeof {})
    })
  })

  describe('hasClass', () => {
    beforeAll(() => {
      const el = document.createElement('div')
      el.setAttribute('id', 'has-class-test-el')
      el.classList.add('test-class')
      document.body.appendChild(el)
    })
    it('detects whether a class is present', () => {
      const el = document.getElementById('has-class-test-el')
      expect(hasClass(el, 'test-class')).toEqual(true)
      expect(hasClass(el, 'invalid-class')).toEqual(false)
    })
  })
  describe('addClass/removeClass', () => {
    beforeAll(() => {
      const el = document.createElement('div')
      el.setAttribute('id', 'add-class-test-el')
      document.body.appendChild(el)
    })
    it('detects whether a class is present', () => {
      const el = document.getElementById('add-class-test-el')
      addClass(el, 'test-class')
      expect(hasClass(el, 'test-class')).toEqual(true)
      removeClass(el, 'test-class')
      expect(hasClass(el, 'test-class')).toEqual(false)
      expect(() => {
        removeClass(el, 'invalid-class')
      }).not.toThrow()
    })
  })
  describe('getDistance', () => {
    it('returns the distance between two points', () => {
      const a = { x: 1, y: 1 }
      const b = { x: 0, y: 0 }
      const result = distance(a, b)
      expect(typeof result).toEqual('number')
    })
  })
  describe('detectTouchDevice', () => {
    it('detects touch device', () => {
      expect(detectTouchDevice()).toEqual(false)
      window.ontouchstart = jest.fn()
      expect(detectTouchDevice()).toEqual(true)
      window.ontouchstart = undefined
    })
  })
  describe('detectBrowserSupport', () => {
    it('detects browser support', () => {
      const html = document.querySelector('html')
      expect(html).not.toBeNull()
      expect(detectBrowserSupport()).toEqual(true)
      addClass(html, 'ie7')
      expect(detectBrowserSupport()).toEqual(false)
      removeClass(html, 'ie7')
    })
  })
})
