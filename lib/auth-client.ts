import { createAuthClient } from "better-auth/react";
import {
  inferAdditionalFields,
  usernameClient,
  adminClient,
} from "better-auth/client/plugins";
import { auth } from "./auth";

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL!,
  plugins: [
    usernameClient(),
    inferAdditionalFields<typeof auth>(),
    adminClient(),
  ],
});
