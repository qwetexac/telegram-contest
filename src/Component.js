export class Component {
	constructor (props) {
		this.props = props;
		this.state = this.getInitialState(props)
		this.render()
		
		setTimeout(() => this.afterRender(), 0)
	}
	
	el = null
	
	setState (newState) {
		this.state = {
			...this.state,
			...newState
		}
		
		return this.state
	}
	
	render () {}
	update () {}
	
	getInitialState () {
		return {}
	}
	
	afterRender () {}
	forceUpdate (newProps) {
		const oldProps = { ...this.props }
		this.props = { ...this.props, ...newProps }
		this.update(oldProps, this.props)
	}
}
