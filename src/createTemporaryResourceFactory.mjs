function node_cleanupHandler(dependencies, global_vars) {
	const {fs} = dependencies

	while (global_vars.cleanup_items.length) {
		const item = global_vars.cleanup_items.shift()

		try {
			fs.unlinkSync(item)
		} catch {}
	}
}

async function createTemporaryResourceImplementation(
	{environment, dependencies, global_vars}, data, options
) {
	if (environment === "node") {
		const {fs, os, path, crypto, process} = dependencies

		if (!global_vars.cleanupHandler_set) {
			process.on("SIGTERM", () => {
				node_cleanupHandler(dependencies, global_vars)
			})

			process.on("exit", () => {
				node_cleanupHandler(dependencies, global_vars)
			})

			global_vars.cleanupHandler_set = true
		}

		const tmpname = crypto.randomBytes(16).toString("hex")
		let extension = ".txt"

		if (options.type === "text/javascript") {
			extension = ".mjs"
		}

		const tmppath = path.join(os.tmpdir(), tmpname + extension)

		// make sure file is created exclusively and with only
		// owner having write permission
		const fd = fs.openSync(tmppath, "wx+", 0o644)

		fs.writeSync(fd, data)
		fs.closeSync(fd)

		// protect file by setting it to read only
		fs.chmodSync(tmppath, 0o444)

		const location = fs.realpathSync(tmppath)

		if (options.auto_cleanup) {
			global_vars.cleanup_items.push(location)
		}

		return {
			location,
			cleanup() {
				try {
					fs.unlinkSync(location)
				} catch {}
			}
		}
	} else {
		let blob = new Blob([data], {type: options.type})
		const location = URL.createObjectURL(blob)

		return {
			location,
			cleanup() {
				URL.revokeObjectURL(location)
			}
		}
	}
}

async function importDependenciesForEnvironment(environment) {
	if (environment !== "node") return {}

	let node_modules = {}

	const dependencies = ["fs", "os", "path", "crypto", "process"]

	for (const dependency of dependencies) {
		node_modules[dependency] = (await import(`node:${dependency}`)).default
	}

	return node_modules
}

function getInitialStateForEnvironment(environment) {
	if (environment !== "node") return {}

	return {
		cleanupHandler_set: false,
		cleanup_items: []
	}
}

export default function createTemporaryResourceFactory({node = true} = {}) {
	const environment = node ? "node" : "browser"
	const global_data_symbol = Symbol.for(`@anio-js-foundation/create-temporary-resource-factory-${environment}`)

	if (!(global_data_symbol in globalThis)) {
		globalThis[global_data_symbol] = getInitialStateForEnvironment(environment)
	}

	const global_vars = globalThis[global_data_symbol]

	return async (data, {type = "text/plain", auto_cleanup = true} = {}) => {
		const dependencies = await importDependenciesForEnvironment(environment)

		return await createTemporaryResourceImplementation({
			environment, dependencies, global_vars
		}, data, {type, auto_cleanup})
	}
}
