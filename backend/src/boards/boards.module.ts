import { Module } from "@nestjs/common";
import { BoardsController } from "./boards.controller";
import { BoardsService } from "./boards.service";
import { TasksModule } from "../tasks/tasks.module";

@Module({
  imports: [TasksModule],
  controllers: [BoardsController],
  providers: [BoardsService],
})
export class BoardsModule {}
