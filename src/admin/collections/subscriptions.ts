// backend/src/admin/collections/subscriptions.ts
import { sanitizeUrl } from "../../shared/sanitize-url";
import { CollectionConfig } from "payload/types";
import { v4 as uuidv4 } from "uuid";

export const Subscriptions: CollectionConfig = {
  slug: "subscriptions",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "group", "createdAt"],
    group: "VPN",
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
      name: "group",
      label: "Группа",
      type: "relationship",
      relationTo: "subscription-groups",
      admin: {
        description:
          "Группа подписки. Если выбрана, настройки группы будут иметь приоритет над общими настройками",
      },
    },
    {
      name: "slug",
      label: "Идентификатор",
      type: "text",
      unique: true,
      required: true,
      defaultValue: () => uuidv4(),
      admin: {
        description:
          "Уникальный идентификатор подписки (генерируется автоматически)",
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
  ],
  hooks: {
    afterChange: [
      async ({ req, doc, previousDoc }) => {
        const newGroupId = doc.group;
        const oldGroupId = previousDoc?.group;

        // Вызываем пересчет в следующем «тике» Event Loop,
        setImmediate(async () => {
          // Пересчет уже не мешает текущей транзакции.
          try {
            if (oldGroupId) {
              await recalcSubscriptionCount({
                req,
                groupId: oldGroupId,
              });
            }
            if (newGroupId) {
              await recalcSubscriptionCount({
                req,
                groupId: newGroupId,
              });
            }
          } catch (err) {
            console.error("Ошибка при пересчете подписок:", err);
          }
        });

        return doc;
      },
    ],

    afterDelete: [
      async ({ req, doc }) => {
        try {
          if (doc?.group) {
            setImmediate(async () => {
              await recalcSubscriptionCount({
                req,
                groupId: doc.group,
              });
            });
          }
          return doc;
        } catch (error) {
          console.error("Ошибка при удалении подписки:", error);
          return doc;
        }
      },
    ],
  },
};

// Вспомогательный метод, который считает подписки и обновляет group.subscriptionCount:
async function recalcSubscriptionCount({
  req,
  groupId,
}: {
  req: any;
  groupId: string | number | Record<string, any>;
}) {
  if (!groupId) {
    return;
  }

  try {
    // Извлекаем числовой ID из входного параметра
    const actualGroupId = typeof groupId === "object" ? groupId.id : groupId;

    if (
      typeof actualGroupId !== "number" &&
      typeof actualGroupId !== "string"
    ) {
      throw new Error(
        `Invalid groupId type: ${typeof actualGroupId}. Expected number or string.`,
      );
    }

    // Проверяем существование группы
    const group = await req.payload.findByID({
      collection: "subscription-groups",
      id: actualGroupId,
    });

    if (!group) {
      return;
    }

    // Считаем подписки
    const subscriptionsResult = await req.payload.find({
      collection: "subscriptions",
      where: {
        group: {
          equals: actualGroupId,
        },
      },
      depth: 0,
      limit: 0,
    });

    const count = subscriptionsResult.totalDocs;

    // Обновляем группу
    const result = await req.payload.update({
      collection: "subscription-groups",
      id: actualGroupId,
      data: {
        subscriptionCount: count,
      },
      depth: 0,
    });

    return count;
  } catch (e) {
    console.error("Ошибка при пересчете подписок:", e);
    throw e;
  }
}
