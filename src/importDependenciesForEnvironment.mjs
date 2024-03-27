export default async function(environment) {
	if (environment !== "node") return {}

	let node_modules = {}

	const dependencies = ["fs", "os", "path", "crypto", "process"]

	for (const dependency of dependencies) {
		const {default: node_module} = await import(`node:${dependency}`)

		node_modules[dependency] = node_module
	}

	return node_modules
}
