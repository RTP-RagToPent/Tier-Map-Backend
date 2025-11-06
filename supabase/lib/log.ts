import { isDevelopment } from "./config/env.ts";

type ErrorLog = {
  title: string;
  error: unknown;
};

function errorLog({ title, error }: ErrorLog): void {
  if (isDevelopment) return;

  console.error(`[Error] ${title}`);
  if (error instanceof Error) {
    console.error(`${error.name}: ${error.message}`);
  } else if (typeof error === "string") {
    console.error(`${error}`);
  } else {
    console.error("[Unknown Error]", error);
  }
}

export { errorLog };
