function App() {
  return (
    <div className="min-h-full h-full flex flex-col justify-center items-center">
      <div className="flex flex-col w-full overflow-clip max-w-xl aspect-[9/16] border-4 border-black/50 rounded-3xl bg-slate-100">
        <div className="flex-1"></div>
        <form className="flex p-6 gap-3 bg-slate-200 border-t-4 border-black/40">
          <input
            placeholder="Ask a question"
            className="text-xl flex-1 rounded-xl border-4 border-black/50 leading-loose indent-4 h-16"
          ></input>
          <button className="bg-black/80 border-black/50 py-1 px-6 text-xl rounded-xl text-white">
            SEND
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
