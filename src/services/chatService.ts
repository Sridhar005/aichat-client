import { api } from "../utils/axios";

export interface SendMessageResponse {
  reply: string;
}

export const sendMessage = async (chatId: string, message: string) => {
  const res = await api.post("/chat/send", {
    chatId,
    message,
  });

  return res.data;
};