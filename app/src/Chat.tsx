import { FormEvent, useCallback, useReducer } from "react";

type Message = {
  text: string;
  from: "user" | "bot";
  timestamp: number;
};

type State = {
  input?: string;
  isLoading?: boolean;
  messages: Message[];
};

type Action =
  | {
      type: "ADD_MESSAGE";
      payload: Message;
    }
  | {
      type: "NEW_TOKEN";
      payload: {
        timestamp: number;
        token: string;
      };
    }
  | {
      type: "SET_INPUT";
      payload: string;
    }
  | {
      type: "SET_IS_LOADING";
      payload: boolean;
    };

function reducer(state: State, action: Action) {
  console.log("action", action);
  switch (action.type) {
    case "ADD_MESSAGE": {
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    }
    case "NEW_TOKEN": {
      const { payload } = action;
      const index = state.messages.findIndex(
        (m) => m.timestamp === payload.timestamp
      );
      if (index === -1) return state;
      const message = state.messages[index];
      const newMessage: Message = {
        ...message,
        text: message.text + payload.token,
      };
      const newMessages = [...state.messages];
      newMessages[index] = newMessage;
      return {
        ...state,
        messages: newMessages,
      };
    }
    case "SET_INPUT": {
      return {
        ...state,
        input: action.payload,
      };
    }
    case "SET_IS_LOADING": {
      return {
        ...state,
        isLoading: action.payload,
      };
    }
    default:
      return state;
  }
}

async function* sendMessage(message: string) {
  const url = new URL("/chat", "http://localhost:4000");
  url.searchParams.append("message", message);

  const response = await fetch(url);
  const reader = response.body?.getReader();
  if (!reader) throw new Error("No reader");

  while (true) {
    const { done, value } = await reader.read();
    yield new TextDecoder("utf-8").decode(value);
    if (done) break;
  }
}

export default function Chat() {
  const [{ input = "", isLoading = false, messages = [] }, dispatch] =
    useReducer(reducer, {
      messages: [],
    });

  const handleChange = useCallback(
    (e: FormEvent<HTMLInputElement>) => {
      dispatch({ type: "SET_INPUT", payload: e.currentTarget.value });
    },
    [dispatch]
  );

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      const userMessage: Message = {
        text: input.trim(),
        from: "user",
        timestamp: Date.now(),
      };
      if (!userMessage.text) return;
      dispatch({ type: "ADD_MESSAGE", payload: userMessage });
      try {
        const botMessage: Message = {
          text: "",
          from: "bot",
          timestamp: Date.now() + 1,
        };
        dispatch({ type: "SET_IS_LOADING", payload: true });
        dispatch({ type: "ADD_MESSAGE", payload: botMessage });
        for await (const token of sendMessage(userMessage.text)) {
          console.log("token:", token);
          dispatch({
            type: "NEW_TOKEN",
            payload: {
              timestamp: botMessage.timestamp,
              token: token,
            },
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        dispatch({ type: "SET_IS_LOADING", payload: true });
      }
    },
    [dispatch, input]
  );
  return (
    <div className="flex flex-col w-full overflow-clip max-w-xl aspect-[9/16] border-4 border-black/50 rounded-3xl bg-slate-100">
      <div className="flex-1 flex flex-col-reverse gap-6 p-6">
        {messages
          .filter((message) => !!message.text)
          .map((message, i) => (
            <p
              key={i}
              className="even:self-end self-start p-3 rounded-3xl max-w-[80%] bg-green-500 even:bg-blue-500 text-white"
            >
              {message.text}
            </p>
          ))}
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex p-6 gap-3 bg-slate-200 border-t-4 border-black/40"
      >
        <label className="sr-only">Ask a question</label>
        <input
          placeholder="Hi LLama, how are you?"
          className="text-xl flex-1 rounded-xl border-4 border-black/50  leading-loose indent-4 h-16"
          value={input}
          onChange={handleChange}
        />
        <button
          disabled={isLoading}
          className="bg-black/80 border-black/50 py-1 px-6 text-xl rounded-xl text-white disabled:text-white/50"
        >
          SEND
        </button>
      </form>
    </div>
  );
}
