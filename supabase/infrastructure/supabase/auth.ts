import { createSupabaseClient } from "./client.ts";

function extractAccessToken(cookieHeader: string): string | null {
  const cookies = cookieHeader.split(";");
  for (const cookie of cookies) {
    const [key, value] = cookie.trim().split("=");
    if (key === "sb-access-token") {
      return value;
    }
  }
  return null;
}

export async function authenticate(
  cookieHeader: string | null,
): Promise<{ userId: string; accessToken: string } | null> {
  if (!cookieHeader) {
    return null;
  }

  const accessToken = extractAccessToken(cookieHeader);
  if (!accessToken) {
    return null;
  }

  const client = createSupabaseClient(accessToken);

  const { data: { user }, error: authError } = await client.auth.getUser(
    accessToken,
  );

  if (authError || !user) {
    return null;
  }

  return { userId: user.id, accessToken };
}
