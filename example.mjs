import createTemporaryResource from "./src/index.mjs"

const {location, cleanup} = await createTemporaryResource(
	`console.log("hello")`, {type: "text/javascript"}
)

console.log(location)

cleanup()
