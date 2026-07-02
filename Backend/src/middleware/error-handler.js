export const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err?.name === 'ZodError') {
    return res.status(400).json({
      success: false,
      error: 'Datos inválidos',
      details: err.issues?.map((issue) => ({ field: issue.path.join('.'), message: issue.message })) || []
    });
  }

  const statusCode = err?.statusCode || 500;
  const message = err?.message || 'Error interno del servidor';

  if (process.env.NODE_ENV === 'production') {
    return res.status(statusCode).json({ success: false, error: message });
  }

  return res.status(statusCode).json({ success: false, error: message, stack: err?.stack });
};
