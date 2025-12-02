// api/chat-proxy.js
export default async function handler(req, res) {
    // 1. Log that we received a request (helps debug)
    console.log("Proxy received request:", req.method);

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // 2. Define the n8n URL directly here to be safe for now
        // REPLACE THIS with your actual Railway URL
        const n8nUrl = "https://n8n-production-dbe3.up.railway.app/webhook/chat";

        console.log("Forwarding to n8n:", n8nUrl);

        const n8nResponse = await fetch(n8nUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(req.body),
        });

        // 3. Check if n8n itself failed
        if (!n8nResponse.ok) {
            const errorText = await n8nResponse.text();
            console.error("n8n Error Response:", errorText);
            throw new Error(`n8n responded with ${n8nResponse.status}: ${errorText}`);
        }

        const data = await n8nResponse.json();

        // 4. Send success back to frontend
        res.status(200).json(data);

    } catch (error) {
        // 5. Log the ACTUAL crash reason to Vercel logs
        console.error("PROXY CRASHED:", error);

        // Send a safe error to the frontend
        res.status(500).json({
            error: 'Internal Server Error',
            details: error.message
        });
    }
}