import { Elysia, t } from 'elysia'

import {
	PostPlainInputCreate,
	PostPlainInputUpdate
} from '@api/generated/prismabox/Post'
import { authMacro, prisma } from '@api/libs'

export const post = new Elysia({ prefix: '/post', tags: ['Post'] })
	.use(authMacro)
	.model({
		pagination: t.Object({
			page: t.Number({
				default: 0
			})
		})
	})
	.get(
		'/',
		({ query: { page } }) =>
			prisma.post.findMany({
				take: 25,
				skip: (page - 1) * 25,
				include: {
					author: {
						select: {
							name: true
						}
					}
				},
				orderBy: {
					createdAt: 'desc'
				}
			}),
		{
			query: 'pagination'
		}
	)
	.put(
		'/',
		({ body, user }) =>
			prisma.post.create({
				data: {
					...body,
					authorId: user.id
				}
			}),
		{
			auth: true,
			body: PostPlainInputCreate
		}
	)
	.patch(
		'/:id',
		({ body, user, params }) =>
			prisma.post.update({
				data: body,
				where: {
					id: params.id,
					authorId: user.id
				}
			}),
		{
			auth: true,
			body: PostPlainInputUpdate,
			params: t.Object({
				id: t.Number()
			})
		}
	)
	.delete(
		'/:id',
		({ user, params }) =>
			prisma.post.delete({
				where: {
					id: params.id,
					authorId: user.id
				}
			}),
		{
			auth: true,
			params: t.Object({
				id: t.Number()
			})
		}
	)
	.get(
		'/own',
		({ query: { page } }) =>
			prisma.post.findMany({
				take: 25,
				skip: (page - 1) * 25,
				orderBy: {
					createdAt: 'desc'
				}
			}),
		{
			auth: true,
			query: 'pagination'
		}
	)
