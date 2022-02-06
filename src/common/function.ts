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