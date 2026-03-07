import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
import { INestApplication } from "@nestjs/common";

let cachedApp: INestApplication;

async function getApp(): Promise<INestApplication> {
  if (!cachedApp) {
    cachedApp = await NestFactory.create(AppModule);
    cachedApp.enableCors({
      origin: process.env.FRONTEND_URL
        ? process.env.FRONTEND_URL.split(",").map((o) => o.trim())
        : "http://localhost:5173",
      methods: "GET,POST,PUT,DELETE,PATCH,OPTIONS",
      allowedHeaders: "Content-Type,Authorization",
      credentials: true,
    });
    cachedApp.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await cachedApp.init();
  }
  return cachedApp;
}

// Vercel serverless handler
export default async function handler(req: any, res: any) {
  const app = await getApp();
  const server = app.getHttpAdapter().getInstance();
  return server(req, res);
}

// Local development
if (!process.env.VERCEL) {
  getApp().then((app) => app.listen(process.env.PORT || 3000));
}
