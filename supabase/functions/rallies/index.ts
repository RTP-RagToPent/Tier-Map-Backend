import "@supabase/functions-js/edge-runtime.d.ts";

import { frontendBaseUrl, isDevelopment } from "../../lib/config/env.ts";
import { httpResponse } from "../../lib/httpResponse.ts";
import { errorLog } from "../../lib/log.ts";
import { parseInt } from "../../lib/parse.ts";
import { ralliesRouter } from "./router/rallies.ts";

console.log("Rallies API Function!");

Deno.serve(async (req: Request) => {
  const corsHeaders: Record<string, string> = {
    ...(isDevelopment
      ? {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": "false",
      }
      : {
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Origin": frontendBaseUrl,
      }),
    "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "authorization, content-type",
  };

  try {
    const { url: reqUrl, method } = req;
    // TODO: Credentialからuser_idを取得してuser_idを元にprofileIdをセットする
    const profileId = 1;

    const url = new URL(reqUrl);
    const pathname = url.pathname;
    const paths = pathname.split("/").filter((path) => path.length > 0);
    const pathLength = paths.length;

    if (method === "OPTIONS") {
      const { status, message } = httpResponse.NO_CONTENT;
      return new Response(JSON.stringify({ message }), {
        status,
        headers: corsHeaders,
      });
    }

    if (pathLength < 1 || pathLength > 4) {
      const { status, message } = httpResponse.NOT_FOUND;
      return new Response(JSON.stringify({ status, message }), {
        status,
        headers: corsHeaders,
      });
    }

    const rallyId = pathLength >= 2 ? parseInt(paths[1]) : undefined;

    try {
      if (pathLength == 1 || pathLength == 2) {
        return await ralliesRouter({
          req,
          profileId,
          rallyId,
          method,
          pathLength,
          corsHeaders,
        });
      }
    } catch (error) {
      errorLog({ title: "Rallies API Error", error });
    }

    const { status, message } = httpResponse.NOT_FOUND;

    return new Response(JSON.stringify({ message }), {
      status,
      headers: corsHeaders,
    });
  } catch (error) {
    errorLog({ title: "Rallies Function", error });

    const { status, message } = httpResponse.INTERNAL_SERVER_ERROR;
    return new Response(JSON.stringify({ message }), {
      status,
      headers: corsHeaders,
    });
  }
});
