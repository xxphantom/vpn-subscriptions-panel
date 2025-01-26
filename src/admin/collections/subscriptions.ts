// backend/src/admin/collections/subscriptions.ts
import { sanitizeUrl } from "../../shared/sanitize-url";
import { CollectionConfig } from "payload/types";
import { v4 as uuidv4 } from "uuid";

export const Subscriptions: CollectionConfig = {
  slug: "subscriptions",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "expire", "subscriptionUrl", "links"],
  },
  labels: {
    singular: "Подписка",
    plural: "Подписки",
  },
  fields: [
    {
      name: "name",
      label: "Имя",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      label: "Идентификатор",
      type: "text",
      unique: true,
      required: true,
      defaultValue: () => uuidv4(),
      admin: {
        description: "Уникальный идентификатор подписки (генерируется автоматически)",
        readOnly: true,
      },
    },
    {
      name: "subscriptionUrl",
      label: "URL подписки",
      type: "text",
      admin: {
        description: "URL для доступа к подписке",
        readOnly: true,
      },
      hooks: {
        beforeChange: [
          ({ data }) => {
            const domain = process.env.SUBSCRIPTIONS_DOMAIN_URL || "localhost";
            const port = process.env.SUBSCRIPTIONS_DOMAIN_PORT || "3000";
            return `http${process.env.NODE_ENV === "production" ? "s" : ""}://${domain}${port ? ":" : ""}${port}/subscription/${sanitizeUrl(data.name)}/${data.slug}`;
          },
        ],
      },
    },
    {
      name: "expire",
      label: "Дата истечения",
      type: "date",
      required: true,
      admin: {
        description: "Дата окончания действия подписки",
      },
    },
    {
      name: "links",
      label: "Ссылки",
      type: "array",
      minRows: 1,
      admin: {
        description: "Список ссылок для подключения",
      },
      fields: [
        {
          name: "url",
          label: "URL",
          type: "text",
          required: true,
          admin: {
            description: "Ссылка для подключения в формате vless://...",
          },
        },
      ],
    },
    // Add other fields as needed
  ],
};
