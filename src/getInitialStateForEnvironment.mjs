export default function(environment) {
	if (environment !== "node") return {}

	return {
		cleanupHandler_set: false,
		cleanup_items: []
	}
}
