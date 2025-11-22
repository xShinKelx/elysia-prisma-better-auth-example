import { treaty } from '@elysiajs/eden'
import type { app } from '@api'

export const api = treaty<app>('localhost:3000')
