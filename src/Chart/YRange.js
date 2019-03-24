import { Component } from 'Component'
import { YAxisBreakpoints, mainGraphHeight }     from 'settings'

const xlms = 'http://www.w3.org/2000/svg'

class YRange extends Component {
	update (prev) {
		const { maxValue } = this.props
		if (prev.maxValue === maxValue || !isFinite(maxValue)) {
			return
		}
		
		const averageValue = maxValue / (YAxisBreakpoints - 1)
		
		
		this.yAxisValues.map((line, count) => {
			line.setAttributes({ html: Math.round(averageValue * count, 1) })
		})
	}
	
	render () {
		const { maxValue, width } = this.props
		
		this.yAxisValues = []
		
		this.el = document.createElementNS(xlms, 'g')
		this.el.setAttributes({ class: 'group-text' })
		const averageValue = maxValue / (YAxisBreakpoints - 1)
		
		Array(YAxisBreakpoints).fill(1).forEach((_, count) => {
			const lineGrid = document.createElementNS(xlms, 'line')
			const xAxisLabel = document.createElementNS(xlms, 'text')
			const axisYCord = mainGraphHeight - (mainGraphHeight / YAxisBreakpoints * count);
			
			lineGrid.setAttributes({
				x1: 0,
				x2: width,
				y1: axisYCord,
				y2: axisYCord,
				class: 'chart__grid-line',
			})
			
			xAxisLabel.setAttributes({
				html: Math.round(averageValue * count, 1),
				x: 0,
				y: axisYCord - 5,
				class: 'chart__grid-label',
			})
			
			this.yAxisValues.push(xAxisLabel)
			
			this.el.appendChild(lineGrid)
			this.el.appendChild(xAxisLabel)
		})
	}
}

export default YRange
