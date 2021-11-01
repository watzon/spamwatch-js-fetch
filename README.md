# SpamWatch API TypeScript Client

This is a TypeScript client for [the SpamWatch API](https://docs.spamwat.ch) written using Deno and converted to a node-friendly version using [deno2node](https://github.com/wojpawlik/deno2node). This is a heavily modified version of [spamwatch-js-fetch](https://github.com/Crashdoom/spamwatch-js-fetch) which has full API support and supports both the Node and Deno ecosystems. Big thanks to [Crashdoom](https://github.com/Crashdoom) for the original code.

# Usage (Deno)

```ts
import { Client } from 'https://deno.land/x/spamwatch@1.0.0/src/index.ts'

const spamwatch = new Client(YOUR_TOKEN, 'https://api.spamwat.ch')
const version = await spamwatch.getVersion()
console.log(version)
```

# Usage (Node)

```sh
npm install spamwatch-ts
```

```ts
const { Client } = require('spamwatch-ts')

(async () => {
	const spamwatch = new Client(YOUR_TOKEN, 'https://api.spamwat.ch')
	const version = await spamwatch.getVersion()
	console.log(version)
})()
```

