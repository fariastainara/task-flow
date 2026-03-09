import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from "class-validator";

export class ReorderBoardsDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  boardIds: string[];
}
