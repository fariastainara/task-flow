import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateProfileDto {
  @IsString()
  @IsNotEmpty({ message: "Nome é obrigatório" })
  name: string;

  @IsEmail({}, { message: "E-mail inválido" })
  email: string;

  @IsOptional()
  @IsString()
  avatar?: string;
}
