import createTemporaryResource from "./index.mjs"

const {location, cleanup} = await createTemporaryResource(
	`console.log("hello")`, "text/javascript"
)

console.log(location)

// no-op in browser
cleanup()