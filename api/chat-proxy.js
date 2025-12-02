// api/chat-proxy.js
export default async function handler(req, res) {
    // 1. SETUP: Enable CORS so your frontend can call this
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    // 2. PREFLIGHT: Handle browser security checks
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // 3. VALIDATION: Ensure it's a POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed. Use POST.' });
    }

    try {
        // 4. LOGGING: Print what we received (Check Vercel Logs for this!)
        console.log("------------------------------------------------");
        console.log("Proxy received request body:", JSON.stringify(req.body));

        // HARDCODE YOUR URL HERE FOR TESTING
        // Make sure there are no spaces at the end!
        const n8nUrl = "https://n8n-production-dbe3.up.railway.app/webhook/chat";

        // 5. THE REQUEST: Send to n8n
        const response = await fetch(n8nUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(req.body),
        });

        // 6. ERROR HANDLING: Check if n8n failed
        if (!response.ok) {
            const errorText = await response.text();
            console.error("n8n Returned Error:", response.status, errorText);
            throw new Error(`n8n Error ${response.status}: ${errorText}`);
        }

        // 7. SUCCESS: Return data to frontend
        const data = await response.json();
        console.log("n8n Success:", JSON.stringify(data));
        res.status(200).json(data);

    } catch (error) {
        // 8. FATAL CRASH: Log the specific reason
        console.error("CRITICAL ERROR IN PROXY:", error.message);
        console.error(error.stack);

        res.status(500).json({
            error: 'Proxy Error',
            details: error.message
        });
    }
}