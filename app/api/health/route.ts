export async function GET() {
  return Response.json({
    status: 'ok',
    service: 'elviajero',
    environment: process.env.APP_ENV || process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  })
}
