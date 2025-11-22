// @see https://elysiajs.com/integrations/better-auth
import { Elysia } from 'elysia'

import { redis } from 'bun'

import { betterAuth } from 'better-auth'
import { openAPI } from 'better-auth/plugins'
import { prismaAdapter } from 'better-auth/adapters/prisma'

import { prisma } from './prisma'

export const auth = betterAuth({
	basePath: '/api',
	secondaryStorage: {
		get: async (key) => await redis.get(key),
		set: async (key, value, ttl) =>
			await (ttl
				? redis.set(key, value, 'EX', ttl)
				: redis.set(key, value)),
		delete: async (key) => void (await redis.del(key))
	},
	database: prismaAdapter(prisma, {
		provider: 'postgresql'
	}),
	emailAndPassword: {
		enabled: true
	},
	advanced: {
		database: {
			generateId: () => Bun.randomUUIDv7()
		}
	},
	experimental: {
		joins: true
	},
	plugins: [openAPI()]
})

let _schema: ReturnType<typeof auth.api.generateOpenAPISchema>
const getSchema = async () => (_schema ??= auth.api.generateOpenAPISchema())

export const AuthOpenAPI = {
	getPaths: (prefix = '/auth/api') =>
		getSchema().then(({ paths }) => {
			const reference: typeof paths = Object.create(null)

			for (const path of Object.keys(paths)) {
				const key = prefix + path
				reference[key] = paths[path]

				for (const method of Object.keys(paths[path])) {
					const operation = (reference[key] as any)[method]

					operation.tags = ['Better Auth']
				}
			}

			return reference
		}) as Promise<any>,
	components: getSchema().then(({ components }) => components) as Promise<any>
} as const

export const authMacro = new Elysia({ name: 'better-auth' })
	.mount(auth.handler)
	.macro({
		auth: {
			resolve: async function session({ status, request: { headers } }) {
				const session = await auth.api.getSession({
					headers
				})

				if (!session) return status(401)

				return {
					user: session.user,
					session: session.session
				}
			}
		}
	})
