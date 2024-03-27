import getEnvironment from "./getEnvironment.mjs"
import importDependenciesForEnvironment from "./importDependenciesForEnvironment.mjs"
import getGlobalDataObjectForEnvironment from "./getGlobalDataObjectForEnvironment.mjs"
import node_createResource from "./node/createResource.mjs"

const environment = getEnvironment()
const global_vars = getGlobalDataObjectForEnvironment(environment)
const dependencies = await importDependenciesForEnvironment(environment)
const createResource = environment === "node" ? node_createResource : () => {}

export default function createTemporaryResource(data, {type = "text/plain", auto_cleanup = true} = {}) {
	return createResource({dependencies, global_vars}, data, {
		type,
		auto_cleanup
	})
}
