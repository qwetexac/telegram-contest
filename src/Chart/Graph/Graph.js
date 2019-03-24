import { Component } from 'Component'
import Line from './Line'
import { hasTouch } from 'utils'

const xlms = 'http://www.w3.org/2000/svg'

class ChartGraph extends Component {
	afterRender () {
		if (hasTouch) {
			document.addEventListener('touchend', this.addLineAnimation)
		} else {
			document.addEventListener('mouseup', this.addLineAnimation)
		}
	}
	
	addLineAnimation = () => {
		this.state.lines.forEach(line => {
			line.el.classList.remove('no-animation')
		})
	}
	
	removeLineAnimation = () => {
		this.state.lines.forEach(line => {
			line.el.classList.add('no-animation')
		})
	}
	
	update (oldProps, newProps) {
		if (oldProps.zoom !== newProps.zoom) {
			this.handleZoomChanged()
		} else if (oldProps.offset !== newProps.offset) {
			this.handleOffsetChanged()
		} else {
			this.redraw()
		}
	}
	
	redraw () {
		const { data, maxValue } = this.props
		this.state.lines.map(line => {
			const { name: lineName }  = line.props
			const isInArray = !!data.find(({ name }) => name === lineName)
			
			line.redraw({ maxValue, visible: isInArray })
		})
	}
	
	handleOffsetChanged () {
		const { offset, zoom } = this.props
		
		this.offsetGroup.setAttribute('transform', `translate(${-(offset / zoom)}, 0)`)
	}
	
	handleZoomChanged () {
		const { zoom, offset } = this.props
		
		this.removeLineAnimation()
		
		this.state.lines.forEach(line => {
			line.forceUpdate({ zoom: zoom })
		})
		
		this.offsetGroup.setAttribute('transform', `translate(${-(offset / zoom)}, 0)`)
	}
	
	getInitialState () {
		return { lines: [] }
	}
	
	render () {
		const { zoom, data, height, offsetTop, maxValue, width } = this.props
		
		this.el = document.createElementNS(xlms, 'g')
		
		this.offsetGroup = document
			.createElementNS(xlms, 'g')
			.setAttributes({ transform: `translate(0, 0)` })
		
		this.zoomGroup = document
			.createElementNS(xlms, 'g')
			.setAttributes({
				transform: `matrix(1, 0, 0, 1, 0, ${offsetTop})`,
				class: 'zoom'
			})
		
		this.el.appendChild(document.createElementNS(xlms, 'rect').setAttributes({
			x: 0,
			y: 0,
			width: '100%',
			height: '100%',
			fill: 'transparent'
		}))
		
		this.offsetGroup.appendChild(this.zoomGroup)
		this.el.appendChild(this.offsetGroup)
		
		data.map(({ values, color, name }) => {
			const line = new Line({
				zoom,
				data: values,
				maxValue,
				height,
				color,
				name,
				width
			})
			
			this.state.lines.push(line)
			this.zoomGroup.appendChild(line.el)
		})
	}
}

export default ChartGraph
