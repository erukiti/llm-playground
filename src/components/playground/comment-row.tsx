import { FC } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Message } from "~/common/llm/types";
import { Button } from "~/components/ui/button";

type Props = {
  message: Message;
  setMessage: (message: Message) => void;
  remove: () => void;
};

export const CommentRow: FC<Props> = ({ message, setMessage, remove }) => {
  const setContent = (content: string) => {
    setMessage({
      ...message,
      content,
    });
  };

  return (
    <div className="flex items-center space-x-2 border-b-2">
      <div className="flex-1">
        <TextareaAutosize
          placeholder="コメントを残す"
          className="w-full resize-none overflow-hidden rounded-lg border-2 border-white p-4 focus:border-green-700"
          value={message.content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <Button onClick={remove} color="text" className="border-0">
        -
      </Button>
    </div>
  );
};
