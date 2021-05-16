import './flowtime.scss'
import * as Brav1Toolbox from './utils'
import { unsafeAttr } from './utils'

const _defaultParallaxX = 50
const _defaultParallaxY = 50

const ABSOLUTE_NAV_CLASS = 'ft-absolute-nav'
const APP_CLASS = 'flowtime'
const APP_SELECTOR = `.${APP_CLASS}`
const SECTION_CLASS = 'ft-section'
const SECTION_SELECTOR = `.${SECTION_CLASS}`
const PAGE_CLASS = 'ft-page'
const PAGE_SELECTOR = `.${PAGE_CLASS}`
const FRAGMENT_CLASS = 'ft-fragment'
const FRAGMENT_SELECTOR = `.${FRAGMENT_CLASS}`
const FRAGMENT_REVEALED_CLASS = 'revealed'
const FRAGMENT_ACTUAL_CLASS = 'actual'
const FRAGMENT_REVEALED_TEMP_CLASS = 'revealed-temp'
const FRAGMENT_REVEALED_ONCE_CLASS = 'revealed-once'
const DEFAULT_PROGRESS_CLASS = 'ft-default-progress'
const DEFAULT_PROGRESS_SELECTOR = `.${DEFAULT_PROGRESS_CLASS}`
const SECTION_THUMB_CLASS = 'ft-section-thumb'
const SECTION_THUMB_SELECTOR = `.${SECTION_THUMB_CLASS}`
const PAGE_THUMB_CLASS = 'ft-page-thumb'
const PAGE_THUMB_SELECTOR = `.${PAGE_THUMB_CLASS}`
const PARENT_CLASS = 'ft-absolute-nav'
const CROSS_DIRECTION_CLASS = 'ft-cross'
const SCROLL_THE_SECTION_CLASS = 'ft-scroll-the-section'

export const Selectors = {
  ABSOLUTE_NAV_CLASS,
  APP_CLASS,
  APP_SELECTOR,
  PAGE_CLASS,
  PAGE_SELECTOR,
  FRAGMENT_CLASS,
  FRAGMENT_SELECTOR,
  FRAGMENT_REVEALED_CLASS,
  FRAGMENT_ACTUAL_CLASS,
  FRAGMENT_REVEALED_TEMP_CLASS,
  FRAGMENT_REVEALED_ONCE_CLASS,
  DEFAULT_PROGRESS_CLASS,
  DEFAULT_PROGRESS_SELECTOR,
  SECTION_CLASS,
  SECTION_SELECTOR,
  SECTION_THUMB_CLASS,
  SECTION_THUMB_SELECTOR,
  PAGE_THUMB_CLASS,
  PAGE_THUMB_SELECTOR,
  PARENT_CLASS,
  CROSS_DIRECTION_CLASS,
  SCROLL_THE_SECTION_CLASS
}

