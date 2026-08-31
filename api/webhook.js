export default async function handler(req, res) {
  // यो कोडले Vercel बाट Make.com मा सुरक्षित तरिकाले डाटा पठाइदिन्छ
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const makeWebhookUrl = "https://hook.us2.make.com/9aakku13k7jg7fzb1ezuo6zp7aj6ipak";
    
    const response = await fetch(makeWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      throw new Error(`Make.com error: ${response.status}`);
    }

    return res.status(200).json({ success: true, message: 'Successfully sent to Make.com' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
