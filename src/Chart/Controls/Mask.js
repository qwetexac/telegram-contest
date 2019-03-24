import { Component } from 'Component'

const xlms = 'http://www.w3.org/2000/svg'

const border = 4

class ChartControlsMask extends Component {
	update () {
		const { offset, rectWidth } = this.props

		this.rectMask.setAttributes({
			x: offset + border,
			width: rectWidth - (border * 2)
		})
	}
	
	render () {
		const { offset, rectWidth, id, width } = this.props

		this.el = document.createElementNS(xlms, 'defs')
		document.createElementNS(xlms, 'defs')
		const mask = document.createElementNS(xlms, 'mask')
		mask.setAttribute('id', id)
		this.rectMask = document
			.createElementNS(xlms, 'rect')
			.setAttributes({
				x: offset + border,
				y: 2,
				width: rectWidth - (border * 2),
				height: 26,
				fill: 'black'
			})
		
		const maskFill = document
			.createElementNS(xlms, 'rect')
			.setAttributes({
				x: 0,
				y: 0,
				width,
				height: 30,
				fill: 'white'
			})
		
		mask.appendChild(maskFill)
		mask.appendChild(this.rectMask)
		this.el.appendChild(mask)
	}
}

export default ChartControlsMask
