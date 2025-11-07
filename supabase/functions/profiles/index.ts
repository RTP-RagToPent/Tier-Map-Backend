import "@supabase/functions-js/edge-runtime.d.ts";

import { authenticate } from "../../infrastructure/supabase/auth.ts";
import { frontendBaseUrl } from "../../lib/config/env.ts";
import { httpResponse } from "../../lib/httpResponse.ts";
import { errorLog } from "../../lib/log.ts";
import { profilesRouter } from "./router/profiles.ts";

console.log("Profiles API Function!");

Deno.serve(async (req: Request) => {
  const corsHeaders: Record<string, string> = {
    "Access-Control-Allow-Origin": frontendBaseUrl,
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "GET, PATCH, OPTIONS",
    "Access-Control-Allow-Headers": "authorization, content-type",
  };

  try {
    const { url: reqUrl, method } = req;

    if (method === "OPTIONS") {
      const { status, message } = httpResponse.NO_CONTENT;
      return new Response(JSON.stringify({ message }), {
        status,
        headers: corsHeaders,
      });
    }

    const url = new URL(reqUrl);
    const pathname = url.pathname;
    const paths = pathname.split("/").filter((path) => path.length > 0);
    const pathLength = paths.length;

    if (pathLength < 1 || pathLength > 1) {
      const { status, message } = httpResponse.NOT_FOUND;
      return new Response(JSON.stringify({ status, message }), {
        status,
        headers: corsHeaders,
      });
    }

    const cookieHeader = req.headers.get("cookie");
    const authResult = await authenticate(cookieHeader);

    if (!authResult) {
      const { status, message } = httpResponse.UNAUTHORIZED;
      return new Response(JSON.stringify({ message }), {
        status,
        headers: corsHeaders,
      });
    }

    const { userId, accessToken } = authResult;

    try {
      if (pathLength === 1) {
        return await profilesRouter({
          req,
          userId,
          accessToken,
          method,
          pathLength,
          corsHeaders,
        });
      }
    } catch (error) {
      errorLog({ title: "Profiles API Error", error });
    }

    const { status, message: notFoundMessage } = httpResponse.NOT_FOUND;

    return new Response(JSON.stringify({ message: notFoundMessage }), {
      status,
      headers: corsHeaders,
    });
  } catch (error) {
    errorLog({ title: "Profiles Function", error });

    const { status, message } = httpResponse.INTERNAL_SERVER_ERROR;
    return new Response(JSON.stringify({ message }), {
      status,
      headers: corsHeaders,
    });
  }
});
