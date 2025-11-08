import { RatingsController } from "../../../controller/RatingsController.ts";
import { httpResponse } from "../../../lib/httpResponse.ts";
import { errorLog } from "../../../lib/log.ts";

export async function ratingsRouter({
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
  const ratingsController = new RatingsController(accessToken);

  if (!rallyId || isNaN(rallyId)) {
    const { status, message } = httpResponse.INVALID_ID;
    return new Response(JSON.stringify({ message }), {
      status,
      headers: corsHeaders,
    });
  }

  if (pathLength === 3 && method === "GET") {
    try {
      const data = await ratingsController.index(rallyId);
      const { status, message } = httpResponse.SUCCESS;

      return new Response(JSON.stringify({ message, data }), {
        status,
        headers: corsHeaders,
      });
    } catch (error) {
      errorLog({ title: "RatingsRouter - List", error });

      const { status, message } = httpResponse.INTERNAL_SERVER_ERROR;
      return new Response(JSON.stringify({ message }), {
        status,
        headers: corsHeaders,
      });
    }
  }

  if (pathLength === 3 && method === "POST") {
    try {
      const { spot_id, stars, memo } = await req.json();

      if (!spot_id) {
        const { status, message } = httpResponse.INVALID_ID;
        return new Response(
          JSON.stringify({ message }),
          {
            status,
            headers: corsHeaders,
          },
        );
      }

      const data = await ratingsController.create({
        rallyId,
        spotId: spot_id,
        stars: stars || 0,
        memo: memo || "",
      });

      const { status, message } = httpResponse.CREATED;

      return new Response(JSON.stringify({ message, data }), {
        status,
        headers: corsHeaders,
      });
    } catch (error) {
      errorLog({ title: "RatingsRouter - Create", error });

      const errorMessage = error instanceof Error
        ? error.message
        : String(error);

      if (errorMessage.includes("must be an integer between 0 and 5")) {
        const { status } = httpResponse.INVALID_ID;
        return new Response(
          JSON.stringify({
            message: "Stars must be an integer between 0 and 5",
          }),
          {
            status,
            headers: corsHeaders,
          },
        );
      }

      const { status, message } = httpResponse.INTERNAL_SERVER_ERROR;
      return new Response(JSON.stringify({ message }), {
        status,
        headers: corsHeaders,
      });
    }
  }

  if (pathLength === 4 && method === "GET" && spotId) {
    try {
      const data = await ratingsController.show(rallyId, spotId);

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
      errorLog({ title: "RatingsRouter - Show", error });

      const { status, message } = httpResponse.INTERNAL_SERVER_ERROR;
      return new Response(JSON.stringify({ message }), {
        status,
        headers: corsHeaders,
      });
    }
  }

  const { status, message } = httpResponse.INVALID_METHOD;
  return new Response(JSON.stringify({ message }), {
    status,
    headers: corsHeaders,
  });
}
