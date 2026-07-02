import { z } from 'zod';

export const validate = (schema, source = 'body') => (req, res, next) => {
  try {
    const target = req[source];
    const parsed = schema.parse(target);
    req[source] = parsed;
    return next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Datos inválidos',
        details: error.issues.map((issue) => ({ field: issue.path.join('.'), message: issue.message }))
      });
    }

    return next(error);
  }
};
