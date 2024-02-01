import isNode from "@anio-js-core-foundation/is-node"

export default async function createTemporaryResource(data, type = "text/plain") {
	if (isNode()) {
		const fs = await import("node:fs")
		const os = await import("node:os")
		const path = await import("node:path")
		const crypto = await import("node:crypto")

		const tmpname = crypto.randomBytes(16).toString("hex")
		let extension = ".txt"

		if (type === "text/javascript") {
			extension = ".mjs"
		}

		const tmppath = path.join(os.tmpdir(), tmpname + extension)

		fs.writeFileSync(tmppath, data)

		return {
			location: fs.realpathSync(tmppath),
			cleanup() {
				try {
					fs.unlinkSync(tmppath)
				} catch { }
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

