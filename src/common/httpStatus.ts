import { HttpException, HttpStatus } from "@nestjs/common";

const HTTP_STATUS = {
  BAD_REQUEST: (message = null) => {
    return new HttpException({
      status: HttpStatus.BAD_REQUEST,
      error: message ? message : 'Bad request'
    }, HttpStatus.BAD_REQUEST)
  },
  NOT_FOUND: (message = null) => {
    return new HttpException({
      status: HttpStatus.NOT_FOUND,
      error: message ? message : 'Not found'
    }, HttpStatus.NOT_FOUND)
  },
  SUCCESS: (message = null) => {
    return {
      statusCode: 200,
      message: message ? message : 'Success'
    }
  }
}

export default HTTP_STATUS;
