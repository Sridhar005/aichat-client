import { api } from "../utils/axios";

export const sendMessage = async (
  chatId: string | null,
  text: string
) => {
  const payload: {
    message: string;
    chatId?: string;
  } = {
    message: text,
  };

  if (chatId) {
    payload.chatId = chatId;
  }
  else{
    payload.chatId = chatId ?? crypto.randomUUID();
  }


  const res = await api.post("/chat/send", payload, {
  });

  return res.data;
};