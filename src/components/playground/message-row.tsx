import { ChangeEvent, FC, useCallback } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Message, Role } from "~/common/llm/types";
import { CommentRow } from "./comment-row";
import { RoleSelect } from "./role-select";
import { Button } from "~/components/ui/button";
import { Textfield } from "~/components/ui/textfield";

type Props = {
  message: Message;
  setMessage: (message: Message) => void;
  remove: () => void;
};

export const MessageRow: FC<Props> = ({ message, setMessage, remove }) => {
  const setRole = useCallback(
    (role: Role) => {
      setMessage({
        ...message,
        role,
      });
    },
    [message, setMessage]
  );

  const setContent = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      setMessage({
        ...message,
        content: e.target.value,
      });
    },
    [message, setMessage]
  );

  const setFunctionName = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setMessage({
        ...message,
        function_call: {
          name: e.target.value,
          arguments: "",
        },
      });
    },
    [message, setMessage]
  );

  const setFunctionArguments = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      setMessage({
        ...message,
        function_call: {
          name: message.function_call?.name || "",
          arguments: e.target.value,
        },
      });
    },
    [message, setMessage]
  );

  if (message.role === "comment") {
    return (
      <CommentRow message={message} setMessage={setMessage} remove={remove} />
    );
  }

  return (
    <div className="flex flex-col gap-2 border-b-2">
      <div className="flex items-center">
        <RoleSelect className="w-40" role={message.role} changeRole={setRole} />
        <TextareaAutosize
          className="w-full resize-none overflow-hidden rounded-lg border-2 border-white p-4 focus:border-green-700"
          placeholder="enter content"
          value={message.content}
          onChange={setContent}
        />
        <Button color="text" className="border-0" onClick={remove}>
          -
        </Button>
      </div>
      <div className="my-2 flex items-center gap-2">
        <Textfield
          placeholder="function name"
          className="rounded-lg border-2 border-white p-4 font-mono focus:border-green-700"
          value={message.function_call?.name || ""}
          onChange={setFunctionName}
        />
        <TextareaAutosize
          className="w-full resize-none overflow-hidden rounded-lg border-2 border-white p-4 font-mono focus:border-green-700"
          placeholder="arguments"
          value={message.function_call?.arguments || ""}
          onChange={setFunctionArguments}
        />
      </div>
    </div>
  );
};
