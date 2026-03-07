import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
  @IsEmail({}, { message: "E-mail inválido" })
  email: string;

  @IsString()
  @IsNotEmpty({ message: "Senha é obrigatória" })
  password: string;
}
