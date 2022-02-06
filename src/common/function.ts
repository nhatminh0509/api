/* eslint-disable no-process-env */
import * as dotenv from 'dotenv'
import * as shortid from 'shortid'


export const generateShortId = (): string => {
  return shortid.generate()
}

export const generateSlug = (field = ''): string => {
  return `${field.split(' ').join('-')}-${generateShortId()}`
}

export const checkObjectId = (field = ''): boolean => {
  const checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$")
  return checkForHexRegExp.test(field)
}

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