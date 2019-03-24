export const ceil = (value, exp) => {
	const numberLength = value.toString().length - 1 + (2 - exp)
	
	value = value / (10 ** numberLength)
	
	return Math.ceil(value) * (10 ** numberLength)
}

export const generateId = prefix => {
	const random = Math.random().toString(36).substring(7)
	return `${prefix}_${random}`
}

export const getEvent = e => e.touches ? e.touches[0] : e

export let hasTouch

try {
	document.createEvent("TouchEvent")
	hasTouch = true
} catch {
	hasTouch = false
}
