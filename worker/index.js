// Freebuff Sites entrypoint: serves the Vite build output as a static SPA.
export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request)
    // SPA fallback for unknown paths (single-page app, no server routes).
    if (response.status === 404 && request.method === 'GET') {
      const url = new URL(request.url)
      if (!url.pathname.includes('.')) {
        return env.ASSETS.fetch(new Request(new URL('/index.html', url), request))
      }
    }
    return response
  },
}
