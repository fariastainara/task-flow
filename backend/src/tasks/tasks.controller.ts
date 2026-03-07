import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { CreateTaskDto, UpdateTaskDto } from "./dto/task.dto";
import { Task } from "./task.entity";

@Controller("tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async findAll(@Query("boardId") boardId?: string): Promise<Task[]> {
    if (boardId) {
      return this.tasksService.findByBoard(boardId);
    }
    return this.tasksService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string): Promise<Task> {
    return this.tasksService.findOne(id);
  }

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.create(createTaskDto);
  }

  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: string): Promise<void> {
    return this.tasksService.remove(id);
  }
}
