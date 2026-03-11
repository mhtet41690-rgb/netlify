const axios = require('axios');
const crypto = require('crypto');

exports.handler = async (event, context) => {
    let publicKey = "";
    
    if (event.body) {
        try {
            const body = JSON.parse(event.body);
            publicKey = body.key;
        } catch (e) {}
    }

    if (!publicKey) {
        publicKey = crypto.randomBytes(32).toString('base64');
    }

    try {
        const response = await axios({
            method: 'post',
            url: 'https://api.cloudflareclient.com/v0a2158/reg',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'okhttp/4.12.0',
            },
            data: {
                key: publicKey,
                install_id: "",
                fcm_token: "",
                tos: new Date().toISOString(),
                model: "Android",
                type: "Android",
                locale: "en_US"
            }
        });

        // --- ဤနေရာတွင် Endpoint ကို စိတ်ကြိုက်ပြင်ဆင်ပါ ---
        const resultData = response.data;
        
        // Cloudflare ကပေးတဲ့ host နေရာမှာ မိမိစိတ်ကြိုက် IP:Port ကို အစားထိုးလိုက်ခြင်း
        const customEndpoint = "162.159.192.1:500"; 
        
        if (resultData.config && resultData.config.peers && resultData.config.peers[0]) {
            resultData.config.peers[0].endpoint.host = customEndpoint;
            resultData.config.peers[0].endpoint.v4 = customEndpoint;
        }
        // -------------------------------------------

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(resultData)
        };

    } catch (error) {
        const errorData = error.response ? error.response.data : error.message;
        return {
            statusCode: error.response ? error.response.status : 500,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({
                error: "Cloudflare API Error",
                details: errorData
            })
        };
    }
};
