document.addEventListener('DOMContentLoaded', async () => {

    const id = localStorage.getItem("id");
    const input_form = document.getElementById("input-form");
    const send_btn = document.getElementById("send-btn");
    const input_letters = document.getElementById("input-letters");
    const messageFormatModal = document.getElementById("message-format-modal");
    
    const lettersSection = document.getElementById("letters-section");

    if (!input_form || !input_letters) {
        return;
    }

    /**
     * Creates a paper element for a message
     */
    function createPaperElement(author, body) {
        const paper = document.createElement("div");
        paper.classList.add("paper");

        const authorLine = document.createElement("div");
        authorLine.classList.add("paper-author");
        authorLine.textContent = author;

        const bodyLine = document.createElement("div");
        bodyLine.classList.add("paper-body");
        bodyLine.textContent = body;

        paper.appendChild(authorLine);
        paper.appendChild(bodyLine);
        return paper;
    }

    /**
     * Load all messages from storage and display them
     */
    async function loadMessages() {
        try {
            const messages = await StorageService.getMessages();
            messages.forEach(msg => {
                const paper = createPaperElement(msg.author, msg.body);
                lettersSection.appendChild(paper);
            });
        } catch (error) {
            console.error('Failed to load messages:', error);
        }
    }

    /**
     * Send a new message
     */
    async function send() {
        const message = input_letters.value.trim();

        if(message === "") {
            return;
        }

        const words = message.split(/\s+/);
        const authorTag = words[0];

        if (!/^@[A-Za-z0-9_]+$/.test(authorTag)) {
            return;
        }

        const messageBody = words.slice(1).join(" ").trim();

        if (messageBody === "") {
            return;
        }

        // Save to storage
        const messageObj = {
            author: authorTag,
            body: messageBody
        };

        // Disable send button while saving
        send_btn.disabled = true;
        send_btn.textContent = "Sending...";

        const saved = await StorageService.saveMessage(messageObj);
        
        if (saved) {
            // Create and display the paper element
            const paper = createPaperElement(authorTag, messageBody);
            lettersSection.appendChild(paper);

            input_letters.value = "";
            input_letters.focus();
            input_letters.setSelectionRange(0, 0);
        }

        // Re-enable send button
        send_btn.disabled = false;
        send_btn.textContent = "Send letters";
    }

    input_letters.addEventListener('keydown', (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            send();
        }
    });

    input_letters.addEventListener('input', () => {
        input_letters.value = input_letters.value.replace(/[\r\n]+/g, " ");
    });

    if(id !== "friends") {
        input_form.style.display = "none";
    } else {
        input_form.style.display = "flex";
        input_form.style.flexDirection = "column";

        if (messageFormatModal && typeof bootstrap !== "undefined") {
            const modal = new bootstrap.Modal(messageFormatModal);
            modal.show();
        }

        send_btn.addEventListener('click', (event) => {
            send();
        });
    }

    // Load existing messages on page load
    await loadMessages();

})