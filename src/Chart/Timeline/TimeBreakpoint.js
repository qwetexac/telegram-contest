import { Component } from 'Component'

const xlms = 'http://www.w3.org/2000/svg'

class TimeBreakpoint extends Component {
	update () {
		const { x, visible } = this.props
		
		this.el.setAttributes({
			x,
			'fill-opacity': Number(visible)
		})
	}
	
	render () {
		const { x, y, date, visible } = this.props
		
		this.el = document.createElementNS(xlms, 'text')
		
		this.el.setAttributes({
			x,
			y,
			html: date,
			'fill-opacity': Number(visible)
		})
	}
}

export default TimeBreakpoint
