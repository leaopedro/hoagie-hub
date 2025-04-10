import { IsMongoId, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsMongoId()
  hoagieId: string;

  @IsString()
  text: string;
}
