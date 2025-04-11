import container from './infrastructure/container.js'

await container.cradle.server.init()
await container.cradle.server.start()
