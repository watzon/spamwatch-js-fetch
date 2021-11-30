# spamwatch-all

JavaScript Spamwatch client for browsers, Deno and Node.js with a single code
base.

# Use with Deno

```ts
import { Client } from "./src/mod.ts";

const client = new Client(YOUR_TOKEN, "https://api.spamwat.ch");

const version = await client.getVersion();
console.log(version);
```

# Use with Node.js

```ts
const { Client } = require("dist/mod.js");

const client = new Client(YOUR_TOKEN, "https://api.spamwat.ch");

(async () => {
  const version = await spamwatch.getVersion();
  console.log(version);
})();
```

# Use with browsers

## Method 1: Traditionally

1. Run `deno2node`:

```bash
npm run prepublishOnly
```

2. Run Webpack:

```bash
npm run webpack
```

3. Use in your traditional code.

```html
<script src="out/spamwatch.js"></script>
<script>
	const client = new spamwatch.Client(YOUR_TOKEN, "https://api.spamwat.ch");

	(async () => {
		const version = await client.getVersion();
		console.log(version);
	})();
</script>
```

## Method 2: Modernly

1. Run `deno bundle`:

```bash
deno bundle src/mod.ts spamwatch.js
```

2. Use in your modern code.

```html
<script type="module">
	import { Client } from "./spamwatch.js";

	const client = new Client(YOUR_TOKEN, "https://api.spamwat.ch");

	const version = await client.getVersion();
	console.log(version);
</script>;
```
