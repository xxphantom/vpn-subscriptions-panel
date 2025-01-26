import { CollectionConfig } from "payload/types";

export const UsersCollection: CollectionConfig = {
  slug: "users",
  auth: true,
  labels: {
    singular: "Администратор",
    plural: "Администраторы",
  },
  admin: {
    useAsTitle: "email",
  },
  fields: [
    // Email added by default
    // Add more fields as needed
  ],
};