class NavigationMatrix {
  constructor(flowtime) {
    this.flowtime = flowtime
    this.sections = []
    this.sectionsArray = []
    this.allPages = []
    this.fragments = []
    this.fragmentsArray = []
    this.fr = []
    this.parallaxElements = []
    this.sectionsLength = 0
    this.pagesLength = 0
    this.pagesTotalLength = 0
    this.p = 0
    this.sp = 0
    this.pCache = 0
    this.spCache = 0
    this.hilited = false

    if (flowtime.ftContainer) {
      this.update()
    }
  }
  getCurrentPage() {
    return this.sectionsArray[this.p][this.sp]
  }
  getNearestPage(pg, sub) {
    const { flowtime } = this
    if (!flowtime) return
    const {
      isOverview: _isOverview,
      nearestToTop: _nearestToTop,
      updateFragments: _updateFragments
    } = flowtime
    let nsp = pg[sub]
    if (nsp === undefined) {
      if (_nearestToTop === true) {
        nsp = pg[0]
        sub = 0
      } else {
        for (let i = sub; i >= 0; i--) {
          if (pg[i] !== undefined) {
            nsp = pg[i]
            sub = i
            break
          }
        }
      }
    }
    this.sp = sub
    if (!_isOverview) {
      _updateFragments()
    }
    return this.hiliteOrNavigate(nsp)
  }
  getNextSection(top, fos) {
    const { flowtime, fr, fragmentsArray, p, sectionsArray, sp } = this
    const {
      fragmentsAlwaysOnOnceRevealed: _fragmentsAlwaysOnOnceRevealed,
      fragmentsOnBack: _fragmentsOnBack,
      isLoopable: _isLoopable,
      isOverview: _isOverview,
      rememberSectionsLastPage: _rememberSectionsLastPage,
      rememberSectionsStatus: _rememberSectionsStatus,
      sectionsLastPageDepth: _sectionsLastPageDepth,
      sectionsStatus: _sectionsStatus
    } = flowtime
    let sub = sp
    //
    const toTop = _isOverview === true ? false : top

    let onceRevealedCounter = undefined
    let theresFragment =
      fos === true &&
      fragmentsArray[p][sp].length > 0 &&
      fr[p][sp] < fragmentsArray[p][sp].length - 1 &&
      toTop !== true &&
      _isOverview === false
    if (_fragmentsAlwaysOnOnceRevealed === true) {
      onceRevealedCounter = 0
      for (let i = 0; i < fragmentsArray[p][sp].length; i++) {
        if (
          fragmentsArray[p][sp][i].classList.contains(
            FRAGMENT_REVEALED_ONCE_CLASS
          ) === true
        ) {
          onceRevealedCounter += 1
        }
      }
      if (onceRevealedCounter >= fragmentsArray[p][sp].length) {
        theresFragment = false
      }
    }

    if (theresFragment) {
      this.showFragment(p, sp, onceRevealedCounter)
    } else {
      this.sub = 0
      if (toTop === true && p + 1 <= sectionsArray.length - 1) {
        sub = 0
      } else if (
        toTop !== true ||
        _fragmentsOnBack === true ||
        p + 1 > sectionsArray.length - 1
      ) {
        this.sub = sp
      }
      const pTemp = Math.min(p + 1, sectionsArray.length - 1)
      if (_isLoopable === true && pTemp === p) {
        this.p = 0
      } else {
        this.p = pTemp
      }
      //
      if (!_isOverview) {
        if (_rememberSectionsStatus && _sectionsStatus[p] !== undefined) {
          sub = _sectionsStatus[p]
        }
        //
        if (_rememberSectionsLastPage === true) {
          sub = _sectionsLastPageDepth
        }
      }
      //
      return this.getNearestPage(sectionsArray[p], sub)
    }
    return this.hiliteOrNavigate(sectionsArray[p][sp])
  }
  hiliteOrNavigate(d) {
    const { flowtime } = this
    if (!flowtime) return d
    const { isOverview: _isOverview } = flowtime
    if (_isOverview) {
      this.switchActivePage(d)
    } else {
      return d
    }
  }
  setActual(d) {
    Brav1Toolbox.addClass(d, 'actual')
  }
  setParallax(page, sectionIndex, pageIndex) {
    if (this.flowtime.parallaxEnabled) {
      if (this.parallaxElements[sectionIndex]) {
        this.parallaxElements[sectionIndex] = []
      }
      if (this.parallaxElements[sectionIndex][pageIndex]) {
        this.parallaxElements[sectionIndex][pageIndex] = []
      }
      //
      const pxs = page.querySelectorAll('.parallax')
      if (pxs.length > 0) {
        for (let i = 0; i < pxs.length; i++) {
          const el = pxs[i]
          let pX = _defaultParallaxX
          let pY = _defaultParallaxY
          if (el.getAttribute('data-parallax') !== null) {
            const pValues = el.getAttribute('data-parallax').split(',')
            pX = pY = pValues[0]
            if (pValues.length > 1) {
              pY = pValues[1]
            }
          }
          el.pX = pX
          el.pY = pY
          this.parallaxElements[sectionIndex][pageIndex].push(el)
        }
      }
    }
  }
  showFragment(fp, fsp, f) {
    const { flowtime, fr, fragmentsArray } = this
    if (!flowtime) return
    const { fragmentsAlwaysOnOnceRevealed: _fragmentsAlwaysOnOnceRevealed } =
      flowtime
    if (f) {
      fr[fp][fsp] = f
    } else {
      f = fr[fp][fsp] += 1
    }
    const currentFragment = fragmentsArray[fp][fsp][f]
    //
    for (let i = 0; i <= f; i++) {
      Brav1Toolbox.addClass(fragmentsArray[fp][fsp][i], FRAGMENT_REVEALED_CLASS)
      Brav1Toolbox.removeClass(
        fragmentsArray[fp][fsp][i],
        FRAGMENT_ACTUAL_CLASS
      )
      if (_fragmentsAlwaysOnOnceRevealed === true) {
        Brav1Toolbox.addClass(
          fragmentsArray[fp][fsp][i],
          FRAGMENT_REVEALED_ONCE_CLASS
        )
      }
    }
    Brav1Toolbox.addClass(currentFragment, FRAGMENT_ACTUAL_CLASS)
  }
  switchActivePage(d, navigate) {
    const { flowtime } = this
    if (!flowtime) return
    const { isOverview: _isOverview } = flowtime
    const sIndex = d.parentNode.index
    for (let i = 0; i < this.sectionsArray.length; i++) {
      const pa = this.sectionsArray[i]
      for (let ii = 0; ii < pa.length; ii++) {
        const spa = pa[ii]
        //
        Brav1Toolbox.removeClass(spa, 'past-section')
        Brav1Toolbox.removeClass(spa, 'future-section')
        Brav1Toolbox.removeClass(spa, 'past-page')
        Brav1Toolbox.removeClass(spa, 'future-page')
        //
        if (spa !== d) {
          Brav1Toolbox.removeClass(spa, 'hilite')
          if (_isOverview === false && spa !== this.getCurrentPage()) {
            Brav1Toolbox.removeClass(spa, 'actual')
          }
          if (i < sIndex) {
            Brav1Toolbox.addClass(spa, 'past-section')
          } else if (i > sIndex) {
            Brav1Toolbox.addClass(spa, 'future-section')
          }
          if (spa.index < d.index) {
            Brav1Toolbox.addClass(spa, 'past-page')
          } else if (spa.index > d.index) {
            Brav1Toolbox.addClass(spa, 'future-page')
          }
        }
      }
    }
    Brav1Toolbox.addClass(d, 'hilite')
    if (navigate) {
      this.setActual(d)
    }
    this.hilited = d
  }
  update() {
    this.sectionsArray = []
    this.parallaxElements = []
    this.fragments = document.querySelectorAll(FRAGMENT_SELECTOR)
    this.fragmentsArray = []
    this.sections = this.flowtime.ftContainer.querySelectorAll(
      `${Selectors.APP_SELECTOR} > ${SECTION_SELECTOR}`
    )
    this.allPages = this.flowtime.ftContainer.querySelectorAll(
      `${Selectors.APP_SELECTOR} ${PAGE_SELECTOR}`
    )
    //
    for (let i = 0; i < this.sections.length; i++) {
      const pagesArray = []
      this.fragmentsArray[i] = []
      this.fr[i] = []
      this.flowtime.sectionDataIdMax += 1
      //
      // set data-id and data-prog attributes to sections to manage the navigation
      const section = this.sections[i]
      if (section.getAttribute('data-id')) {
        section.setAttribute(
          'data-id',
          `__${unsafeAttr(section.getAttribute('data-id'))}`
        ) // prevents attributes starting with a number
      } else {
        section.setAttribute('data-id', `__${this.flowtime.sectionDataIdMax}`)
      }
      if (section.getAttribute('data-prog')) {
        section.setAttribute(
          'data-prog',
          `__${unsafeAttr(section.getAttribute('data-prog'))}`
        ) // prevents attributes starting with a number
      } else {
        section.setAttribute('data-prog', `__${this.flowtime.sectionDataIdMax}`)
      }
      section.index = i
      // remove the standard ID section.setAttribute("id", "");
      //
      // set data-id and data-prog attributes to pages to manage the navigation
      const pages = section.querySelectorAll(PAGE_SELECTOR)
      this.pagesTotalLength += pages.length
      this.pagesLength = Math.max(this.pagesLength, pages.length) // sets the pages max number for overview purposes
      for (let j = 0; j < pages.length; j++) {
        const page = pages[j]
        if (page.getAttribute('data-id')) {
          page.setAttribute(
            'data-id',
            `__${unsafeAttr(page.getAttribute('data-id'))}`
          ) // prevents attributes starting with a number
        } else {
          page.setAttribute('data-id', `__${j + 1}`)
        }
        if (page.getAttribute('data-prog')) {
          page.setAttribute(
            'data-prog',
            `__${unsafeAttr(page.getAttribute('data-prog'))}`
          ) // prevents attributes starting with a number
        } else {
          page.setAttribute('data-prog', `__${j + 1}`)
        }
        page.index = j
        // remove the standard ID page.setAttribute("id", "");
        // set data-title attributes to pages that doesn't have one and have at least an h1 heading element inside
        if (!page.getAttribute('data-title')) {
          const heading = page.querySelector('h1')
          if (heading !== null && heading.textContent) {
            page.setAttribute('data-title', heading.textContent)
          }
        }
        // store parallax data on elements
        this.setParallax(page, i, j)
        //
        pagesArray.push(page)
        //
        this.fragmentsArray[i][j] = page.querySelectorAll(FRAGMENT_SELECTOR)
        this.fr[i][j] = -1
      }
      this.sectionsArray.push(pagesArray)
    }
    //
    this.sectionsLength = this.sections.length // sets the sections max number for overview purposes
    this.flowtime.resetScroll()
    this.flowtime.onUpdate && this.flowtime.onUpdate()
    this._updateOffsets()
  }
  _updateOffsets() {
    const { flowtime } = this
    if (!flowtime) return
    const {
      crossDirection,
      ftContainer,
      xGlobal,
      xGlobalDelta,
      yGlobal,
      yGlobalDelta
    } = flowtime
    this.flowtime.xGlobal = ftContainer.offsetLeft
    this.flowtime.yGlobal = ftContainer.offsetTop
    for (let i = 0; i < this.allPages.length; i++) {
      const _sp = this.allPages[i]
      const _spParent = _sp.getBoundingClientRect()
      //
      if (!i) {
        this.flowtime.xGlobalDelta = _sp.offsetLeft - xGlobal
        this.flowtime.yGlobalDelta = _sp.offsetTop - yGlobal
      }
      if (!_spParent) return
      //  _
      if (crossDirection && _spParent) {
        _sp.x = _sp.offsetLeft - (xGlobal + xGlobalDelta)
        _sp.y = _spParent.top
      } else {
        _sp.x = _spParent.left
        _sp.y = _sp.offsetTop - (yGlobal + yGlobalDelta)
      }
    }
  }
}

