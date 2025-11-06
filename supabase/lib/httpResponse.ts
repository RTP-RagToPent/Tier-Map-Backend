export const httpResponse = {
  SUCCESS: { status: 200, message: "Success" },
  CREATED: { status: 201, message: "Resource created successfully" },
  NO_CONTENT: { status: 204, message: "No content" },
  INVALID_ID: { status: 400, message: "Invalid ID" },
  UNAUTHORIZED: { status: 401, message: "Unauthorized" },
  FORBIDDEN: { status: 403, message: "Forbidden" },
  NOT_FOUND: { status: 404, message: "Resource not found" },
  INVALID_METHOD: { status: 405, message: "Invalid method" },
  INTERNAL_SERVER_ERROR: { status: 500, message: "Internal server error" },
};
