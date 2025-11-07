import { ProfilesController } from "../../../controller/ProfilesController.ts";
import { httpResponse } from "../../../lib/httpResponse.ts";
import { errorLog } from "../../../lib/log.ts";

export async function profilesRouter({
  req,
  userId,
  accessToken,
  method,
  pathLength,
  corsHeaders,
}: {
  req: Request;
  userId: string;
  accessToken: string;
  method: string;
  pathLength: number;
  corsHeaders: Record<string, string>;
}): Promise<Response> {
  const profilesController = new ProfilesController(accessToken);

  if (pathLength === 1) {
    if (method === "GET") {
      try {
        const data = await profilesController.show(userId);

        if (!data) {
          const { status, message } = httpResponse.NOT_FOUND;
          return new Response(JSON.stringify({ message }), {
            status,
            headers: corsHeaders,
          });
        }

        const { status, message } = httpResponse.SUCCESS;

        return new Response(JSON.stringify({ message, data }), {
          status,
          headers: corsHeaders,
        });
      } catch (error) {
        errorLog({ title: "ProfilesRouter GET", error });

        const { status, message } = httpResponse.INTERNAL_SERVER_ERROR;
        return new Response(JSON.stringify({ message, error: String(error) }), {
          status,
          headers: corsHeaders,
        });
      }
    } else if (method === "PATCH") {
      try {
        const { name } = await req.json();
        const data = await profilesController.update({
          userId,
          name,
        });
        const { status, message } = httpResponse.SUCCESS;

        return new Response(JSON.stringify({ message, data }), {
          status,
          headers: corsHeaders,
        });
      } catch (error) {
        errorLog({ title: "ProfilesRouter PATCH", error });

        const { status, message } = httpResponse.INTERNAL_SERVER_ERROR;
        return new Response(JSON.stringify({ message }), {
          status,
          headers: corsHeaders,
        });
      }
    }
  }

  const { status, message } = httpResponse.NOT_FOUND;
  return new Response(JSON.stringify({ message }), {
    status,
    headers: corsHeaders,
  });
}
