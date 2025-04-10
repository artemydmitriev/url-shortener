import { z } from 'zod'
import crypto from 'node:crypto'

const LogLevelSchema = z
  .union([z.literal('debug'), z.literal('info'), z.literal('warn'), z.literal('error')])
  .default('debug')

const NodeEnvSchema = z
  .union([z.literal('development'), z.literal('production'), z.literal('test')])
  .default('development')

const ConfigSchema = z
  .object({
    NODE_ENV: NodeEnvSchema,
    ADDRESS: z.string().optional().default('localhost:3001'),
    DATABASE_URL: z.string().nonempty(),
    LOG_LEVEL: LogLevelSchema,
    CORS_ORIGIN: z.string().optional().default('http://localhost:3000'),
    SESSION_SECRET: z.string().min(32).default(crypto.randomBytes(32).toString('hex')), // shortcut for dev
  })
  .transform((data) => ({
    ...data,
    HOST: data.ADDRESS.split(':')[0],
    PORT: parseInt(data.ADDRESS.split(':')[1], 10),
  }))

export type Config = z.infer<typeof ConfigSchema>
export const config: Config = ConfigSchema.parse(process.env)
