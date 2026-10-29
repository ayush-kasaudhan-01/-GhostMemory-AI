import { pipeline } from
    "https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.3.1";


const MODEL = "onnx-community/SmolLM2-135M-ONNX";

let generator = null;
let isLoadingModel = false;


// -----------------------------
// DOM ELEMENTS
// -----------------------------

const memoryInput = document.getElementById("memoryInput");
const storyStyle = document.getElementById("storyStyle");

const generateBtn = document.getElementById("generateBtn");

const outputTitle = document.getElementById("outputTitle");
const outputText = document.getElementById("outputText");

const loader = document.getElementById("loader");
const loaderText = document.getElementById("loaderText");

const copyBtn = document.getElementById("copyBtn");

const memoryWall = document.getElementById("memoryWall");
const clearMemories = document.getElementById("clearMemories");


// -----------------------------
// LOAD LOCAL MODEL
// -----------------------------

async function loadModel() {

    if (generator) {
        return generator;
    }

    if (isLoadingModel) {
        return null;
    }

    isLoadingModel = true;

    loader.classList.remove("hidden");
    outputText.classList.add("hidden");

    loaderText.textContent =
        "Loading the open-weight model...";

    try {

        generator = await pipeline(
            "text-generation",
            MODEL,
            {
                dtype: "q4"
            }
        );

        loaderText.textContent =
            "The machine is awake.";

        return generator;

    } catch (error) {

        console.error(error);

        outputText.classList.remove("hidden");

        outputText.innerHTML = `
            <span class="placeholder">
                Could not load the local AI model.
                Please run the project through a local web server
                and make sure your browser has internet access for
                the first model download.
            </span>
        `;

        throw error;

    } finally {

        isLoadingModel = false;
        loader.classList.add("hidden");
    }
}


// -----------------------------
// CREATE PROMPT
// -----------------------------

function createPrompt(memory, style) {

    const styles = {

        remembrance:
            "Write a warm and emotional remembrance based on the memory.",

        ghost:
            "Transform the memory into a subtle atmospheric ghost story. Keep it mysterious rather than violent.",

        poetic:
            "Rewrite the memory as a short poetic and emotional reflection.",

        letter:
            "Turn the memory into a heartfelt letter from the past."
    };

    return `
You are GhostMemory AI, a thoughtful storyteller.

${styles[style]}

Important:
- Keep the important facts from the original memory.
- Do not invent major real-world facts.
- Keep the response concise.
- Use atmospheric language.
- Do not mention that you are an AI.

Original memory:
${memory}

Write the final piece now:
`;
}


// -----------------------------
// GENERATE MEMORY
// -----------------------------

async function generateMemory() {

    const memory = memoryInput.value.trim();

    if (!memory) {

        memoryInput.focus();

        outputTitle.textContent =
            "The machine heard nothing.";

        outputText.classList.remove("hidden");

        outputText.innerHTML = `
            <span class="placeholder">
                Write a memory first...
            </span>
        `;

        return;
    }

    generateBtn.disabled = true;

    outputTitle.textContent =
        "Listening to the past...";

    outputText.classList.add("hidden");
    loader.classList.remove("hidden");

    loaderText.textContent =
        "Awakening the local model...";

    try {

        const model = await loadModel();

        if (!model) {
            throw new Error("Model unavailable.");
        }

        loaderText.textContent =
            "The memory is taking shape...";

        const prompt = createPrompt(
            memory,
            storyStyle.value
        );

        const result = await model(prompt, {
            max_new_tokens: 180,
            do_sample: true,
            temperature: 0.8,
            top_p: 0.9,
            repetition_penalty: 1.15
        });

        let generated = result[0]?.generated_text || "";

        // Remove prompt from output if model returns it.
        if (generated.startsWith(prompt)) {
            generated = generated.slice(prompt.length);
        }

        generated = generated.trim();

        if (!generated) {
            generated =
                "The machine remembers, but the words are still hidden.";
        }

        outputTitle.textContent =
            "A memory returned from the machine";

        outputText.textContent = generated;

        saveMemory(
            memory,
            generated,
            storyStyle.value
        );

        renderMemoryWall();

    } catch (error) {

        console.error(error);

        outputTitle.textContent =
            "The machine went silent.";

        outputText.textContent =
            "Something went wrong while generating the memory.";

    } finally {

        loader.classList.add("hidden");
        outputText.classList.remove("hidden");

        generateBtn.disabled = false;
    }
}


// -----------------------------
// SAVE MEMORY
// -----------------------------

function saveMemory(original, generated, style) {

    const memories =
        JSON.parse(
            localStorage.getItem("ghostMemories") || "[]"
        );

    memories.unshift({

        id: Date.now(),

        original: original,

        generated: generated,

        style: style,

        date: new Date().toLocaleDateString(
            undefined,
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        )

    });

    // Keep latest 12 memories.
    memories.splice(12);

    localStorage.setItem(
        "ghostMemories",
        JSON.stringify(memories)
    );
}


// -----------------------------
// DISPLAY MEMORY WALL
// -----------------------------

function renderMemoryWall() {

    const memories =
        JSON.parse(
            localStorage.getItem("ghostMemories") || "[]"
        );

    memoryWall.innerHTML = "";

    if (memories.length === 0) {

        memoryWall.innerHTML = `
            <div class="memory-item">
                <p>
                    No memories have been left behind yet.
                </p>
            </div>
        `;

        return;
    }

    memories.forEach(memory => {

        const item =
            document.createElement("article");

        item.className = "memory-item";

        const title =
            memory.style === "ghost"
                ? "A Whisper From The Past"
                : "An Echo Remembered";

        item.innerHTML = `
            <div class="memory-date">
                ${escapeHTML(memory.date)}
            </div>

            <h3>
                ${escapeHTML(title)}
            </h3>

            <p>
                ${escapeHTML(
                    memory.generated.substring(0, 180)
                )}${memory.generated.length > 180 ? "..." : ""}
            </p>
        `;

        memoryWall.appendChild(item);
    });
}


// -----------------------------
// CLEAR MEMORIES
// -----------------------------

clearMemories.addEventListener(
    "click",
    () => {

        localStorage.removeItem(
            "ghostMemories"
        );

        renderMemoryWall();
    }
);


// -----------------------------
// COPY OUTPUT
// -----------------------------

copyBtn.addEventListener(
    "click",
    async () => {

        const text =
            outputText.textContent.trim();

        if (!text) {
            return;
        }

        try {

            await navigator.clipboard.writeText(text);

            copyBtn.textContent = "✓";

            setTimeout(() => {
                copyBtn.textContent = "⧉";
            }, 1200);

        } catch (error) {

            console.error(error);

        }
    }
);


// -----------------------------
// ESCAPE HTML
// -----------------------------

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


// -----------------------------
// STARTUP
// -----------------------------

renderMemoryWall();

generateBtn.addEventListener(
    "click",
    generateMemory
);

memoryInput.addEventListener(
    "keydown",
    event => {

        if (
            event.ctrlKey &&
            event.key === "Enter"
        ) {
            generateMemory();
        }
    }
);