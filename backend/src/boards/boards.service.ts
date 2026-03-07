import {
  Injectable,
  NotFoundException,
  ConflictException,
  Inject,
} from "@nestjs/common";
import { Board, BoardMember } from "./board.entity";
import { CreateBoardDto, UpdateBoardDto } from "./dto/board.dto";
import { SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_CLIENT } from "../supabase/supabase.module";

@Injectable()
export class BoardsService {
  constructor(
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
  ) {}

  async findAll(userId: string): Promise<Board[]> {
    // Busca os board_ids onde o usuário é membro
    const { data: memberRows, error: memberError } = await this.supabase
      .from("board_members")
      .select("board_id")
      .eq("user_id", userId);

    if (memberError) throw memberError;

    const boardIds = (memberRows || []).map((r: any) => r.board_id);
    if (boardIds.length === 0) return [];

    const { data: boards, error } = await this.supabase
      .from("boards")
      .select("*")
      .in("id", boardIds)
      .order("created_at", { ascending: true });

    if (error) throw error;

    const result: Board[] = [];
    for (const b of boards || []) {
      const members = await this.getMembers(b.id);
      result.push({
        id: b.id,
        name: b.name,
        icon: b.icon,
        iconColor: b.icon_color,
        members,
        createdAt: b.created_at,
        updatedAt: b.updated_at,
      });
    }
    return result;
  }

  async findOne(id: string): Promise<Board> {
    const { data: b, error } = await this.supabase
      .from("boards")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !b) {
      throw new NotFoundException(`Quadro com id "${id}" não encontrado`);
    }

    const members = await this.getMembers(id);
    return {
      id: b.id,
      name: b.name,
      icon: b.icon,
      iconColor: b.icon_color,
      members,
      createdAt: b.created_at,
      updatedAt: b.updated_at,
    };
  }

  async create(dto: CreateBoardDto): Promise<Board> {
    const { data: b, error } = await this.supabase
      .from("boards")
      .insert({
        name: dto.name,
        icon: dto.icon || "Dashboard",
        icon_color: dto.iconColor || "#1976d2",
      })
      .select("*")
      .single();

    if (error) throw error;

    // Adiciona o criador como membro automaticamente
    await this.supabase.from("board_members").insert({
      board_id: b.id,
      user_id: dto.userId,
    });

    const members = await this.getMembers(b.id);
    return {
      id: b.id,
      name: b.name,
      icon: b.icon,
      iconColor: b.icon_color,
      members,
      createdAt: b.created_at,
      updatedAt: b.updated_at,
    };
  }

  async update(id: string, dto: UpdateBoardDto): Promise<Board> {
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };
    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.icon !== undefined) updateData.icon = dto.icon;
    if (dto.iconColor !== undefined) updateData.icon_color = dto.iconColor;

    const { data: b, error } = await this.supabase
      .from("boards")
      .update(updateData)
      .eq("id", id)
      .select("*")
      .single();

    if (error || !b) {
      throw new NotFoundException(`Quadro com id "${id}" não encontrado`);
    }

    const members = await this.getMembers(id);
    return {
      id: b.id,
      name: b.name,
      icon: b.icon,
      iconColor: b.icon_color,
      members,
      createdAt: b.created_at,
      updatedAt: b.updated_at,
    };
  }

  async remove(id: string): Promise<void> {
    const { error } = await this.supabase.from("boards").delete().eq("id", id);

    if (error) {
      throw new NotFoundException(`Quadro com id "${id}" não encontrado`);
    }
  }

  async inviteMember(boardId: string, email: string): Promise<BoardMember> {
    // Verifica se o board existe
    const { data: board } = await this.supabase
      .from("boards")
      .select("id")
      .eq("id", boardId)
      .single();

    if (!board) {
      throw new NotFoundException(`Quadro com id "${boardId}" não encontrado`);
    }

    // Busca o usuário pelo email
    const { data: user } = await this.supabase
      .from("users")
      .select("id, name, email, avatar")
      .eq("email", email)
      .single();

    if (!user) {
      throw new NotFoundException("Nenhum usuário cadastrado com este e-mail");
    }

    // Verifica se já é membro
    const { data: existing } = await this.supabase
      .from("board_members")
      .select("id")
      .eq("board_id", boardId)
      .eq("user_id", user.id)
      .single();

    if (existing) {
      throw new ConflictException("Este usuário já é membro do quadro");
    }

    const { error } = await this.supabase.from("board_members").insert({
      board_id: boardId,
      user_id: user.id,
    });

    if (error) throw error;

    // Atualiza updated_at do board
    await this.supabase
      .from("boards")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", boardId);

    return {
      userId: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    };
  }

  async removeMember(boardId: string, userId: string): Promise<void> {
    const { data, error } = await this.supabase
      .from("board_members")
      .delete()
      .eq("board_id", boardId)
      .eq("user_id", userId)
      .select("id");

    if (error || !data || data.length === 0) {
      throw new NotFoundException("Membro não encontrado no quadro");
    }

    await this.supabase
      .from("boards")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", boardId);
  }

  async getMembers(boardId: string): Promise<BoardMember[]> {
    const { data, error } = await this.supabase
      .from("board_members")
      .select("user_id, users(id, name, email, avatar)")
      .eq("board_id", boardId);

    if (error) throw error;

    return (data || []).map((row: any) => ({
      userId: row.users.id,
      name: row.users.name,
      email: row.users.email,
      avatar: row.users.avatar,
    }));
  }
}
