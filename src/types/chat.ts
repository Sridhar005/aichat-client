export interface Message {
  id: string;
  chatId: string;
  sender: "user" | "ai";
  text: string;
  thinking?: boolean
}

export interface Chat {
  id: string;
  title: string;
}