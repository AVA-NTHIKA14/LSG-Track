import { dbService } from './dbService';

export interface MessagePayload {
  recipientName: string;
  businessName: string;
  contactNumber: string; // Phone number string e.g. +91944xxxxxxx or 944xxxxxxx
  licenseId?: string;
  expiryDate?: string;
  channel: 'WhatsApp';
  templateLanguage: 'en' | 'ml';
  customText?: string;
}

export const whatsappService = {
  
  async sendMessage(payload: MessagePayload): Promise<{ success: boolean; message: string }> {
    const { recipientName, businessName, contactNumber, licenseId, expiryDate, templateLanguage, customText } = payload;
    
    // 1. Resolve message text
    let bodyText = '';
    if (customText) {
      bodyText = customText;
    } else {
      if (templateLanguage === 'ml') {
        bodyText = `ബഹുമാനപ്പെട്ട ${recipientName}, താങ്കളുടെ ${businessName} എന്ന വ്യാപാര സ്ഥാപനത്തിന്റെ ലൈസൻസ് ${licenseId ? '(' + licenseId + ')' : ''} ${expiryDate || 'ഉടൻ'} കാലാവധി പൂർത്തിയാകുന്നതാണ്. തുടർനടപടികളും പിഴയും ഒഴിവാക്കുന്നതിനായി ദയവായി കെ-സ്മാർട്ട് പോർട്ടൽ (K-SMART) വഴി ഉടൻ ലൈസൻസ് പുതുക്കേണ്ടതാണ്. - ഗ്രാമപഞ്ചായത്ത് ഓഫീസ്.`;
      } else {
        bodyText = `Dear ${recipientName}, trade license ${licenseId ? '(' + licenseId + ')' : ''} for ${businessName} is expiring on ${expiryDate || 'soon'}. To avoid statutory penalties, please apply for renewal on the K-SMART portal immediately. - Grama Panchayat Office.`;
      }
    }

    // 2. Format phone number for wa.me link (digits only, e.g., 919876543210)
    let cleanPhone = contactNumber.replace(/\D/g, '');
    if (cleanPhone.length === 10) {
      cleanPhone = `91${cleanPhone}`;
    }

    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(bodyText)}`;

    // 3. Open WhatsApp deep link
    if (typeof window !== 'undefined') {
      window.open(waUrl, '_blank');
    }

    // 4. Log communication event to Panchayat LocalStorage
    await dbService.addWhatsAppLog({
      recipientName,
      businessName,
      contactNumber,
      channel: 'WhatsApp',
      messageText: bodyText,
      status: 'sent'
    });

    return { 
      success: true, 
      message: `Opened wa.me link for ${recipientName} (${cleanPhone})` 
    };
  }
};
