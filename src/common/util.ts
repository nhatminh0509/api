/* eslint-disable no-process-env */
import * as dotenv from 'dotenv'

export const loadEnv = (nodeEnv = 'development'): NodeJS.ProcessEnv => {
  let env = {}
  const envFiles = [
    `.env.${nodeEnv}.local`,
    `.env.${nodeEnv}`,
    '.env.local',
    '.env',
  ]

  envFiles.forEach((file) => {
    env = {
      ...dotenv.config({ path: file }).parsed,
      ...env,
    }
  })

  return process.env
}