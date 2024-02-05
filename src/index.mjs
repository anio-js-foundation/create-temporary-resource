import isNode from "@anio-js-core-foundation/is-node"
import createTemporaryResourceFactory from "@anio-js-core-foundation/create-temporary-resource-factory"

const createTemporaryResource = createTemporaryResourceFactory({
	node: isNode()
})

export default createTemporaryResource
