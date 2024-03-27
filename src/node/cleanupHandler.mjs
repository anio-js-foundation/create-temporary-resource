export default function node_cleanupHandler(dependencies, global_vars) {
	const {fs} = dependencies

	while (global_vars.cleanup_items.length) {
		const item = global_vars.cleanup_items.shift()

		try {
			fs.unlinkSync(item)
		} catch {}
	}
}
