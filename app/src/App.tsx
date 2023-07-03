import { FormEvent, useCallback, useState } from "react";

function Bubble({ message }: { message: string }) {
  return (
    <p className="even:self-end self-start p-3 rounded-3xl max-w-[80%] bg-green-500 even:bg-blue-500 text-white">
      {message}
    </p>
  );
}

function Chat() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [messages, setMessages] = useState<string[]>([]);
  const [lastMessage, setLastMessage] = useState<string[]>([]);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      const message = input.trim();
      if (!message) return;

      setIsLoading(true);
      setInput("");
      setMessages((messages) => [...messages, message]);

      const url = new URL("/chat", "http://localhost:4000");
      url.searchParams.append("message", message);
      try {
        const response = await fetch(url);
        const reader = response.body?.getReader();
        if (!reader) throw new Error("No reader");
        const tokens: string[] = [];
        // eslint-disable-next-line no-constant-condition
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const token = new TextDecoder("utf-8").decode(value);
          setLastMessage((tokens) => [...tokens, token]);
          tokens.push(token);
        }
        const text = tokens.join("");
        setMessages((messages) => [...messages, text]);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
        setLastMessage([]);
      }
    },
    [setInput, setIsLoading, input]
  );

  return (
    <div className="flex flex-col w-full overflow-clip max-w-xl aspect-[9/16] border-4 border-black/50 rounded-3xl bg-slate-100">
      <div className="flex-1 flex flex-col-reverse gap-6 p-6">
        {messages.map((message, i) => (
          <Bubble key={i} message={message} />
        ))}
        {isLoading && <Bubble message={lastMessage?.join("") || "..."} />}
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
          onChange={(e) => setInput(e.target.value)}
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

function App() {
  return (
    <div className="min-h-full h-full flex flex-col justify-center items-center p-6">
      <Chat />
    </div>
  );
}

export default App;
