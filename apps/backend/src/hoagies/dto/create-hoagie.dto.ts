import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateHoagieDto {
  @IsString()
  name: string;

  @IsArray()
  @IsString({ each: true })
  ingredients: string[];

  @IsOptional()
  @IsString()
  image?: string;
}
