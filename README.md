# @anio-js-foundation/create-temporary-resource

Create a temporary resource.

Uses the filesystem in node and Blobs in Browsers.

```js
import createTemporaryResource from "@anio-js-foundation/create-temporary-resource"

const {location, cleanup} = await createTemporaryResource(
	`console.log("hello")`, {type: "text/javascript"}
)

console.log(location)

cleanup()
```
