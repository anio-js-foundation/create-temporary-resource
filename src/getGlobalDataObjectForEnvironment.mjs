import getInitialStateForEnvironment from "./getInitialStateForEnvironment.mjs"

export default function(environment) {
	const global_data_symbol = Symbol.for(`@anio-js-foundation/create-temporary-resource-factory-${environment}`)

	if (!(global_data_symbol in globalThis)) {
		globalThis[global_data_symbol] = getInitialStateForEnvironment(environment)
	}

	return globalThis[global_data_symbol]
}
