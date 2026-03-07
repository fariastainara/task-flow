import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TasksModule } from "./tasks/tasks.module";
import { AuthModule } from "./auth/auth.module";
import { BoardsModule } from "./boards/boards.module";
import { SupabaseModule } from "./supabase/supabase.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SupabaseModule,
    TasksModule,
    AuthModule,
    BoardsModule,
  ],
})
export class AppModule {}
