import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber,IsString} from 'class-validator';
import { Expose, Type } from 'class-transformer';

export class CreatePlayerDto{
    
}
export class BodyPlayerDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    playerName: string
}

export class paramStageDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    stage: string
}