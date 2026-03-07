import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
import { INestApplication } from "@nestjs/common";

let cachedApp: INestApplication;

async function getApp(): Promise<INestApplication> {
  if (!cachedApp) {
    cachedApp = await NestFactory.create(AppModule);
    cachedApp.enableCors({
      origin: "*",
      methods: "GET,POST,PUT,DELETE,PATCH,OPTIONS",
      allowedHeaders: "Content-Type,Authorization",
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
  // Handle preflight OPTIONS directly
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization",
    );
    res.status(204).end();
    return;
  }

  const app = await getApp();
  const server = app.getHttpAdapter().getInstance();
  return server(req, res);
}

// Local development
if (!process.env.VERCEL) {
  getApp().then((app) => app.listen(process.env.PORT || 3000));
}
