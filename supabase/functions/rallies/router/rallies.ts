import { RalliesController } from "../../../controller/RalliesController.ts";
import { httpResponse } from "../../../lib/httpResponse.ts";
import { errorLog } from "../../../lib/log.ts";

export async function ralliesRouter({
  req,
  rallyId,
  profileId,
  accessToken,
  method,
  pathLength,
  corsHeaders,
}: {
  req: Request;
  rallyId?: number;
  profileId: number;
  accessToken: string;
  method: string;
  pathLength: number;
  corsHeaders: Record<string, string>;
}): Promise<Response> {
  const ralliesController = new RalliesController(accessToken);

  if (pathLength === 1) {
    if (method === "GET") {
      try {
        const data = await ralliesController.index({ profileId });
        const { status, message } = httpResponse.SUCCESS;

        return new Response(JSON.stringify({ message, data }), {
          status,
          headers: corsHeaders,
        });
      } catch (error) {
        errorLog({ title: "RalliesRouter", error });

        const { status, message } = httpResponse.INTERNAL_SERVER_ERROR;
        return new Response(JSON.stringify({ message, error: String(error) }), {
          status,
          headers: corsHeaders,
        });
      }
    } else if (method === "POST") {
      try {
        const { name, genre } = await req.json();
        const data = await ralliesController.create({ name, genre, profileId });
        const { status, message } = httpResponse.CREATED;

        return new Response(JSON.stringify({ message, data }), {
          status,
          headers: corsHeaders,
        });
      } catch (error) {
        errorLog({ title: "RalliesRouter", error });

        const { status, message } = httpResponse.INTERNAL_SERVER_ERROR;
        return new Response(JSON.stringify({ message }), {
          status,
          headers: corsHeaders,
        });
      }
    }
  } else if (pathLength === 2) {
    if (!rallyId || isNaN(rallyId)) {
      const { status, message } = httpResponse.INVALID_ID;

      return new Response(JSON.stringify({ message }), {
        status,
        headers: corsHeaders,
      });
    }

    if (method === "GET") {
      try {
        const data = await ralliesController.show(rallyId);

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
        errorLog({ title: "RalliesRouter", error });

        const { status, message } = httpResponse.INTERNAL_SERVER_ERROR;
        return new Response(JSON.stringify({ message }), {
          status,
          headers: corsHeaders,
        });
      }
    } else if (method === "PATCH") {
      try {
        const { name, genre } = await req.json();
        const data = await ralliesController.update({
          id: rallyId,
          name,
          genre,
        });
        const { status, message } = httpResponse.SUCCESS;

        return new Response(JSON.stringify({ message, data }), {
          status,
          headers: corsHeaders,
        });
      } catch (error) {
        errorLog({ title: "RalliesRouter", error });

        const { status, message } = httpResponse.INTERNAL_SERVER_ERROR;
        return new Response(JSON.stringify({ message }), {
          status,
          headers: corsHeaders,
        });
      }
    } else if (method === "DELETE") {
      try {
        if (!rallyId || isNaN(rallyId)) {
          const { status, message } = httpResponse.INVALID_ID;
          return new Response(JSON.stringify({ message }), {
            status,
            headers: corsHeaders,
          });
        }

        await ralliesController.delete(rallyId);
        const { status } = httpResponse.NO_CONTENT;

        return new Response(null, {
          status,
          headers: corsHeaders,
        });
      } catch (error) {
        errorLog({ title: "RalliesRouter", error });

        const { status, message } = httpResponse.INTERNAL_SERVER_ERROR;
        return new Response(JSON.stringify({ message }), {
          status,
          headers: corsHeaders,
        });
      }
    }
  }

  const { status, message } = httpResponse.INVALID_METHOD;
  return new Response(JSON.stringify({ message }), {
    status,
    headers: corsHeaders,
  });
}
