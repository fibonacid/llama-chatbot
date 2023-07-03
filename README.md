# llama-chatbot

A simple chat bot using Dalai (LLAMA) and Vite.

Install dependencies:

```bash
yarn install
```

Install llama model:
```bash
npx dalai llama install 7B
```
> This will take a while.

Build:

```bash
yarn build
```

Run:

```bash
npx concurrently "yarn start" "yarn --cwd app preview"
```


