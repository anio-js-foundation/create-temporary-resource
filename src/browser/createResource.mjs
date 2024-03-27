export default function({dependencies, global_vars}, data, options) {
	let blob = new Blob([data], {type: options.type})
	const location = URL.createObjectURL(blob)

	return {
		location,
		cleanup() {
			URL.revokeObjectURL(location)
		}
	}
}
