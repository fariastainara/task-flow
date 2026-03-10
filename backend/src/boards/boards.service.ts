import {
  Injectable,
  NotFoundException,
  ConflictException,
  Inject,
  BadRequestException,
} from "@nestjs/common";
import { Board, BoardInvitation, BoardMember } from "./board.entity";
import { CreateBoardDto, UpdateBoardDto } from "./dto/board.dto";
import { SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_CLIENT } from "../supabase/supabase.module";
import { TasksService } from "../tasks/tasks.service";

@Injectable()
export class BoardsService {
  constructor(
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
    private readonly tasksService: TasksService,
  ) {}

  async findAll(userId: string): Promise<Board[]> {
    // Busca os board_ids onde o usuário é membro
    const { data: memberRows, error: memberError } = await this.supabase
      .from("board_members")
      .select("board_id, sort_order, created_at")
      .or("status.eq.ACCEPTED,status.is.null")
      .eq("user_id", userId);

    if (memberError) throw memberError;

    const boardIds = (memberRows || []).map((r: any) => r.board_id);
    if (boardIds.length === 0) return [];

    const { data: boards, error } = await this.supabase
      .from("boards")
      .select("*")
      .in("id", boardIds);

    if (error) throw error;

    const sortMap = new Map<string, number | null>();
    for (const row of memberRows || []) {
      sortMap.set(row.board_id, row.sort_order ?? null);
    }

    const sortedBoards = (boards || []).slice().sort((a: any, b: any) => {
      const aOrder = sortMap.get(a.id);
      const bOrder = sortMap.get(b.id);
      if (aOrder == null && bOrder == null) {
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      }
      if (aOrder == null) return 1;
      if (bOrder == null) return -1;
      return aOrder - bOrder;
    });

    const result: Board[] = [];
    for (const b of sortedBoards) {
      const members = await this.getMembers(b.id);
      result.push({
        id: b.id,
        name: b.name,
        icon: b.icon,
        iconColor: b.icon_color,
        bgColor: b.bg_color,
        createdBy: b.created_by,
        members,
        createdAt: b.created_at,
        updatedAt: b.updated_at,
      });
    }
    return result;
  }

