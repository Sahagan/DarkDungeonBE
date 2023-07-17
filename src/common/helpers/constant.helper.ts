import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { logAppHelper, detailHelper, summaryHelper } from './logger.helper';

//this decorator helper will use to create custom decorator that work with validate dto
export const headers = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.headers;
  },
);