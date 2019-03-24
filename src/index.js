import 'babel-polyfill'
import 'styles/main.sass'
import Chart from 'Chart'
import SwitchModeButton from 'Chart/SwitchModeButton'
import data from 'data'


Element.prototype.setAttributes = function (attrs) {
	Object.entries(attrs).forEach(([key, value]) => {
		if (key === 'html') {
			this.innerHTML = value
		} else {
			this.setAttributeNS(null, key, value)
		}
	})
	
	return this
}

function init() {
	const documentRoot = document.getElementById('root')
	
	data.map(item => {
		new Chart(documentRoot, item)
	})
	
	const switchModeButton = new SwitchModeButton()
	
	documentRoot.appendChild(switchModeButton.el)
}

init()


