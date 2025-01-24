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
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      unique: true,
      required: true,
      defaultValue: () => uuidv4(),
    },
    {
      name: "subscriptionUrl",
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
    },
    {
      name: "links",
      type: "array",
      minRows: 1,
      fields: [
        {
          name: "url",
          type: "text",
          required: true,
        },
      ],
    },
    // Add other fields as needed
  ],
};
