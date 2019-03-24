import { Component } from 'Component'
import TimeBreakpoint from './TimeBreakpoint'

const xlms = 'http://www.w3.org/2000/svg'

const edgePointY = 230
const maxDates = 5

class Timeline extends Component {
	getInitialState ({ data }) {
		return {
			values: data.filter((_, i) => i % 6 === 0 && i !== data.length - 1)
		}
	}
	
	update (prevProps, newProps) {
		
		if (prevProps.zoom !== newProps.zoom) {
			this.handleZoomChanged()
		} else if (prevProps.offset !== newProps.offset) {
			this.handleOffsetChanged()
		}
	}
	
	handleZoomChanged () {
		const { data, zoom, width } = this.props
		const { baseImmutableIndex: base } = this.state
		const maxBreakpointX = width / maxDates
		const factBreakpointX = width / (data.length) / zoom
		
		const targetIndex = Math.ceil(maxBreakpointX / factBreakpointX) + 1;
		const shouldChangeVisibility = (Math.max(targetIndex, base) / Math.min(targetIndex, base) % 2) === 0;
		
		const newImmutableIndex = shouldChangeVisibility
			? targetIndex
			: base * Math.floor(targetIndex / base)
		
		this.dates.forEach((date, i) => {
			date.forceUpdate({
				visible: i % newImmutableIndex === 0,
				x: factBreakpointX * i
			})
		})
		
		this.handleOffsetChanged()
	}
	
	handleOffsetChanged () {
		const { offset, zoom } = this.props
		
		this.el.setAttributes({
			transform: `matrix(1, 0, 0, 1, ${-(offset / zoom)}, 0)`
		})
	}
	
	render () {
		const { zoom, offset, data, width } = this.props
		
		this.el = document.createElementNS(xlms, 'g')
		this.el.setAttributes({ class: 'group-text' })
		this.dates = []
		
		const maxBreakpointX = width / maxDates
		const factBreakpointX = width / data.length / zoom
		const ratio = maxBreakpointX / factBreakpointX
		const baseImmutableIndex = Math.floor(ratio)
		
		this.setState({ baseImmutableIndex })
		
		data.forEach((date, i) => {
				const text = new TimeBreakpoint({
					visible: i % baseImmutableIndex === 0,
					x: factBreakpointX * i,
					y: edgePointY,
					date
				})
				this.dates.push(text)
				
				this.el.appendChild(text.el)
			})
		
		this.el.setAttributes({
			transform: `matrix(1, 0, 0, 1, ${-(offset / zoom)}, 0)`
		})
	}
}

export default Timeline
