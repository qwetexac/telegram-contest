import { Component } from 'Component'

class ChartTogglersItem extends Component {
	afterRender () {
		this.checkbox.addEventListener('change', this.handleCheckboxChange)
	}
	
	handleCheckboxChange = ({ target }) => {
		this.props.onChange({
			checked: target.checked,
			name: this.props.name,
		})
	}
	
	render () {
		const { name, color } = this.props
		
		this.el = document.createElement('label')
		
		const html = `
			<input type="checkbox" class="chart-toggler__item-checkbox" checked>
			<div class="chart-toggler__item-label">
				<span class="night-mode-color--invert">${name}</span>
			</div>
		`
		
		this.el.setAttributes({
			html,
			class: 'chart-toggler__item',
		})
		
		this.el.style.color = color
		
		const [ checkbox ] = this.el.getElementsByTagName('input')
		this.checkbox = checkbox
	}
}

export default ChartTogglersItem
