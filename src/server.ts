import express from "express";
import payload from "payload";
import { Request, Response } from "express";
import https from "https";
import fs from "fs";
import path from "path";
import { dateToUnixTimestamp } from "./shared/dateUtils";

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
  group: {
    id: string;
    configOverrides?: {
      vpn_name?: string;
      config_update_hours?: number;
      support_chat_link?: string;
      site_link?: string;
      announce?: string;
    };
  } | null;
}

const app = express();

app.get("/", (_, res) => {
  res.redirect("/admin");
});

app.get("/subscription/:name/:slug", async (req: Request, res: Response) => {
  try {
    // 1) Получаем общую конфигурацию
    const globalConfig = await payload.findGlobal({
      slug: "shared-config",
    });

    // 2) Ищем подписку по slug c данными о группе
    const { slug } = req.params;
    const subscription = await payload.find({
      collection: "subscriptions",
      where: {
        slug: {
          equals: slug,
        },
      },
      depth: 1, // Получаем данные связанной группы
    });

    if (!subscription?.docs?.[0]) {
      return res.status(404).send("Подписка не найдена");
    }

    const sub = subscription.docs[0] as unknown as SubscriptionDocument;

    // Определяем конфигурацию с учетом группы
    const config = {
      vpn_name: sub.group?.configOverrides?.vpn_name || globalConfig.vpn_name,
      config_update_hours: sub.group?.configOverrides?.config_update_hours || globalConfig.config_update_hours,
      support_chat_link: sub.group?.configOverrides?.support_chat_link || globalConfig.support_chat_link,
      site_link: sub.group?.configOverrides?.site_link || globalConfig.site_link,
      announce: sub.group?.configOverrides?.announce || globalConfig.announce,
    };

    // 3) Собираем Plain Text с учетом конфигурации группы
    const lines = [
      `#profile-title: ${config.vpn_name}`,
      `#profile-update-interval: ${config.config_update_hours}`,
      `#subscription-userinfo: expire=${dateToUnixTimestamp(sub.expire)}`,
      `#support-url: ${config.support_chat_link}`,
      `#profile-web-page-url: ${config.site_link}`,
      `#announce: ${config.announce}`,
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
    app.listen(process.env.SUBSCRIPTIONS_DOMAIN_PORT || DEFAULT_PORT, () => {
      console.log(
        `Server running on http://localhost:${process.env.SUBSCRIPTIONS_DOMAIN_PORT || DEFAULT_PORT}`,
      );
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
