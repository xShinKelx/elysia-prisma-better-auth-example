import { Elysia, t } from 'elysia'
import { openapi, fromTypes } from '@elysiajs/openapi'
import { staticPlugin } from '@elysiajs/static'

import { auth, AuthOpenAPI, instrumentation } from './libs'
import { post } from './modules'

const app = new Elysia()
	.use(
		openapi({
			references: fromTypes(),
			documentation: {
				components: await AuthOpenAPI.components,
				paths: await AuthOpenAPI.getPaths(),
				info: {
					title: 'Elysia Prisma Demo',
					version: '1.0.0',
					description: 'Demo API using Elysia, Prisma, Better Auth'
				},
				tags: [
					{
						name: 'Post',
						description:
							'<img src="/images/maddelena.webp" alt="Maddelena drawing on her tablet" />'
					}
				]
			}
		})
	)
	.use(instrumentation)
	.use(
		await staticPlugin({
			prefix: '/',
			alwaysStatic: true
		})
	)
	.mount('/auth', auth.handler)
	.use(post)
	.listen(3000)

export type app = typeof app

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
