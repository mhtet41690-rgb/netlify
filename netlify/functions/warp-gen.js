const axios = require('axios');
const crypto = require('crypto');

exports.handler = async (event, context) => {
    // ၁။ WireGuard ပုံစံတူ Public Key တစ်ခုကို Generate လုပ်ခြင်း
    // (မှတ်ချက် - App ကနေ ပို့လာရင်တော့ App Key ကို သုံးပါမည်)
    let publicKey = "";
    
    if (event.body) {
        try {
            const body = JSON.parse(event.body);
            publicKey = body.key;
        } catch (e) {
            // Error handling
        }
    }

    // Public Key မပါလာလျှင် သို့မဟုတ် Website ကနေ နှိပ်လျှင် Key အသစ်တစ်ခု ဆောက်ပေးမည်
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

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(response.data)
        };

    } catch (error) {
        const errorData = error.response ? error.response.data : error.message;
        return {
            statusCode: error.response ? error.response.status : 500,
            body: JSON.stringify({
                error: "Cloudflare API Error",
                details: errorData
            })
        };
    }
};
