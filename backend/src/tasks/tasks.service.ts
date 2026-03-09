import { Injectable, NotFoundException, Inject } from "@nestjs/common";
import { Task, TaskStatus, TaskPriority } from "./task.entity";
import { CreateTaskDto, UpdateTaskDto } from "./dto/task.dto";
import { SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_CLIENT } from "../supabase/supabase.module";

@Injectable()
export class TasksService {
  constructor(
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
  ) {}

  private mapRow(row: any): Task {
    return {
      id: row.id,
      boardId: row.board_id,
      title: row.title,
      description: row.description,
      status: row.status as TaskStatus,
      priority: row.priority as TaskPriority,
      assigneeId: row.assignee_id,
      assigneeName: row.assignee_name,
      startDate: row.start_date,
      dueDate: row.due_date,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async findAll(): Promise<Task[]> {
    const { data, error } = await this.supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) throw error;
    return (data || []).map(this.mapRow);
  }

  async findByBoard(boardId: string): Promise<Task[]> {
    const { data, error } = await this.supabase
      .from("tasks")
      .select("*")
      .eq("board_id", boardId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return (data || []).map(this.mapRow);
  }

  async removeByBoard(boardId: string): Promise<void> {
    await this.supabase.from("tasks").delete().eq("board_id", boardId);
  }

  async findOne(id: string): Promise<Task> {
    const { data, error } = await this.supabase
      .from("tasks")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      throw new NotFoundException(`Tarefa com id "${id}" não encontrada`);
    }
    return this.mapRow(data);
  }

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const { data, error } = await this.supabase
      .from("tasks")
      .insert({
        board_id: createTaskDto.boardId,
        title: createTaskDto.title,
        description: createTaskDto.description ?? "",
        status: TaskStatus.TODO,
        priority: createTaskDto.priority ?? TaskPriority.MEDIUM,
        assignee_id: createTaskDto.assigneeId || null,
        assignee_name: createTaskDto.assigneeName || null,
        start_date: createTaskDto.startDate || null,
        due_date: createTaskDto.dueDate || null,
      })
      .select("*")
      .single();

    if (error) throw error;
    return this.mapRow(data);
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (updateTaskDto.title !== undefined)
      updateData.title = updateTaskDto.title;
    if (updateTaskDto.description !== undefined)
      updateData.description = updateTaskDto.description;
    if (updateTaskDto.status !== undefined)
      updateData.status = updateTaskDto.status;
    if (updateTaskDto.priority !== undefined)
      updateData.priority = updateTaskDto.priority;
    if (updateTaskDto.startDate !== undefined)
      updateData.start_date = updateTaskDto.startDate;
    if (updateTaskDto.dueDate !== undefined)
      updateData.due_date = updateTaskDto.dueDate;
    if (updateTaskDto.assigneeId !== undefined)
      updateData.assignee_id = updateTaskDto.assigneeId;
    if (updateTaskDto.assigneeName !== undefined)
      updateData.assignee_name = updateTaskDto.assigneeName;

    const { data, error } = await this.supabase
      .from("tasks")
      .update(updateData)
      .eq("id", id)
      .select("*")
      .single();

    if (error || !data) {
      throw new NotFoundException(`Tarefa com id "${id}" não encontrada`);
    }
    return this.mapRow(data);
  }

  async remove(id: string): Promise<void> {
    const { data, error } = await this.supabase
      .from("tasks")
      .delete()
      .eq("id", id)
      .select("id");

    if (error || !data || data.length === 0) {
      throw new NotFoundException(`Tarefa com id "${id}" não encontrada`);
    }
  }
}