  private async getNextSortOrder(userId: string): Promise<number> {
    const { data } = await this.supabase
      .from("board_members")
      .select("sort_order")
      .eq("user_id", userId)
      .or("status.eq.ACCEPTED,status.is.null")
      .not("sort_order", "is", null)
      .order("sort_order", { ascending: false })
      .limit(1);

    const maxOrder = data?.[0]?.sort_order;
    return typeof maxOrder === "number" ? maxOrder + 1 : 1;
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
      bgColor: b.bg_color,
      createdBy: b.created_by,
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
        bg_color: dto.bgColor || "#f5f5f5",
        created_by: dto.userId,
      })
      .select("*")
      .single();

    if (error) throw error;

    // Adiciona o criador como membro automaticamente
    const sortOrder = await this.getNextSortOrder(dto.userId);
    await this.supabase.from("board_members").insert({
      board_id: b.id,
      user_id: dto.userId,
      status: "ACCEPTED",
      sort_order: sortOrder,
    });

    const members = await this.getMembers(b.id);
    return {
      id: b.id,
      name: b.name,
      icon: b.icon,
      iconColor: b.icon_color,
      bgColor: b.bg_color,
      createdBy: b.created_by,
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
    if (dto.bgColor !== undefined) updateData.bg_color = dto.bgColor;

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
      bgColor: b.bg_color,
      createdBy: b.created_by,
      members,
      createdAt: b.created_at,
      updatedAt: b.updated_at,
    };
  }

  async remove(id: string, userId: string): Promise<void> {
    // Verifica se o usuário é o criador do quadro
    const { data: board } = await this.supabase
      .from("boards")
      .select("created_by")
      .eq("id", id)
      .single();

    if (!board) {
      throw new NotFoundException(`Quadro com id "${id}" não encontrado`);
    }

    if (board.created_by !== userId) {
      throw new BadRequestException(
        "Apenas o criador do quadro pode excluí-lo",
      );
    }
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
      .select("id, status")
      .eq("board_id", boardId)
      .eq("user_id", user.id)
      .single();

    if (existing) {
      if (!existing.status || existing.status === "ACCEPTED") {
        throw new ConflictException("Este usuário já é membro do quadro");
      }

      if (existing.status === "PENDING") {
        throw new ConflictException("Este usuário já possui convite pendente");
      }

      const { error: updateInviteError } = await this.supabase
        .from("board_members")
        .update({
          status: "PENDING",
          created_at: new Date().toISOString(),
        })
        .eq("id", existing.id);

      if (updateInviteError) throw updateInviteError;
    } else {
      const { error } = await this.supabase.from("board_members").insert({
        board_id: boardId,
        user_id: user.id,
        status: "PENDING",
      });

      if (error) throw error;
    }

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

  async duplicate(boardId: string, userId: string): Promise<Board> {
    const original = await this.findOne(boardId);

    // Cria o novo quadro
    const { data: b, error } = await this.supabase
      .from("boards")
      .insert({
        name: `${original.name} (cópia)`,
        icon: original.icon,
        icon_color: original.iconColor,
        bg_color: original.bgColor,
        created_by: userId,
      })
      .select("*")
      .single();

    if (error) throw error;

    // Adiciona o usuário como membro
    const sortOrder = await this.getNextSortOrder(userId);
    await this.supabase.from("board_members").insert({
      board_id: b.id,
      user_id: userId,
      status: "ACCEPTED",
      sort_order: sortOrder,
    });

    // Copia as tarefas do quadro original
    const tasks = await this.tasksService.findByBoard(boardId);
    for (const task of tasks) {
      await this.tasksService.create({
        boardId: b.id,
        title: task.title,
        description: task.description || undefined,
        assigneeId: task.assigneeId || undefined,
        assigneeName: task.assigneeName || undefined,
        startDate: task.startDate || undefined,
        dueDate: task.dueDate || undefined,
      });
    }

    const members = await this.getMembers(b.id);
    return {
      id: b.id,
      name: b.name,
      icon: b.icon,
      iconColor: b.icon_color,
      bgColor: b.bg_color,
      createdBy: b.created_by,
      members,
      createdAt: b.created_at,
      updatedAt: b.updated_at,
    };
  }

  async getMembers(boardId: string): Promise<BoardMember[]> {
    const { data, error } = await this.supabase
      .from("board_members")
      .select("user_id, status, users(id, name, email, avatar)")
      .or(
        "status.eq.ACCEPTED,status.eq.PENDING,status.eq.DECLINED,status.is.null",
      )
      .eq("board_id", boardId);

    if (error) throw error;

    return (data || []).map((row: any) => ({
      userId: row.users.id,
      name: row.users.name,
      email: row.users.email,
      avatar: row.users.avatar,
      status: row.status || "ACCEPTED",
    }));
  }

  async getPendingInvites(userId: string): Promise<BoardInvitation[]> {
    const { data, error } = await this.supabase
      .from("board_members")
      .select(
        "board_id, created_at, boards(id, name, icon, icon_color, bg_color)",
      )
      .eq("user_id", userId)
      .eq("status", "PENDING")
      .order("created_at", { ascending: false });

    if (error) throw error;

    const invitesWithInviters = await Promise.all(
      (data || [])
        .filter((row: any) => !!row.boards)
        .map(async (row: any) => {
          // Busca o primeiro membro aceito do board (owner)
          const { data: ownerData } = await this.supabase
            .from("board_members")
            .select("user_id, users(name)")
            .eq("board_id", row.boards.id)
            .or("status.eq.ACCEPTED,status.is.null")
            .order("created_at", { ascending: true })
            .limit(1);

          const ownerName = (ownerData?.[0] as any)?.users?.name || "";

          return {
            boardId: row.boards.id,
            boardName: row.boards.name,
            boardIcon: row.boards.icon,
            boardIconColor: row.boards.icon_color,
            boardBgColor: row.boards.bg_color,
            invitedAt: new Date(row.created_at),
            inviterName: ownerName,
          };
        }),
    );

    return invitesWithInviters;
  }

  async respondToInvite(
    boardId: string,
    userId: string,
    accept: boolean,
  ): Promise<void> {
    const { data: invite, error } = await this.supabase
      .from("board_members")
      .select("id, status")
      .eq("board_id", boardId)
      .eq("user_id", userId)
      .single();

    if (error || !invite) {
      throw new NotFoundException("Convite não encontrado");
    }

    if (invite.status !== "PENDING") {
      throw new BadRequestException("Este convite já foi respondido");
    }

    if (accept) {
      const sortOrder = await this.getNextSortOrder(userId);
      const { error: updateError } = await this.supabase
        .from("board_members")
        .update({ status: "ACCEPTED", sort_order: sortOrder })
        .eq("id", invite.id);

      if (updateError) throw updateError;
    } else {
      const { error: updateError } = await this.supabase
        .from("board_members")
        .update({ status: "DECLINED" })
        .eq("id", invite.id);

      if (updateError) throw updateError;
    }

    await this.supabase
      .from("boards")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", boardId);
  }

  async reorderBoards(userId: string, boardIds: string[]): Promise<void> {
    if (!userId || !Array.isArray(boardIds) || boardIds.length === 0) {
      throw new BadRequestException("Parâmetros inválidos");
    }

    const uniqueIds = Array.from(new Set(boardIds));
    if (uniqueIds.length !== boardIds.length) {
      throw new BadRequestException("Lista de quadros contém duplicados");
    }

    const { data: memberships, error } = await this.supabase
      .from("board_members")
      .select("board_id")
      .eq("user_id", userId)
      .or("status.eq.ACCEPTED,status.is.null")
      .in("board_id", boardIds);

    if (error) throw error;

    if ((memberships || []).length !== boardIds.length) {
      throw new BadRequestException("Quadros inválidos para este usuário");
    }

    for (let index = 0; index < boardIds.length; index += 1) {
      const boardId = boardIds[index];
      const { error: updateError } = await this.supabase
        .from("board_members")
        .update({ sort_order: index + 1 })
        .eq("user_id", userId)
        .eq("board_id", boardId);

      if (updateError) throw updateError;
    }
  }
}
