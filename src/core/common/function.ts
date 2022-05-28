/* eslint-disable no-process-env */
import * as dotenv from 'dotenv'
import { PipelineStage, Types } from 'mongoose'
import * as shortid from 'shortid'


export const generateShortId = (): string => {
  return shortid.generate()
}

export const generateSlug = (field = ''): string => {
  return `${field.split(' ').join('-')}-${generateShortId()}`
}

export const generateSlugNonShortId = (field = ''): string => {
  return removeVietnameseTones(`${field.split(' ').join('-')}`, false)
}

export const convertStringToObjectId = (value: string) => {
  return new Types.ObjectId(value)
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

export const removeVietnameseTones = (str: string, removeSpecial = true) => {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); 
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
  str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); 
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
  str = str.replace(/đ/g,"d");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/Đ/g, "D");
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, "");
  str = str.replace(/\u02C6|\u0306|\u031B/g, "");
  str = str.trim();
  if (removeSpecial) {
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
  }
  return str.toLowerCase();
}

// For aggregateWithDeleted
export const overrideMethodsAggregate = () => {
  return {
    $match: { 
      deleted: false 
    } 
  }
}

// Join Model in aggregare
export const joinModel = (from: string, foreignField: string, localField: string, as: string) => {
  return { 
    $lookup: {
      from,
      foreignField,
      localField,
      as
    },
  }
}

// Select Model from Aggregate
export const select = (keysSelect: string[], keysUnselect?: string[]) => {
  const result: any = {
    $project: {}
  }

  keysSelect.map(key => {
    result.$project[key] = 1
  })
  
  keysUnselect?.map(key => {
    result.$project[key] = 0
  })

  return result
}

export const searchTextWithRegexAggregate = (search: string | undefined | null, fields: string[]) => {
  const result: any = {
    $match: {}
  }
  if (search && typeof search === 'string' && fields.length > 0) {
    result.$match.$or = []
    fields.map(field => {
      if (field.includes('subKey')) {
        result.$match.$or.push({
          [field]: {
            $regex: removeVietnameseTones(search), $options: 'i'
          }
        })
      } else {
        result.$match.$or.push({
          [field]: {
            $regex: search, $options: 'i'
          }
        })
      }
    })
  }
  return result
}

export const filterAggregate = (field: string, values: any[] | any, convertToObjectId?: boolean) => {
  const result: any = {
    $match: {}
  }

  if (Array.isArray(values)) {
    let filter
    if (convertToObjectId) {
      filter = values.map(id => checkObjectId(id) ? convertStringToObjectId(id) : null ).filter(item => item !== null)
    } else {
      filter = values
    }
    result.$match[field] = {
      $in: filter
    }
  } else {
    let filter
    if (typeof values === 'string' && values.includes(',')) {
      filter = values.trim().split(' ').join('').split(',')
      console.log(filter)
      return filterAggregate(field, filter, convertToObjectId)
    } else {
      if (convertToObjectId) {
        filter = checkObjectId(values) ? convertStringToObjectId(values) : null
      } else {
        filter = values
      }
      if (filter) {
        result.$match[field] = filter;
      }
    }
  }
  return result
}

export const sortAggregate = (orderBy: string | string[], direction: string | string[]) => {
  if (typeof orderBy === 'string' && typeof direction === 'string') {
    return {
      $sort: {
        [orderBy]: direction === 'asc' ? 1 : -1
      }
    } as any
  } else if (Array.isArray(orderBy) && Array.isArray(direction) && orderBy.length === direction.length) {
    const result = {
      $sort: {}
    }
    orderBy.map((key, index) => {
      result.$sort[key] = direction[index] === 'asc' ? 1 : -1;
    })
    return result
  }
}
