import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

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
    ),
  );
}
