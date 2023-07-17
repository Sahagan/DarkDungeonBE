import { HttpException, HttpStatus } from '@nestjs/common';

export class SuccessException extends HttpException { 
  constructor() {
    super(
      {
        resultCode: '20000',
        developerMessage: 'Success',
      },
      HttpStatus.OK,
    );
  }
}
export class ValidateFailedException extends HttpException {
  constructor() {
    super(
      {
        resultCode: '40000',
        developerMessage: 'Validation failed',
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}
export class TokenExpiredException extends HttpException {
  constructor() {
    super(
      {
        resultCode: '40003',
        developerMessage: 'X-Sgl-Id Token Expired',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
export class PermissionDeniedException extends HttpException {
  constructor() {
    super(
      {
        resultCode: '40101',
        developerMessage: 'Permission Denied',
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}
export class unauthorizedException extends HttpException {
  constructor() {
    super(
      {
        resultCode: '40102',
        developerMessage: 'Unauthorized User',
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}
export class InvalidHeaderException extends HttpException {
  constructor() {
    super(
      {
        resultCode: '40104',
        developerMessage: 'Invalid Header',
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}
export class MissingParameterException extends HttpException {
  constructor() {
    super(
      {
        resultCode: '40300',
        developerMessage: 'Missing or invalid parameter',
      },
      HttpStatus.FORBIDDEN,
    );
  }
}
export class DataExistsException extends HttpException {
  constructor() {
    super(
      {
        resultCode: '40301',
        developerMessage: 'Data existed',
      },
      HttpStatus.FORBIDDEN,
    );
  }
}

export class UrlNotFoundException extends HttpException {
  constructor() {
    super(
      {
        resultCode: '40400',
        developerMessage: 'Unknown URL',
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
export class DataNotFoundException extends HttpException {
  constructor() {
    super(
      {
        resultCode: '40401',
        developerMessage: 'Data not found',
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
export class UnknownServiceException extends HttpException {
  constructor() {
    super(
      {
        resultCode: '40402',
        developerMessage: 'Unknown Service',
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
export class MethodNotAllowedException extends HttpException {
  constructor() {
    super(
      {
        resultCode: '40500',
        developerMessage: 'Method not allowed',
      },
      HttpStatus.METHOD_NOT_ALLOWED,
    );
  }
}
export class ExpectaionFailedException extends HttpException {
  constructor() {
    super(
      {
        resultCode: '41700',
        developerMessage: 'Expectation Failed',
      },
      HttpStatus.EXPECTATION_FAILED,
    );
  }
}
export class SystemErrorException extends HttpException {
  constructor() {
    super(
      {
        resultCode: '50000',
        developerMessage: 'System Error',
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
export class DatabaseErrorException extends HttpException {
  constructor() {
    super(
      {
        resultCode: '50001',
        developerMessage: 'DB Error',
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
export class ConnectionTimeoutException extends HttpException {
  constructor() {
    super(
      {
        resultCode: '50002',
        developerMessage: 'Connection timeout',
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
export class ConnectionErrorException extends HttpException {
  constructor() {
    super(
      {
        resultCode: '50003',
        developerMessage: 'Connection error',
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
export class UnknownErrorException extends HttpException {
  constructor() {
    super(
      {
        resultCode: '50060',
        developerMessage: 'Unknown Error',
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}