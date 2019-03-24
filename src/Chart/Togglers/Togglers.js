import { Component } from 'Component'
import Item from './Item'

class ChartTogglers extends Component {
	render () {
		const { data, onChange } = this.props
		
		this.el = document.createElement('div')
		this.el.classList.add('chart-toggler')
		
		data.map(({ name, color }) => {
			const toggler = new Item({
				name,
				color,
				onChange
			})
			
			this.el.appendChild(toggler.el)
		})
	}
}

export default ChartTogglers
