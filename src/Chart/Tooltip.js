import { Component } from 'Component'

const xlms = 'http://www.w3.org/2000/svg'

class ChartTooltip extends Component {
	background = document.createElementNS(xlms, 'rect').setAttributes({
		class: 'tooltip__background',
		rx: 5,
		ry: 5,
	})
	
	date = document.createElementNS(xlms, 'text').setAttributes({
		y: 20,
		class: 'tooltip__date'
	})
	
	getInitialState () {
		return {
			currentX: -1
		}
	}
	
	afterRender () {
		this.props.document.addEventListener('mousemove', this.handleMove)
		this.props.document.addEventListener('mouseleave', this.hide.bind(this))
	}
	
	update () {
		this.calculateData()
		this.hide()
	}
	
	makePointY (value) {
		const { height, maxValue } = this.props
		
		return height + 50 - (value * height / maxValue)
	}
	
	hide () {
		this.el.classList.add('tooltip--hidden')
	}
	
	show () {
		this.el.classList.remove('tooltip--hidden')
	}
	
	handleMove = e => {
		const { zoom, offset } = this.props
		const normalizeX = e.offsetX + (offset / zoom)
		const infoIndex = this.calculatedData.findIndex(({ x }) => x >= normalizeX)
		
		const info = this.calculatedData[infoIndex - 1]
		
		if (!info || info.x === this.state.currentX) {
			return
		}
		
		const { width } = this.props
		this.el.innerHTML = ''
		
		info.data.forEach(({ value, name, color }, i) => {
			
			const offsetLeft = i > 0
				? this.el.lastChild.getBBox().width
				: 0
			
			const group = document.createElementNS(xlms, 'g').setAttributes({
				transform: `translate(${(offsetLeft + 20) * i}, 0)`,
				html: `
						<text
							y="40"
							class="tooltip__item-value"
							fill="${color}"
						>
							${value}
						</text>
						<text
							y="53"
							class="tooltip__item-name"
							fill="${color}"
						>
							${name}
						</text>
					`
			})
			
			this.el.appendChild(group)
		})
		
		this.date.setAttributes({
			x: 0,
			html: info.date
		})
		
		
		this.el.appendChild(this.date)
		
		const computedSize = this.el.getBBox()
		
		this.background.setAttributes({
			x: -10,
			y: 0,
			width: computedSize.width + 20,
			height: computedSize.height + 20
		})
		
		const canvasX = info.x - (offset / zoom)
		const elMaxCoordX = Math.max(
			10,
			Math.min(width - (computedSize.width + 20), canvasX - (computedSize.width / 2))
		)
		
		this.el.setAttributes({
			transform: `translate(${elMaxCoordX}, 0)`
		})
		
		info.data.map(({ y, color }) => {
			const circle = document.createElementNS(xlms, 'circle').setAttributes({
				cx: canvasX - elMaxCoordX,
				cy: y,
				r: 3,
				stroke: color,
				'stroke-width': 2,
				fill: 'white'
			})
			
			this.el.appendChild(circle)
		})
		
		const line = document.createElementNS(xlms, 'line').setAttributes({
			x1: canvasX - elMaxCoordX,
			y1: computedSize.height,
			x2: canvasX - elMaxCoordX,
			y2: this.props.height + 50,
			stroke: 'black',
			opacity: .1,
			'pointer-events': 'none'
		})
		
		this.el.insertBefore(this.background, this.el.firstChild)
		
		this.el.insertBefore(line, this.background)
		
		this.setState({ currentX: info.x })
		
		this.show()
	}
	
	calculateData () {
		const { timeline, data, zoom, width } = this.props
		
		const breakpointX = width / (timeline.length - 1) / zoom
		
		this.calculatedData = timeline.map((date, i) => ({
			date,
			x: breakpointX * i,
			data: data.map(({ name, values, color }) => ({
				name,
				value: values[i],
				color,
				y: this.makePointY(values[i]),
			}))
		}))
	}
	
	render () {
		this.calculateData()
		this.el = document.createElementNS(xlms, 'g')
		this.el.classList.add('tooltip')
	}
}

export default ChartTooltip
