import isNode from "@anio-js-foundation/is-node"

export default function() {
	return isNode() ? "node" : "browser"
}
