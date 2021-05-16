import Flowtime, { Selectors } from './index'
describe('Flowtime', () => {
  const sections = 10
  const pages = 5
  beforeAll(() => {
    window.scrollTo = jest.fn()
    const flowtime = document.createElement('div')
    flowtime.classList.add('flowtime')
    for (let i = 0; i < sections; i++) {
      const section = document.createElement('div')
      section.classList.add(Selectors.SECTION_CLASS)
      for (let j = 0; j < pages; j++) {
        const page = document.createElement('div')
        page.classList.add(Selectors.PAGE_CLASS)
        const title = document.createElement('h1')
        title.textContent = `Section ${i + 1}: Page ${j}`
        page.appendChild(title)
        section.appendChild(page)
      }
      flowtime.appendChild(section)
    }
    const container = document.createElement('div')
    container.setAttribute('id', 'container')
    container.appendChild(flowtime)
    document.body.appendChild(container)
  })
  it('initializes', () => {
    const onUpdate = jest.fn()
    const flowtime = new Flowtime({
      onUpdate,
      transitionTime: 250
    })
    expect(flowtime.transitionTime).toEqual(250)
    const container = document.getElementById('container')
    expect(container.classList.contains(Selectors.PAGE_CLASS))
    expect(flowtime.navigationMatrix).not.toBeNull()
    expect(window.scrollTo).toHaveBeenCalled()
    expect(onUpdate).toHaveBeenCalled()
    expect(flowtime.navigationMatrix.sections.length).toEqual(sections)
  })
})
