import throttle from 'lodash.throttle'
import Concert from 'concert'
import { TweenLite } from 'gsap'

/*
Example Markup
<ul data-behaviour="accordion" class="nav expander">
	<li class="expander__wrap">
		<a href="#e1" class="expand__btn js-expand-btn">Button Bitch</a>
	  <div id="e1" class="expand__content js-expand-content">
	    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Commodi aspernatur explicabo, at qui id sed quibusdam cupiditate impedit suscipit voluptate voluptas veniam similique ea, eveniet quam. Veritatis iste maiores error?</p>
	  </div>
	</li>
	<li class="expander__wrap">
		<a href="#e2" class="expand__btn js-expand-btn">Button Bitch</a>
	  <div id="e2" class="expand__content js-expand-content">
	    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Commodi aspernatur explicabo, at qui id sed quibusdam cupiditate impedit suscipit voluptate voluptas veniam similique ea, eveniet quam. Veritatis iste maiores error?</p>
	  </div>
	</li>
</ul>

Basic Usage:
const el = document.querySelector('.expand-wrapper')
const accordion = new Expander(el, {
	closeOthers: true,
	button: '.js-expand-btn',
	content: '.js-expand-content',
	init: true
})

// events
accordion.on('before:open', function(button, target) {})
accordion.on('after:open', function(button, target) {})
accordion.on('before:close', function(button, target) {})
accordion.on('after:close', function(button, target) {})

// methods
accordion.removeEvents() // removes click handlers
accordion.addEvents() // bind click handlers
accordion.open(el.querySelector('.js-button'))
accordion.close(el.querySelector('.js-button'))
*/


/**
 * Creates a new Expander.
 * @class
 */
export default class Expander {
  /**
   * Create an expander.
   * @param {el} el - The dom node, querySelector('.myelm')
   * @param {opts} opts - The expander options
   */
	constructor(el, opts = {}) {
		this.el = el
		this.button = opts.button || '.js-expand-btn'
		this.activeClass = opts.activeClass || 'is-active'
		this.content = opts.content || '.js-expand-content'
		this.closeOthers = opts.closeOthers || false
		this.duration = opts.duration || 300
		this.init = opts.init || false
		this.name = opts.name || 'expander'
		// get the elements
		this.elements = Array.from(this.el.querySelectorAll(this.button))
		// create event delegation container
		// this.delegate = new Delegate(this.el)
		// bind methods 
		this.handleButtonClicks = this.handleButtonClicks.bind(this)
		this.addEvents = this.addEvents.bind(this)
		this.removeEvents = this.removeEvents.bind(this)
		this.open = this.open.bind(this)
		this.close = this.close.bind(this)
		this.destroy = this.destroy.bind(this)
		this.updateTabIndex = this.updateTabIndex.bind(this)
		this.events = ['before:open', 'after:open', 'before:close', 'after:close']
		// merge concert events into Expander
		Object.assign(this, Concert)
		this.fn = throttle(this.handleButtonClicks, 300)
		this.init && this.addEvents()
		this.addAccessibility()
	}

  /**
   * Attached the click handle
   * @return {object} this
   */
	addEvents() {
		this.el.on('click', this.button, this.fn)
		return this
	}

  /**
   * Remove the click handle
   * @return {object} this
   */
	removeEvents() {
		this.el.off('click', this.button, this.fn)
		return this
	}

  /**
   * Returns DOM to it's pre initalized state, removes all events
   * @return {object} this
   */
	destroy() {
		this.elements.forEach((button) => {
			const target = this.getTarget(button)
			button.classList.remove(this.activeClass)
			button.removeAttribute('aria-expanded')
			button.removeAttribute('aria-selected')
			button.removeAttribute('aria-controls')
			button.removeAttribute('role', 'tab')
			target.removeAttribute('aria-hidden')
			target.removeAttribute('aria-labelledby')
			target.removeAttribute('role', 'tabpanel')
			target.classList.remove(this.activeClass)
			target.removeAttribute('style')
		})
		this.el.removeAttribute('role')
		this.el.removeAttribute('aria-multiselectable')
		this.events.forEach(event => this.off(event))
		this.removeEvents()
		return this
	}

  /**
   * Returns the buttons target element
   * @param {button} button - The button dom node
   * @return {Object} the dom node
   */
	getTarget(button) {
		return this.el.querySelector(`${button.getAttribute('href')}`)
	}

  /**
   * The click handler
   * @param {e} e - the event object
   * @return {Object} this
   */
	handleButtonClicks(e) {
		e.preventDefault()
		const button = e.srcElement

		this.closeOthers && this.elements
			.filter((element) => 
				element.classList.contains(this.activeClass) 
				&& element.getAttribute('href') !== button.getAttribute('href'))
			.forEach((element) => {
				this.close(element)
			})

		button.classList.contains(this.activeClass) 
			? this.close(button) 
			: this.open(button)
	}

  /**
   * The open expander method
   * @param {button} button - The buttons dom node
   * @return {Object} this
   */
	open(button) {
		const target = this.getTarget(button)
		const _this = this
		TweenLite.set(target, {
			height: "auto",
			onComplete() {
				_this.trigger('before:open', button, target)
				button.classList.add('is-active')
				button.setAttribute('aria-expanded', true)
				button.setAttribute('aria-selected', true)
				target.setAttribute('aria-hidden', false)
				button.setAttribute('tab-index', '')
				_this.updateTabIndex()
			}
		})
		TweenLite.from(target, 0.2, {
			height: 0,
			onComplete() {
				_this.trigger('after:open', button, target)
			}
		})

		return this
	}

	updateTabIndex() {
		this.elements
			.filter((element) => !element.classList.contains(this.activeClass))
			.forEach((element) => element.setAttribute('tab-index', -1))

		return this
	}

  /**
   * The close expander method
   * @param {button} button - The buttons dom node
   * @return {Object} this
   */
	close(button) {
		const target = this.getTarget(button)
		const _this = this
		
		TweenLite.to(target, 0.2, {
			height:0,
			onStart() {
				_this.trigger('before:close', button, target)
			},
			onComplete() {
				_this.trigger('after:close', button, target)
				button.classList.remove('is-active')
				button.setAttribute('aria-expanded', false)
				button.setAttribute('aria-selected', false)
				target.setAttribute('aria-hidden', true)
			}
		})

		return this
	}

  /**
   * Add accessibility attritubes to dom nodes
   * @return {Object} this
   */
	addAccessibility() {
		this.elements.forEach((button, index) => {
			const target = this.getTarget(button)
			const state = button.classList.contains(this.activeClass)
			button.setAttribute('aria-expanded', state)
			button.setAttribute('aria-selected', state)
			button.setAttribute('aria-controls', `${this.name}-${index}`)
			button.setAttribute('role', 'tab')

			target.setAttribute('aria-hidden', !state)
			target.setAttribute('aria-labelledby', `${this.name}-${index}`)
			target.setAttribute('role', 'tabpanel')
		})

		this.el.setAttribute('role', 'tablist')
		this.el.setAttribute('aria-multiselectable', this.closeOthers)

		return this
	}

}