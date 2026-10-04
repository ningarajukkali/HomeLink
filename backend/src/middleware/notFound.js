/**
 * 404 Route Not Found Middleware
 */
export function notFound(req, res, next) {
  const error = new Error(`Resource not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
}

export default notFound;
