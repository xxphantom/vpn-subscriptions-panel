import path from "path";

import { payloadCloud } from "@payloadcms/plugin-cloud";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { webpackBundler } from "@payloadcms/bundler-webpack";
import { slateEditor } from "@payloadcms/richtext-slate";
import { buildConfig } from "payload/config";
import { UsersCollection } from "./admin/collections/users";
import { SharedConfig } from "./admin/globals/sharedConfig";
import { Subscriptions } from "./admin/collections/subscriptions";

export default buildConfig({
  admin: {
    user: UsersCollection.slug,
    bundler: webpackBundler(),
  },
  editor: slateEditor({}),
  collections: [UsersCollection, Subscriptions],
  globals: [SharedConfig],
  typescript: {
    outputFile: path.resolve(__dirname, "payload-types.ts"),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, "generated-schema.graphql"),
  },
  plugins: [payloadCloud()],
  db: postgresAdapter({
    pool: {
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
    },
  }),
});
