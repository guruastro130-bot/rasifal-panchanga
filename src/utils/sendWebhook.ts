const MAKE_WEBHOOK_URL = 'https://hook.us2.make.com/9aakku13k7jg7fzb1ezuo6zp7aj6ipak';

export async function sendPanchangToMakeWebhook(payloadData?: any) {
  const payload = payloadData || {
    event: 'daily_panchang_and_rashi',
    timestamp: new Date().toISOString(),
    message: 'आजको पञ्चाङ्ग तथा राशिफल'
  };

  try {
    const response = await fetch(MAKE_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/plain, application/json, */*'
      },
      body: JSON.stringify(payload)
    });

    // Make.com बाट आउने 'Accepted' टेक्स्टलाई सुरक्षित रूपमा पढ्ने
    const rawText = await response.text();

    return {
      success: response.ok,
      responseMessage: rawText || 'Accepted'
    };
  } catch (error: any) {
    return {
      success: false,
      responseMessage: error.message
    };
  }
}
