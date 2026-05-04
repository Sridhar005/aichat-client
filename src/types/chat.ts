export interface Message {
  id: string;
  chatId: string;
  sender: "user" | "ai";
  text: string;
}

export interface Chat {
  id: string;
  title: string;
}