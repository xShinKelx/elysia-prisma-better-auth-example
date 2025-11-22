import { useState } from 'react'
import { createRoot } from 'react-dom/client'

import { api } from '@public/libs/api'
import { useQuery } from '@tanstack/react-query'
import { Provider } from './provider'

function App() {
	const {
		data: response,
		error,
		isLoading
	} = useQuery({
		queryKey: ['count'],
		queryFn: () =>
			api.post.get({
				query: {
					page: 1
				}
			})
	})

	if (isLoading)
		return (
			<article className="flex flex-col gap-2 text-neutral-500 p-3 w-full min-h-28 bg-white rounded-lg shadow-sm" />
		)

	if (error) return <main>Error: {(error as Error).message}</main>

	if (!response) return <main>Something went wrong</main>

	if (response.error)
		return <main>API Error: {response.error.value.message}</main>

	return response.data.map(({ id, title, content, author }) => (
		<article
			key={id}
			className="flex flex-col gap-2 text-neutral-500 p-3 bg-white rounded-lg shadow-sm"
		>
			<h2 className="text-xl font-medium text-black dark:text-white">
				{title}
			</h2>
			<p>{content}</p>
			<small className="font-light text-xs">- {author.name}</small>
		</article>
	))
}

const root = createRoot(document.getElementById('root')!)
root.render(
	<Provider>
		<main className="flex flex-col max-w-sm mx-auto gap-2 py-4">
			<img
				src="/images/maddelena.webp"
				alt="Maddelena drawing on her tablet"
				className="aspect-square h-24 mx-auto mb-4"
			/>

			<a
				className="text-xs hover:underline text-gray-400 text-right"
				href="/openapi"
			>
				Control Panel →
			</a>
			<App />
		</main>
	</Provider>
)
