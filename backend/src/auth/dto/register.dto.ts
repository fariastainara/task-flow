import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
} from "class-validator";

export class RegisterDto {
  @IsString()
  @IsNotEmpty({ message: "Nome é obrigatório" })
  name: string;

  @IsEmail({}, { message: "E-mail inválido" })
  email: string;

  @IsString()
  @MinLength(6, { message: "Senha deve ter pelo menos 6 caracteres" })
  password: string;

  @IsOptional()
  @IsString()
  avatar?: string;
}
