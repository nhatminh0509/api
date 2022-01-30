import * as shortid from 'shortid'

export const generateShortId = (): string => {
  return shortid.generate()
}

export const generateSlug = (field = ''): string => {
  return `${field.split(' ').join('-')}-${generateShortId()}`
}
