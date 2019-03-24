import { Component } from 'Component'

import Graph from 'Chart/Graph'
import Mask from './Mask'

import { generateId, getEvent, hasTouch } from 'utils'

const xlms = 'http://www.w3.org/2000/svg'


class Controls extends Component {
	getInitialState (props) {
		return {
			isDragging: false,
			offsetDragStart: 0,
			rectWidth: props.zoom * this.props.width,
			rectMinWidth: props.zoom * this.props.width,
			rectOffset: 0,
		}
	}
	
	afterRender () {
		if (hasTouch) {
			this.rect.addEventListener('touchstart', this.handleMouseDown, { passive: true })
		} else {
			this.rect.addEventListener('mousedown', this.handleMouseDown)
		}
	}
	
	update () {
		this.graph.forceUpdate({ data: this.props.data, maxValue: this.props.maxValue })
	}
	
	handleMouseDown = event => {
		const e = getEvent(event)
		
		this.setState({
			isDragging: true,
			offsetDragStart: e.clientX,
			rectOffset: +this.rect.getAttribute('x'),
			rectWidth: +this.rect.getAttribute('width')
		})
		
		const { left, right } = this.rect.getBoundingClientRect()
		
		if (right - e.clientX < 20) {
			if (hasTouch) {
				document.addEventListener('touchmove', this.handleZoomRight, { passive: true })
			} else {
				document.addEventListener('mousemove', this.handleZoomRight)
			}
		} else if (e.clientX - left < 20) {
			if (hasTouch) {
				document.addEventListener('touchmove', this.handleZoomLeft, { passive: true })
			} else {
				document.addEventListener('mousemove', this.handleZoomLeft)
			}
		} else {
			if (hasTouch) {
				document.addEventListener('touchmove', this.handleDrag, { passive: true })
			} else {
				document.addEventListener('mousemove', this.handleDrag)
			}
		}
		
		if (hasTouch) {
			document.addEventListener('touchend', this.handleMouseUp, { passive: true })
		} else {
			document.addEventListener('mouseup', this.handleMouseUp)
		}
	}
	
	handleMouseUp = () => {
		this.setState({ isDragging: false })
		
		if (hasTouch) {
			document.removeEventListener('touchend', this.handleMouseUp)
			document.removeEventListener('touchmove', this.handleDrag)
			document.removeEventListener('touchmove', this.handleZoomLeft)
			document.removeEventListener('touchmove', this.handleZoomRight)
		} else {
			document.removeEventListener('mouseup', this.handleMouseUp)
			document.removeEventListener('mousemove', this.handleDrag)
			document.removeEventListener('mousemove', this.handleZoomLeft)
			document.removeEventListener('mousemove', this.handleZoomRight)
		}
	}
	
	handleDrag = event => {
		const e = getEvent(event)
		const { rectOffset, offsetDragStart, rectWidth } = this.state
		
		const newPosition = Math.max(
			0,
			Math.min(
				rectOffset + e.clientX - offsetDragStart,
				this.props.width - rectWidth
			)
		)
		
		this.rect.setAttribute('x', newPosition)
		this.rectBorderLeft.setAttribute('x', newPosition)
		this.rectBorderRight.setAttribute('x', newPosition + rectWidth - 4)
		
		
		this.props.onChange({ offset: newPosition })
		this.mask.forceUpdate({ offset: newPosition })
	}
	
	handleZoomLeft = event => {
		const e = getEvent(event)
		const { rectOffset, rectMinWidth, offsetDragStart, rectWidth } = this.state
		const newPosition = Math.max(
			0,
			Math.min(
				rectOffset + e.clientX - offsetDragStart,
				this.props.width - rectMinWidth
			)
		)
		
		const newWidth = Math.max(
			rectMinWidth,
			rectWidth + rectOffset - newPosition
		)
		
		if (newWidth > rectMinWidth) {
			this.rect.setAttribute('x', newPosition)
			this.rect.setAttribute('width', newWidth)
			this.rectBorderLeft.setAttribute('x', newPosition)
			
			this.props.onChange({
				zoom: newWidth / rectMinWidth * this.props.zoom,
				offset: newPosition
			})
			
			this.mask.forceUpdate({ offset: newPosition, rectWidth: newWidth })
		}
	}
	
	handleZoomRight = event => {
		const e = getEvent(event)
		const { rectOffset, rectMinWidth, offsetDragStart, rectWidth } = this.state
		const newWidth = Math.max(
			rectMinWidth,
			Math.min(
				rectWidth + e.clientX - offsetDragStart,
				this.props.width - rectOffset
			)
		)
		
		this.rect.setAttribute('width', newWidth)
		this.rectBorderRight.setAttribute('x', newWidth + rectOffset - 4)
		this.props.onChange({ zoom: newWidth / rectMinWidth * this.props.zoom })
		this.mask.forceUpdate({ rectWidth: newWidth })
	}
	
	render () {
		this.el = document.createElementNS(xlms, 'g')
		const height = 30
		
		const { data, width, maxValue } = this.props
		
		this.graph = new Graph({
			width,
			height: height - 3,
			data,
			zoom: 1,
			offset: 0,
			offsetTop: 3,
			maxValue
		})
		
		this.rect = document.createElementNS(xlms, 'rect')
		
		const controlsGroup = document.createElementNS(xlms, 'g')
		const maskId = generateId('mask')
		
		this.mask = new Mask({
			offset: 0,
			rectWidth: this.state.rectWidth,
			id: maskId,
			width,
		})
		
		this.rect.setAttributes({
			x: 0,
			y: 0,
			width: this.state.rectWidth,
			height: height,
			fill: 'transparent',
			stroke: '#deeaf4',
			'stroke-opacity': 0.7
		})
		
		this.rectBorderLeft = document.createElementNS(xlms, 'rect').setAttributes({
			x: 0,
			y: 0,
			width: 4,
			height: height,
			fill: '#deeaf4',
			'fill-opacity': 0.7
		})

		this.rectBorderRight = document.createElementNS(xlms, 'rect').setAttributes({
			x: this.state.rectWidth - 4,
			y: 0,
			width: 4,
			height: height,
			fill: '#deeaf4',
			'fill-opacity': 0.7
		})

		const mask = document.createElementNS(xlms, 'rect').setAttributes({
			x: 0,
			y: 0,
			width,
			height,
			fill: '#f5fafd',
			class: 'night-mode__chart-mask',
			opacity: 0.7
		})
		
		this.el.setAttributes({ transform: `translate(0, 250)` })
		
		this.el.appendChild(this.graph.el)
		this.el.appendChild(mask.setAttributes({ 'mask': `url(#${maskId})` }))
		this.el.appendChild(this.rectBorderLeft)
		this.el.appendChild(this.rectBorderRight)
		this.el.appendChild(this.rect)
		this.el.appendChild(this.mask.el)
	}
}

export default Controls
