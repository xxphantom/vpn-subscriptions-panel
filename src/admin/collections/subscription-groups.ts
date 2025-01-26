import { CollectionConfig } from "payload/types";
import { v4 as uuidv4 } from "uuid";

export const SubscriptionGroups: CollectionConfig = {
  slug: "subscription-groups",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "description"],
  },
  labels: {
    singular: "Группа подписок",
    plural: "Группы подписок",
  },
  fields: [
    {
      name: "name",
      label: "Название группы",
      type: "text",
      required: true,
    },
    {
      name: "description",
      label: "Описание",
      type: "textarea",
    },
    {
      name: "slug",
      label: "Идентификатор",
      type: "text",
      unique: true,
      required: true,
      defaultValue: () => uuidv4(),
      admin: {
        description: "Уникальный идентификатор группы (генерируется автоматически)",
        readOnly: true,
      },
    },
    // Переопределение общих настроек
    {
      name: "configOverrides",
      label: "Переопределение общих настроек",
      type: "group",
      fields: [
        {
          name: "vpn_name",
          label: "Имя VPN",
          type: "text",
        },
        {
          name: "config_update_hours",
          label: "Интервал обновления профиля, часов",
          type: "number",
        },
        {
          name: "support_chat_link",
          label: "Ссылка на поддержку",
          type: "text",
        },
        {
          name: "site_link",
          label: "Ссылка на сайт VPN",
          type: "text",
        },
        {
          name: "announce",
          label: "Объявление",
          type: "text",
        },
      ],
    },
  ],
};
