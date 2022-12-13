export interface ContexerDialogParams {
  baseUrl: string;
  clientId: string;
}

export interface OpenMessage {
  messageType: "open";
}

export interface CloseMessage {
  messageType: "close";
}


export interface ErrorMessage {
  messageType: "error";
}

export type ContexerMessage =
  | OpenMessage
  | CloseMessage
  | ErrorMessage;
