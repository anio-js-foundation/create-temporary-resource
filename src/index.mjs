import isNode from "@anio-js-core-foundation/is-node"

let node_global_vars = {
	cleanupHandler_set: false,
	cleanup_items: [],
	node_modules: {
		fs: null
	}
}

function node_cleanupHandler() {
	const {fs} = node_global_vars.node_modules

	while (node_global_vars.cleanup_items.length) {
		const item = node_global_vars.cleanup_items.shift()

		try {
			fs.unlinkSync(item)
		} catch {}
	}
}

export default async function createTemporaryResource(
	data, {type = "text/plain", auto_cleanup = true} = {}
) {
	if (isNode()) {
		const {default: fs} = await import("node:fs")
		const {default: os} = await import("node:os")
		const {default: path} = await import("node:path")
		const {default: crypto} = await import("node:crypto")
		const {default: process} = await import("node:process")

		if (!node_global_vars.cleanupHandler_set) {
			node_global_vars.node_modules.fs = fs

			process.on("SIGTERM", node_cleanupHandler)
			process.on("exit", node_cleanupHandler)

			node_global_vars.cleanupHandler_set = true
		}

		const tmpname = crypto.randomBytes(16).toString("hex")
		let extension = ".txt"

		if (type === "text/javascript") {
			extension = ".mjs"
		}

		const tmppath = path.join(os.tmpdir(), tmpname + extension)

		fs.writeFileSync(tmppath, data)

		const location = fs.realpathSync(tmppath)

		if (auto_cleanup) {
			node_global_vars.cleanup_items.push(location)
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
		let blob = new Blob([data], {type})
		const location = URL.createObjectURL(blob)

		return {
			location,
			cleanup() {
				URL.revokeObjectURL(location)
			}
		}
	}
}
