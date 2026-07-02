export const successResponse = (data, statusCode = 200) => ({
  success: true,
  data,
  statusCode
});

export const errorResponse = (message, statusCode = 500) => ({
  success: false,
  error: message,
  statusCode
});
