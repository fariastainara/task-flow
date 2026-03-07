import { Module, Global } from "@nestjs/common";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { ConfigService } from "@nestjs/config";

export const SUPABASE_CLIENT = "SUPABASE_CLIENT";

@Global()
@Module({
  providers: [
    {
      provide: SUPABASE_CLIENT,
      useFactory: (configService: ConfigService): SupabaseClient => {
        const url = configService.get<string>("SUPABASE_URL");
        const key = configService.get<string>("SUPABASE_KEY");
        if (!url || !key) {
          throw new Error(
            "SUPABASE_URL e SUPABASE_KEY devem estar definidos no .env",
          );
        }
        return createClient(url, key);
      },
      inject: [ConfigService],
    },
  ],
  exports: [SUPABASE_CLIENT],
})
export class SupabaseModule {}
