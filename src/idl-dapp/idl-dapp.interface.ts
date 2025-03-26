import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';

export class UploadIdlInput {
  @ApiProperty()
  @IsString()
  @Transform(({ value }) => value.trim())
  programId: string;

  @ApiProperty()
  @IsString()
  @Transform(({ value }) => value.trim())
  version: string;

  @ApiProperty()
  @IsString()
  @Transform(({ value }) => value.trim())
  name: string;

  idlJson: any;
}
