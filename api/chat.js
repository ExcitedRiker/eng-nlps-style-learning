// Vercel Serverless Function - API代理
// 将前端请求转发到阿里云百炼API，密钥存在环境变量中

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: '只支持POST请求' });
    }

    const apiKey = process.env.ALIYUN_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'API密钥未配置' });
    }

    try {
        const { messages, model, stream } = req.body;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: '缺少messages参数' });
        }

        const endpoint = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';
        const useStream = stream !== false;

        const apiResponse = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: model || 'qwen-plus',
                messages,
                stream: useStream
            })
        });

        if (!apiResponse.ok) {
            const errText = await apiResponse.text();
            return res.status(apiResponse.status).json({
                error: `API请求失败: ${apiResponse.status}`,
                detail: errText
            });
        }

        if (useStream) {
            // 流式响应透传
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');

            const reader = apiResponse.body.getReader();
            const decoder = new TextDecoder();

            try {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    const chunk = decoder.decode(value, { stream: true });
                    res.write(chunk);
                }
            } catch (e) {
                // 客户端断开连接等情况
            } finally {
                res.end();
            }
        } else {
            // 非流式响应
            const data = await apiResponse.json();
            return res.status(200).json(data);
        }
    } catch (error) {
        return res.status(500).json({
            error: '服务器内部错误',
            detail: error.message
        });
    }
}
