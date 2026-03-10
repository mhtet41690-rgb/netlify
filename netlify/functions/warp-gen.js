const axios = require('axios');

exports.handler = async (event, context) => {
    // Android App ကနေ ပို့လာတဲ့ Public Key ကို ယူခြင်း (ရှိခဲ့လျှင်)
    let publicKey = "bmXOC+F1FxEMF9dyiK2H5/1SUtzH0JuVo51h2wPfgyo="; // Default Key
    if (event.body) {
        const body = JSON.parse(event.body);
        if (body.key) publicKey = body.key;
    }

    try {
        const response = await axios.post('https://api.cloudflareclient.com/v0a2158/reg', {
            key: publicKey,
            install_id: "",
            tos: new Date().toISOString(),
            model: "Android",
            type: "Android"
        }, {
            headers: { 'Content-Type': 'application/json', 'User-Agent': 'okhttp/3.12.1' }
        });

        return {
            statusCode: 200,
            body: JSON.stringify(response.data)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
