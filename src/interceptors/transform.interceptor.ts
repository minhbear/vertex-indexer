import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { instanceToPlain } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from '../common/dtos/common.dto';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const res = context.switchToHttp().getResponse();
    const ignoreTransform = this.reflector.get<boolean>(
      'ignoreTransform',
      context.getHandler(),
    );

    if (ignoreTransform) {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => ({
        statusCode: res.statusCode,
        data: instanceToPlain(data) as T,
      })),
    );
  }
}
