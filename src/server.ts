// backend/src/server.ts
import express from "express";
import payload from "payload";
import { Request, Response } from "express";
import https from "https";
import fs from "fs";
import path from "path";

const DEFAULT_PORT = 3000;

require("dotenv").config();

interface SubscriptionLink {
  url: string;
}

interface SubscriptionDocument {
  name: string;
  title: string;
  slug: string;
  expire: string;
  links: SubscriptionLink[];
}

const app = express();

app.get("/", (_, res) => {
  res.redirect("/admin");
});

app.get("/subscription/:slug", async (req: Request, res: Response) => {
  try {
    // 1) Получаем общую конфигурацию
    const globalConfig = await payload.findGlobal({
      slug: "shared-config",
    });

    // 2) Ищем подписку по slug (или id)
    const { slug } = req.params;
    const subscription = await payload.find({
      collection: "subscriptions",
      where: {
        slug: {
          equals: slug,
        },
      },
    });

    if (!subscription?.docs?.[0]) {
      return res.status(404).send("Подписка не найдена");
    }

    const sub = subscription.docs[0] as unknown as SubscriptionDocument;

    // 3) Собираем Plain Text
    const lines = [
      `#profile-title: ${globalConfig.vpn_name}`,
      `#profile-update-interval: ${globalConfig.config_update_hours}`,
      `#subscription-userinfo: expire=${sub.expire}`,
      `#support-url: ${globalConfig.support_chat_link}`,
      `#profile-web-page-url: ${globalConfig.site_link}`,
      `#announce: ${globalConfig.announce}`,
      // Добавляем ссылки
      ...sub.links.map((obj) => obj.url),
    ];

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.send(lines.join("\n"));
  } catch (error) {
    console.error(error);
    res.status(500).send("Ошибка сервера");
  }
});

async function start() {
  // Initialize Payload
  await payload.init({
    secret: process.env.PAYLOAD_SECRET || "",
    express: app,
    onInit: () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
    },
  });

  // Определяем режим работы (development/production)
  const isDev = process.env.NODE_ENV === "development";

  if (isDev) {
    // В режиме разработки используем HTTP
    app.listen(3000, () => {
      console.log("Server running on http://localhost:3000");
    });
  } else {
    // В production режиме используем HTTPS
    const sslOptions = {
      key: fs.readFileSync(
        path.resolve(process.env.SSL_KEY_PATH || "ssl/private.key"),
      ),
      cert: fs.readFileSync(
        path.resolve(process.env.SSL_CERT_PATH || "ssl/certificate.crt"),
      ),
    };

    https
      .createServer(sslOptions, app)
      .listen(process.env.SUBSCRIPTIONS_DOMAIN_PORT || DEFAULT_PORT, () => {
        console.log(
          `Secure server running on https://${process.env.SUBSCRIPTIONS_DOMAIN_URL || "localhost"}:${process.env.SUBSCRIPTIONS_DOMAIN_PORT || DEFAULT_PORT}`,
        );
      });
  }
}

start();
