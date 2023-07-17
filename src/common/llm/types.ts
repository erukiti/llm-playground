export type Context = {
  openaiApiKey: string;
  isVerbose: boolean;
};

export type Role = "user" | "system" | "assistant" | "function" | "comment";

// Note:
// OpenAI Chat Completion API の Role に `comment` が追加されないことを願う
// `comment` は、Playground 利用者がコメントを残すために利用する

export type Message = {
  role: Role;
  content?: string;
  function_call?: {
    name: string;
    arguments: string;
  };
};

type Parameter =
  | {
      type: "string" | "number" | "boolean" | "array";
      description: string;
    }
  | {
      type: "object";
      description: string;
      properties: {
        [key: string]: Parameter;
      };
      required: string[];
    };

// Note: Function という型はすでに標準であることに注意
export type LLMFunction = {
  name: string;
  description: string;
  parameters: Parameter;
};
