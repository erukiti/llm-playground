import { useRouter } from "next/router";
import { FC, useCallback, useState } from "react";
import { Message } from "~/common/llm/types";
import { MessageRow } from "~/components/playground/message-row";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Textfield } from "~/components/ui/textfield";
import { talkChat } from "~/logics/chat";
import { api } from "~/utils/api";

type Props = {
  initialMessages?: Message[];
  initialFunctions?: string;
  initialModel?: string;
};

export const Playground: FC<Props> = ({
  initialFunctions = "",
  initialMessages = [],
  initialModel = "gpt-3.5-turbo",
}) => {
  const router = useRouter();
  const [model, setModel] = useState(initialModel);
  const [functions, setFunctions] = useState<string>(initialFunctions);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [liveChat, setLiveChat] = useState("");
  const [liveFunction, setLiveFunction] = useState<{
    name: string;
    args: string;
  } | null>(null);

  const save = api.playground.save.useMutation();
  const onClickSave = useCallback(async () => {
    const res = await save.mutateAsync({
      model,
      functions,
      messages,
    });
    console.log(res.id);
    router.push(`/${res.id}`);
  }, [model, functions, messages]);

  const talkMessage = useCallback(() => {
    const abortController = new AbortController();

    talkChat({
      onMessage: (text) => {
        setLiveChat(text);
        //
      },
      onClose: (message) => {
        setLiveChat("");
        setMessages((prev) => [...prev, message]);
        //
      },
      onError: (text) => {
        console.log("error", text);
        //
      },
      onFunctionCall: (name, args) => {
        setLiveFunction(null);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            function_call: {
              name,
              arguments: args,
            },
          },
        ]);
        console.log("function call", name, args);
        //
      },
      onFunctionCalling: (name, args) => {
        setLiveFunction({
          name,
          args,
        });
      },
      abortSignal: abortController.signal,
      model,
      messages,
      functions: functions ? JSON.parse(functions) : undefined,
    });
  }, [messages, model, functions]);

  const addMessage = useCallback(() => {
    setMessages((prev) => {
      const lastRole = prev[prev.length - 1]?.role;
      const role = lastRole === "user" ? "assistant" : "user";

      return [
        ...prev,
        {
          role,
          content: "",
        },
      ];
    });
  }, []);

  const addComment = useCallback(() => {
    setMessages((prev) => {
      return [
        ...prev,
        {
          role: "comment",
          content: "",
        },
      ];
    });
  }, []);

  return (
    <div className="h-screen w-screen">
      <div className="m-10 flex items-center gap-5">
        <div className="text-xl">Playground</div>
        <Textfield
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="focus:border-green-700"
        />
        <Button onClick={talkMessage}>Talk</Button>
        <Button onClick={onClickSave} color="secondary">
          Save
        </Button>
      </div>
      <div className="mx-10 flex h-full justify-between gap-10">
        <div className="h-full w-[40%]">
          <Textarea
            className="h-[75%] w-full resize-none font-mono focus:border-green-700"
            value={functions}
            placeholder="functions"
            onChange={(e) => setFunctions(e.target.value)}
          />
        </div>
        <div className="flex w-[59%] flex-col gap-5">
          {messages.map((message, i) => {
            const setMessage = (message: Message) => {
              setMessages((prev) => {
                const next = [...prev];
                next[i] = message;
                return next;
              });
            };
            const remove = () => {
              setMessages((prev) => {
                const next = [...prev];
                next.splice(i, 1);
                return next;
              });
            };
            return (
              <MessageRow
                key={i}
                message={message}
                setMessage={setMessage}
                remove={remove}
              />
            );
          })}
          {!!liveChat && (
            <MessageRow
              message={{ role: "assistant", content: liveChat }}
              setMessage={() => {}}
              remove={() => {}}
            />
          )}
          {!!liveFunction && (
            <MessageRow
              message={{
                role: "assistant",
                function_call: {
                  name: liveFunction.name,
                  arguments: liveFunction.args,
                },
              }}
              setMessage={() => {}}
              remove={() => {}}
            />
          )}

          <div className="mt-5 flex gap-10">
            <Button onClick={addMessage} color="text">
              Add Message
            </Button>
            <Button onClick={addComment} color="text">
              Add Comment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
