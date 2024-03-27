import cleanupHandler from "./cleanupHandler.mjs"

export default function({dependencies, global_vars}, data, options) {
	const {fs, os, path, crypto, process} = dependencies

	if (!global_vars.cleanupHandler_set) {
		process.on("SIGTERM", () => {
			cleanupHandler(dependencies, global_vars)
		})

		process.on("exit", () => {
			cleanupHandler(dependencies, global_vars)
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
}
