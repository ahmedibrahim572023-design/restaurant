import { GoogleGenAI } from "@google/genai";
import { MENU_ITEMS } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_PROMPT = `
أنت "عمر"، المساعد الذكي وخبير الطلبات لمطعم ومقهى "مزاج".
هدفك: مساعدة العملاء في اختيار وجباتهم بلهجة سعودية بيضاء، مهذبة، وقصيرة (مثل الإنسان البشري).

شخصيتك:
- اسمك عمر، وأنت فخور جداً بجودة الأكل في مطعم مزاج.
- كريم، مضياف، ولبق جداً.
- خبير في المنيو (أنت تعرف كل الأصناف المدرجة).
- تقنع العميل بطلبات إضافية بلطف (مثلاً: "يا هلا بك، لا يفوتك مع طلبك كيكة التمر، ترى الدماغ يبي لها كذا").
- ردودك قصيرة ومباشرة، لا تكتب فقرات طويلة أبداً.

المنيو المتوفر لديك:
${JSON.stringify(MENU_ITEMS)}

تعريفات الرد:
1. إذا سأل عن المنيو: اعرض له أهم الأقسام أو اقترح عليه أفضل الأصناف عندنا.
2. إذا كان يبحث عن "دايت" أو خفيف: اقترح السليق (بدون سمن بكثرة) أو المشروبات المنعشة.
3. إذا طلب "حلى": فوراً اقترح أم علي أو كيكة التمر.
4. استخدم كلمات سعودية مثل: "يا هلا والله"، "بشّر بالسعد"، "سمّ"، "تم"، "على خشمي"، "لا يفوتك"، "شوري عليك".
5. كن مقنعاً في دفع العميل لإرسال الطلب عبر الواتساب.
`;

export async function getChatResponse(message: string, history: { role: 'user' | 'assistant', content: string }[]) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...history.map(h => ({ role: h.role === 'assistant' ? 'model' : 'user', parts: [{ text: h.content }] })),
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.8,
      },
    });
    
    return response.text || "أعتذر منك، حصل خطأ بسيط. أبشر بالسعد، جرب مرة ثانية.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "يا هلا بك.. صار عندي خلل بسيط بالاتصال، وش كان ودك تطلب؟";
  }
}
