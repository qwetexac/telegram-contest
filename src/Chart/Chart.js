import Graph                                                from './Graph'
import Timeline                                             from './Timeline'
import Controls                                             from './Controls'
import Togglers                                             from './Togglers'
import Tooltip                                              from './Tooltip'
import YRange                                               from './YRange'

import { height, YAxisBreakpoints, mainGraphHeight } from 'settings'
import { ceil }                                             from 'utils'
import { Component }                                        from 'Component'

const xlms = 'http://www.w3.org/2000/svg'

const graphOffsetTop = height / YAxisBreakpoints

class Chart extends Component {
	constructor (root, data) {
		super({ root, data })
		this.buildChart()
	}
	
	afterRender () {
		window.addEventListener('resize', this.handleWindowResize)
	}
	
	handleWindowResize = () => {
		const { root } = this.props
		
		const rootWidth = root.offsetWidth
		const styles = window.getComputedStyle(root);
		const padding = parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight);
		
		this.width = rootWidth - padding
		this.svg.setAttributes({
			viewBox: `0 0 ${this.width} ${height}`,
			width: this.width,
			height: height
		})
		
		for (let child of this.children.values()) {
			child.forceUpdate({ width: this.width })
		}
		
	}
	
	getInitialState ({ data, root }) {
		this.el = document.createElement('div').setAttributes({ class: 'chart' })
		
		const rootWidth = root.offsetWidth
		const styles = window.getComputedStyle(root);
		const padding = parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight);
		
		this.width = rootWidth - padding
		this.lines = []
		this.yAxisValues = new Map()
		this.zoom = 0.1
		this.offsetLeft = 0
		this.children = new Map()
		
		this.restructureData()
		
		return {
			checkedLines: this.lines.reduce((acc, { name }) => ({
				...acc,
				[name]: true
			}), {}),
			maxValue: ceil(Math.max(...this.lines.reduce((acc, { values }) => acc.concat(values), [])), 3)
		}
	}
	
	restructureData () {
		const { columns, types, names, colors } = this.props.data;
		
		columns.map(([ label, ...column ]) => {
			switch (types[label]) {
				case 'x':
					this.timeline = this.setDates(column)
					break
				case 'line':
					this.lines.push({
						name: names[label],
						type: 'line',
						color: colors[label],
						values: column
					})
					break
				default:
					break
			}
		})
		
		this.zoom = Math.max(6 / this.timeline.length, 0.2)
	}
	
	setDates (dates) {
		const date = new Date()
		
		return dates.map(timestamp => {
			date.setTime(timestamp)
			return `${date.toLocaleString('en-us', { month: 'short' })} ${date.getDate()}`
		})
	}
	
	buildChart () {
		this.svg = document.createElementNS(xlms, 'svg')
		
		this.svg.setAttributes({
			viewBox: `0 0 ${this.width} ${height}`,
			width: this.width,
			height: height
		})
		
		this.children
			.set('graph', new Graph({
				maxValue: this.state.maxValue,
				zoom: this.zoom,
				data: this.lines,
				dataLength: this.timeline.length,
				offset: this.offsetLeft,
				height: mainGraphHeight - graphOffsetTop,
				width: this.width,
				offsetTop: graphOffsetTop
			}))
			.set('dates', new Timeline({
				zoom: this.zoom,
				data: this.timeline,
				offset: this.offsetLeft,
				width: this.width
			}))
			.set('controls', new Controls({
				data: this.lines,
				dataLength: this.timeline.length,
				onChange: this.handleControlChange,
				zoom: this.zoom,
				width: this.width,
				maxValue: this.state.maxValue
			}))
			.set('togglers', new Togglers({
				data: this.lines,
				onChange: this.handleTogglerChange
			}))
			.set('tooltip', new Tooltip({
				data: this.lines,
				height: mainGraphHeight - graphOffsetTop,
				timeline: this.timeline,
				zoom: this.zoom,
				offset: this.offsetLeft,
				document: this.children.get('graph').el,
				maxValue: this.state.maxValue,
				width: this.width
			}))
			.set('grid', new YRange({
				maxValue: this.state.maxValue,
				width: this.width
			}))
		
		
		this.svg.appendChild(this.children.get('grid').el)
		this.svg.appendChild(this.children.get('graph').el)
		this.svg.appendChild(this.children.get('dates').el)
		this.svg.appendChild(this.children.get('controls').el)
		this.svg.appendChild(this.children.get('tooltip').el)
		
		this.el.appendChild(this.svg)
		this.el.appendChild(this.children.get('togglers').el)
		
		this.props.root.appendChild(this.el)
	}
	
	updateChildren (newProps) {
		this.children.get('dates').forceUpdate(newProps)
		this.children.get('graph').forceUpdate(newProps)
		this.children.get('tooltip').forceUpdate(newProps)
	}
	
	handleControlChange = params => {
		this.updateChildren(params)
	}
	
	handleTogglerChange = ({ name, checked }) => {
		const newCheckedLines = { ...this.state.checkedLines, [name]: checked }
	
		const onlyVisibleLines = this.lines.filter(({ name: itemName }) => newCheckedLines[itemName])
		
		const newMaxValue = ceil(Math.max(...onlyVisibleLines.reduce((acc, { values }) => acc.concat(values), [])), 3)
	
		this.setState({ checkedLines: newCheckedLines, maxValue: newMaxValue })
		
		this.children.get('graph').forceUpdate({ data: onlyVisibleLines, maxValue: newMaxValue })
		this.children.get('controls').forceUpdate({ data: onlyVisibleLines, maxValue: newMaxValue })
		this.children.get('tooltip').forceUpdate({ data: onlyVisibleLines })
		this.children.get('grid').forceUpdate({ maxValue: newMaxValue })
	}
}

export default Chart
