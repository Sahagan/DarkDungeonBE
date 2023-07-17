import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RessponseFormat {
  @ApiProperty()
  @IsNotEmpty()
  resultCode: string;
  @ApiProperty()
  @IsNotEmpty()
  developerMessage: string;
}
