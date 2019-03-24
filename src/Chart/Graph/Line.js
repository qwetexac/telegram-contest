import { Component } from 'Component'

const xlms = 'http://www.w3.org/2000/svg'

class Line extends Component {
	makePointY (value) {
		const { height, maxValue } = this.props
		// console.log(maxValue)
		// if (this.yAxisValues.has(value)) {
		// 	return this.yAxisValues.get(value)
		// }
		
		return height - (value * height / maxValue) // TODO погрешность
	}
	
	redraw ({ visible, maxValue }) {
		const isVisible = !this.el.classList.contains('invisible')
		
		if (isVisible !== visible) {
			this.el.classList.toggle('invisible')
		}
		
		if (maxValue) {
			this.props.maxValue = maxValue
			this.el.setAttribute('d', this.setPath())
		}
	}
	
	setPath () {
		const { zoom, data, width } = this.props
		const breakPointsLength = data.length - 1
		const breakpointX = width / breakPointsLength / zoom
		
		const [ start, ...breakpoints ] = data
		let pathWay = `M0 ${this.makePointY(start)}`
		breakpoints.forEach((value, i) => {
			pathWay += ` L${(i + 1) * breakpointX} ${this.makePointY(value)}`
		})
		
		return pathWay
	}
	
	update () {
		this.el.setAttribute('d', this.setPath())
	}
	
	render () {
		const { color } = this.props
		
		this.el = document.createElementNS(xlms, 'path')
		
		this.el.setAttributes({
			d: this.setPath(),
			stroke: color,
			fill: 'transparent',
			'stroke-width': 2,
			'shape-rendering': 'geometricPrecision',
		})
	}
}

export default Line
