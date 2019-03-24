import { Component } from 'Component'

class SwitchModeButton extends Component {
	afterRender () {
		this.el.addEventListener('click', this.handleButtonClick)
	}
	
	getInitialState () {
		return {
			isNightMode: false
		}
	}
	
	update () {
		const { isNightMode } = this.state
		this.el.innerHTML = isNightMode ? 'Switch to Day Mode' : 'Switch to Night Mode'
	}
	
	handleButtonClick = () => {
		document.getElementById('root').classList.toggle('night-mode')
		this.setState({ isNightMode: !this.state.isNightMode })
		this.update()
	}
	
	render () {
		this.el = document.createElement('div').setAttributes({
			class: 'switch-mode-button',
			html: 'Switch to Night Mode'
		})
	}
}

export default SwitchModeButton
