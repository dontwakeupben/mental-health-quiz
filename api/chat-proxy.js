export default async function handler(request, response) {
    if (request.method !== 'POST') {
        response.setHeader('Allow', 'POST');
        return response.status(405).json({ error: 'Only POST is supported.' });
    }

    const targetUrl = process.env.N8N_CHAT_WEBHOOK_URL;
    if (!targetUrl) {
        return response.status(500).json({ error: 'Missing N8N_CHAT_WEBHOOK_URL environment variable.' });
    }

    try {
        const payload = typeof request.body === 'string'
            ? request.body
            : JSON.stringify(request.body ?? {});

        const upstreamResponse = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: payload
        });

        const rawBody = await upstreamResponse.text();
        let parsedBody;
        try {
            parsedBody = rawBody ? JSON.parse(rawBody) : {};
        } catch {
            parsedBody = { raw: rawBody };
        }

        return response.status(upstreamResponse.status).json(parsedBody);
    } catch (error) {
        console.error('Vercel chat proxy error:', error);
        return response.status(500).json({ error: 'Proxy request failed. Check server logs for details.' });
    }
}