class Flowtime {
  constructor(options) {
    const browserIsSupported = Brav1Toolbox.detectBrowserSupport()

    // Exposed API
    this.momentumScrollDelay = 2000
    this.transitionTime = 500
    this.onUpdate = null

    Object.assign(this, options)

    // Cached References
    this.html = document.querySelector('html')
    this.body = document.querySelector('body')
    this.ftContainer = document.querySelector('.flowtime')
    this.ftParent = null
    this.navigationMatrix = null

    // Derived settings
    this.parallaxEnabled = document.querySelector('.parallax') !== null
    this.crossDirection = false

    // State
    this.xGlobal = 0
    this.yGlobal = 0
    this.xGlobalDelta = 0
    this.yGlobalDelta = 0

    if (browserIsSupported && this.ftContainer) {
      this.init()
    }
  }

  /**
   * Initialize Flowtime
   */
  init() {
    this.initTransitionTime()

    this.ftParent = this.ftContainer.parentNode
    Brav1Toolbox.addClass(this.ftParent, Selectors.ABSOLUTE_NAV_CLASS)

    this.crossDirection = Brav1Toolbox.hasClass(
      this.ftContainer,
      Selectors.CROSS_DIRECTION_CLASS
    )

    /**
     * Initialize Navigation Matrix
     * @type {NavigationMatrix}
     */
    this.navigationMatrix = new NavigationMatrix(this)
  }

  initTransitionTime() {
    const tt = Brav1Toolbox.getCSSValue(this.ftContainer, 'transitionDuration')
    const ttInt = parseFloat(tt)
    const unit = tt.replace(`${ttInt}`, '')
    if (!isNaN(ttInt) && ttInt > 0) {
      if (unit === 's') {
        this.transitionTime = ttInt * 1000
      } else if (unit === 'ms') {
        this.transitionTime = ttInt
      }
    }
    this.setTransitionTime(this.transitionTime)
    this.momentumScrollDelay = this.transitionTime * 4
  }

  resetScroll() {
    window.scrollTo(0, 0)
  }

  setTransitionTime(milliseconds) {
    this.transitionTime = milliseconds
    this.ftContainer.style[
      Brav1Toolbox.getPrefixed('transition-duration')
    ] = `${this.transitionTime}ms`
  }
}

export default Flowtime
