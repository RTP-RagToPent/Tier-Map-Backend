import { envLoader } from "./loader.ts";

const env = envLoader("ENV");
const isDevelopment = env === "development";
const frontendBaseUrl = envLoader("FRONTEND_BASE_URL");

export { env, frontendBaseUrl, isDevelopment };
