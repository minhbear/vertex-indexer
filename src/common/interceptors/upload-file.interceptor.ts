import {
  applyDecorators,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Observable, tap } from 'rxjs';
import * as fs from 'fs';

@Injectable()
class CleanupUploadedFileInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      tap(() => {
        const file = request.file;
        if (file?.path) {
          try {
            fs.unlinkSync(file.path);
            console.log(`🧹 Deleted uploaded file: ${file.path}`);
          } catch (err) {
            console.error(
              `❌ Failed to delete uploaded file: ${file.path}`,
              err,
            );
          }
        }
      }),
    );
  }
}

export function UploadIdlFile(fileFieldName: string) {
  return applyDecorators(
    UseInterceptors(
      FileInterceptor(fileFieldName, {
        storage: diskStorage({
          destination: './uploads',
          filename: (_, file, cb) => {
            cb(null, `${Date.now()}-${file.originalname}`);
          },
        }),
      }),
      new CleanupUploadedFileInterceptor(),
    ),
  );
}
