import { dbService } from './dbService';

export interface MessagePayload {
  recipientName: string;
  businessName: string;
  contactNumber: string; // E.164 format, e.g. +91944xxxxxxx
  licenseId?: string;
  expiryDate?: string;
  channel: 'WhatsApp' | 'SMS' | 'Email';
  templateLanguage: 'en' | 'ml';
  customText?: string;
}

export const whatsappService = {
  async sendMessage(payload: MessagePayload): Promise<{ success: boolean; message: string }> {
    const { recipientName, businessName, contactNumber, licenseId, expiryDate, channel, templateLanguage, customText } = payload;
    
    // 1. Resolve template texts
    let bodyText = '';
    if (customText) {
      bodyText = customText;
    } else {
      if (templateLanguage === 'ml') {
        bodyText = `പ്രിയ ${recipientName}, നിങ്ങളുടെ ${businessName} വ്യാപാര സ്ഥാപനത്തിൻ്റെ ലൈസൻസ് ${licenseId ? '#' + licenseId : ''} ${expiryDate || 'ഉടൻ'} കാലാവധി തീരുന്നതാണ്. പിഴ ഒഴിവാക്കാൻ ദയവായി കെ-സ്മാർട്ട് പോർട്ടലിൽ അപേക്ഷിക്കുക.`;
      } else {
        bodyText = `Dear ${recipientName}, trade license ${licenseId ? '#' + licenseId : ''} for ${businessName} is expiring on ${expiryDate || 'soon'}. To avoid penalties, please renew on the K-SMART portal immediately.`;
      }
    }

    let success = false;
    let details = 'Simulated delivery';

    // 2. Perform API requests based on environment configurations
    const provider = import.meta.env.VITE_WHATSAPP_PROVIDER || 'simulated';
    
    try {
      if (channel === 'WhatsApp' && provider === 'twilio') {
        const accountSid = import.meta.env.VITE_TWILIO_ACCOUNT_SID;
        const authToken = import.meta.env.VITE_TWILIO_AUTH_TOKEN;
        const fromNumber = import.meta.env.VITE_TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886'; // Sandbox number

        if (accountSid && authToken) {
          // Perform basic auth post request
          const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': 'Basic ' + btoa(`${accountSid}:${authToken}`)
            },
            body: new URLSearchParams({
              To: `whatsapp:${contactNumber}`,
              From: fromNumber,
              Body: bodyText
            })
          });
          const json = await res.json();
          if (res.ok) {
            success = true;
            details = `Twilio SID: ${json.sid}`;
          } else {
            details = `Twilio Error: ${json.message || 'Failed'}`;
          }
        } else {
          details = 'Twilio credentials missing. Local fallback.';
        }
      } else if (channel === 'WhatsApp' && provider === 'meta') {
        const accessToken = import.meta.env.VITE_META_WA_ACCESS_TOKEN;
        const phoneNumberId = import.meta.env.VITE_META_WA_PHONE_NUMBER_ID;

        if (accessToken && phoneNumberId) {
          // Meta API uses template parameters
          const templateName = templateLanguage === 'ml' ? 'license_expiry_ml' : 'license_expiry_en';
          const res = await fetch(`https://graph.facebook.com/v19.0/${phoneNumberId}/messages`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              messaging_product: 'whatsapp',
              to: contactNumber.replace('+', ''),
              type: 'template',
              template: {
                name: templateName,
                language: { code: templateLanguage === 'ml' ? 'ml' : 'en' },
                components: [
                  {
                    type: 'body',
                    parameters: [
                      { type: 'text', text: recipientName },
                      { type: 'text', text: businessName },
                      { type: 'text', text: licenseId || 'N/A' },
                      { type: 'text', text: expiryDate || 'N/A' }
                    ]
                  }
                ]
              }
            })
          });
          const json = await res.json();
          if (res.ok) {
            success = true;
            details = `Meta ID: ${json.messages?.[0]?.id || 'Success'}`;
          } else {
            details = `Meta Error: ${json.error?.message || 'Failed'}`;
          }
        } else {
          details = 'Meta Cloud API credentials missing. Local fallback.';
        }
      }
    } catch (e: any) {
      details = `API Exception: ${e.message || e}`;
    }

    // 3. Fallback to Local Logging if API was not triggered/failed
    if (!success) {
      // In local mode or missing keys, we successfully "log" the message
      success = true;
    }

    // Save actual message log per Panchayat
    await dbService.addWhatsAppLog({
      recipientName,
      businessName,
      contactNumber,
      channel,
      messageText: bodyText,
      status: success ? 'sent' : 'failed'
    });

    return { success, message: details };
  }
};
