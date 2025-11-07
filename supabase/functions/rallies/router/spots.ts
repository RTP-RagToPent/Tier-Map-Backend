import { RallySpotsController } from "../../../controller/RallySpotsController.ts";
import { httpResponse } from "../../../lib/httpResponse.ts";
import { errorLog } from "../../../lib/log.ts";

export async function rallySpotsRouter({
  req,
  rallyId,
  spotId,
  accessToken,
  method,
  pathLength,
  corsHeaders,
}: {
  req: Request;
  rallyId: number;
  spotId?: string;
  accessToken: string;
  method: string;
  pathLength: number;
  corsHeaders: Record<string, string>;
}): Promise<Response> {
  const rallySpotsController = new RallySpotsController(accessToken);

  if (pathLength === 3) {
    if (method === "GET") {
      try {
        const data = await rallySpotsController.list({ rallyId });
        const { status, message } = httpResponse.SUCCESS;

        return new Response(JSON.stringify({ message, data }), {
          status,
          headers: corsHeaders,
        });
      } catch (error) {
        errorLog({ title: "RallySpotsRouter", error });

        const { status, message } = httpResponse.INTERNAL_SERVER_ERROR;
        return new Response(JSON.stringify({ message, error: String(error) }), {
          status,
          headers: corsHeaders,
        });
      }
    } else if (method === "POST") {
      try {
        const { spots } = await req.json();
        const data = await rallySpotsController.create({ rallyId, spots });
        const { status, message } = httpResponse.CREATED;

        return new Response(JSON.stringify({ message, data }), {
          status,
          headers: corsHeaders,
        });
      } catch (error) {
        errorLog({ title: "RallySpotsRouter", error });

        const { status, message } = httpResponse.INTERNAL_SERVER_ERROR;
        return new Response(JSON.stringify({ message }), {
          status,
          headers: corsHeaders,
        });
      }
    }
  } else if (pathLength === 4) {
    if (!spotId) {
      const { status, message } = httpResponse.INVALID_ID;

      return new Response(JSON.stringify({ message }), {
        status,
        headers: corsHeaders,
      });
    }

    if (method === "GET") {
      try {
        const data = await rallySpotsController.show({ rallyId, spotId });

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
        errorLog({ title: "RallySpotsRouter", error });

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
