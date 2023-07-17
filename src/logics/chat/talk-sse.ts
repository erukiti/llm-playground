import { LLMFunction, Message } from "~/common/llm/types";

type Param = {
  onMessage: (text: string) => void;
  onClose: (message: Message) => void;
  onError: (text: string) => void;
  onFunctionCall: (name: string, args: any) => void;
  onFunctionCalling: (name: string, args: any) => void;
  abortSignal: AbortSignal;
  messages: Message[];
  functions: LLMFunction[];
  model: string;
};

export const talkChat = async (param: Param) => {
  const {
    onMessage,
    onClose,
    onError,
    onFunctionCall,
    onFunctionCalling,
    abortSignal: signal,
    messages,
    functions,
    model,
  } = param;

  const body = JSON.stringify({ messages, functions, model });

  const res = await fetch("/api/playground", {
    method: "POST",
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
    body,
    // credentials: "include", // クッキーを送信して認証を共有するために必要
    signal,
  });

  if (!res.ok || !res.body) {
    onError("Network error");
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let isDone = false;
  try {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      decoder
        .decode(value)
        .split("\n\n")
        .filter((text) => text.length > 0)
        .forEach((text) => {
          try {
            const data = JSON.parse(text.replace(/^data: /, ""));
            if ("content" in data && data.content) {
              onMessage(data.content);
            }
            if ("function_call" in data) {
              onFunctionCall(data.function_call.name, data.function_call.args);
            }
            if ("function_calling" in data) {
              onFunctionCalling(
                data.function_calling.name,
                data.function_calling.args
              );
            }
            if ("stop" in data) {
              console.log(data);
              onClose(data.message);
              isDone = true;
            }
            if ("error" in data) {
              onError(data.error.message);
            }
          } catch (e) {
            // TODO: 可能なら server の SSE で、utf-8的にinvalid なら
            //       送信しないようにする

            if (e instanceof SyntaxError) {
              // NOTE: utf-8 的に中途半端な場合にこれが生じることがある
              //       JSON.parse の error に関しては無視せざるを得ない
              //       しかもなぜかserver側では特にこの問題は生じない
              return;
            }

            console.log("unknown error", e);
            console.log(decoder.decode(value));
            // onError("通信エラーが発生しました");
          }
        });
    }
  } catch (e) {
    console.error("unknown error", e);
    reader.releaseLock();
    res.body.cancel();
  } finally {
    reader.releaseLock();
  }

  if (!isDone) {
    onError(
      "ただいま大変混み合っております。少し時間を置いてから再度お試しください。"
    );
    console.error(
      new Date(),
      "通信エラーが発生しました（通信が途中で切断されました）"
    );
  }
};
