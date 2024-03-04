import isNode from "@anio-js-foundation/is-node"
import createTemporaryResourceFactory from "./createTemporaryResourceFactory.mjs"

const createTemporaryResource = createTemporaryResourceFactory({
	node: isNode()
})

export default createTemporaryResource
