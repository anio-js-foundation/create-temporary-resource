import createTemporaryResource from "./src/index.mjs"

const {location, cleanup} = await createTemporaryResource(
	`console.log("hello")`, "text/javascript"
)

console.log(location)

cleanup()
