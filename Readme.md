# 👻 GhostMemory AI

> Memories that refuse to disappear.

GhostMemory AI is a privacy-focused AI storytelling application built for the Hacktoberfest **"Ghost in the Machine"** theme.

It transforms personal memories into atmospheric remembrances, poems, letters, and subtle ghost stories using an **open-weight language model running directly in the browser**.

---

## 🕯️ What is GhostMemory AI?

We all have memories that we don't want to lose.

GhostMemory AI gives those memories a second life.

Write a memory, choose a style, and the local AI turns it into a short piece of writing.

The project combines:

- 👻 Halloween-inspired storytelling
- 🕯️ Memory and remembrance
- 🤖 Open-weight AI
- 🔒 Local-first privacy
- 🌐 Browser-based AI inference

---

## ✨ Features

### 🤖 Open-weight AI

GhostMemory AI uses:

**SmolLM2-135M-ONNX**

through:

**Transformers.js**

The model performs text generation directly in the browser.

---

### 🔒 Privacy First

Personal memories are not sent to a commercial AI API.

The generated memories are stored locally using browser `localStorage`.

There is no application database.

---

### 🧠 Multiple Writing Styles

Users can choose:

- Gentle Remembrance
- Ghost Story
- Poetic Memory
- Letter From The Past

---

### 💾 Local Memory Wall

Generated memories can be displayed on a local memory wall.

The memories remain in the user's browser.

---

### 🌐 No AI API Key

GhostMemory AI does not require:

- OpenAI API
- Gemini API
- Anthropic API
- AI API keys
- A backend server

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| HTML | Structure |
| CSS | UI and animations |
| JavaScript | Application logic |
| Transformers.js | Browser AI inference |
| SmolLM2 | Open-weight language model |
| ONNX Runtime | Model execution |
| LocalStorage | Local memory storage |

---

## 🧠 How the AI Works

```text
User Memory
     │
     ▼
GhostMemory UI
     │
     ▼
Prompt Builder
     │
     ▼
Transformers.js
     │
     ▼
SmolLM2-135M-ONNX
     │
     ▼
Generated Memory
     │
     ▼
Browser LocalStorage