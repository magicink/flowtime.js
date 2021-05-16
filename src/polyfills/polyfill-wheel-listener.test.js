import { polyfillWheelListener } from './polyfill-wheel-listener'

describe('polyfillWheelListener', () => {
  it('polyfills the wheel listener', () => {
    expect(
      Object.prototype.hasOwnProperty.call(window, 'addWheelListener')
    ).toEqual(false)
    polyfillWheelListener(window, document)
    expect(
      Object.prototype.hasOwnProperty.call(window, 'addWheelListener')
    ).toEqual(true)
  })
})
