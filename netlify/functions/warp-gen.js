const axios = require('axios');

exports.handler = async (event, context) => {
    // Android App ထံမှ Public Key ကို လက်ခံခြင်း
    let publicKey = "";
    
    if (event.body) {
        try {
            const body = JSON.parse(event.body);
            publicKey = body.key;
        } catch (e) {
            // JSON parse မရလျှင် error ပြန်မည်
            return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON body" }) };
        }
    }

    // Public Key မပါလာလျှင် default တစ်ခု သတ်မှတ်ပေးထားပါ (စမ်းသပ်ရန်အတွက်သာ)
    if (!publicKey) {
        publicKey = "bmXOC+F1FxEMF9dyiK2H5/1SUtzH0JuVo51h2wPfgyo="; 
    }

    try {
        const response = await axios({
            method: 'post',
            url: 'https://api.cloudflareclient.com/v0a2158/reg',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'okhttp/4.12.0', // Standard User-Agent သုံးထားပါသည်
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
                "Access-Control-Allow-Origin": "*", // App မှ လှမ်းခေါ်နိုင်ရန်
                "Content-Type": "application/json"
            },
            body: JSON.stringify(response.data)
        };

    } catch (error) {
        // Cloudflare ထံမှ ပြန်လာသော Error အသေးစိတ်ကို ကြည့်ရန်
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
