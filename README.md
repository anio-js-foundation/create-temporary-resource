# @anio-js-core-foundation/create-temporary-resource

Create a temporary resource.

Uses the filesystem in node and Blobs in Browsers.

```js
import createTemporaryResource from "@anio-js-core-foundation/create-temporary-resource"

const {location, cleanup} = await createTemporaryResource(
	`console.log("hello")`, "text/javascript"
)

console.log(location)

// no-op in browser
cleanup()
```
