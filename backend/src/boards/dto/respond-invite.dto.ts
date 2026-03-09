import { IsBoolean, IsNotEmpty, IsUUID } from "class-validator";

export class RespondInviteDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsBoolean()
  accept: boolean;
}
