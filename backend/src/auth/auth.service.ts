import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  Inject,
} from "@nestjs/common";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_CLIENT } from "../supabase/supabase.module";
import { randomUUID } from "crypto";

@Injectable()
export class AuthService {
  constructor(
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
  ) {}

  async login(loginDto: LoginDto) {
    const { data: user, error } = await this.supabase
      .from("users")
      .select("id, name, email, avatar, password")
      .eq("email", loginDto.email)
      .single();

    if (error || !user || user.password !== loginDto.password) {
      throw new UnauthorizedException("E-mail ou senha inválidos");
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
      token: randomUUID(),
    };
  }

  async register(registerDto: RegisterDto) {
    const { data: existing } = await this.supabase
      .from("users")
      .select("id")
      .eq("email", registerDto.email)
      .single();

    if (existing) {
      throw new ConflictException("E-mail já cadastrado");
    }

    const { data: newUser, error } = await this.supabase
      .from("users")
      .insert({
        name: registerDto.name,
        email: registerDto.email,
        password: registerDto.password,
        avatar: registerDto.avatar || null,
      })
      .select("id, name, email, avatar")
      .single();

    if (error) {
      throw new ConflictException(error.message);
    }

    return {
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar,
      },
      token: randomUUID(),
    };
  }

  async updateProfile(id: string, dto: UpdateProfileDto) {
    const { data: emailTaken } = await this.supabase
      .from("users")
      .select("id")
      .eq("email", dto.email)
      .neq("id", id)
      .single();

    if (emailTaken) {
      throw new ConflictException("E-mail já está em uso por outra conta");
    }

    const { data: user, error } = await this.supabase
      .from("users")
      .update({
        name: dto.name,
        email: dto.email,
        avatar: dto.avatar || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("id, name, email, avatar")
      .single();

    if (error || !user) {
      throw new NotFoundException("Usuário não encontrado");
    }

    return user;
  }

  async findByEmail(email: string) {
    const { data: user } = await this.supabase
      .from("users")
      .select("id, name, email, avatar")
      .eq("email", email)
      .single();

    return user || null;
  }
}
