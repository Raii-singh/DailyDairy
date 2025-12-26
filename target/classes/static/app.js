const API_BASE = "/api";

let currentRoomId = null;
let messages = [];

// ---------- HTTP HELPERS ----------

async function apiGet(path) {
    const res = await fetch(API_BASE + path);
    if (!res.ok) throw new Error("GET " + path + " failed");
    return res.json();
}

async function apiPost(path, body) {
    const res = await fetch(API_BASE + path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error("POST " + path + " failed");
    return res.json();
}

async function apiDelete(path) {
    const res = await fetch(API_BASE + path, { method: "DELETE" });
    if (!res.ok) throw new Error("DELETE " + path + " failed");
}

// ---------- UI HELPERS ----------

function renderMessages() {
    const list = document.getElementById("messageList");
    const empty = document.getElementById("emptyState");

    list.innerHTML = "";

    if (!messages.length) {
        empty.style.display = "flex";
        return;
    }

    empty.style.display = "none";

    messages.forEach(m => {
        const li = document.createElement("li");
        li.className = "message-item";

        const bubble = document.createElement("div");
        bubble.className = "message-bubble";
        bubble.textContent = m.content;

        const del = document.createElement("button");
        del.className = "message-delete";
        del.title = "Delete entry";
        del.textContent = "🗑";

        del.addEventListener("click", async (e) => {
            e.stopPropagation();
            const ok = confirm("Delete this entry?");
            if (!ok) return;
            await apiDelete(`/messages/${m.id}`);
            await refreshMessages();
        });

        li.appendChild(bubble);
        li.appendChild(del);
        list.appendChild(li);
    });

    list.scrollTop = list.scrollHeight;
}

// ---------- ROOM + MESSAGES ----------

async function loadOrCreateDefaultRoom() {
    const rooms = await apiGet("/rooms");
    if (rooms.length > 0) {
        currentRoomId = rooms[0].id;
        return rooms[0];
    }
    const room = await apiPost("/rooms", {
        name: "Daily Diary",
        theme: "default"
    });
    currentRoomId = room.id;
    return room;
}

async function refreshMessages() {
    if (!currentRoomId) return;
    messages = await apiGet(`/rooms/${currentRoomId}/messages`);
    document.getElementById("totalEntries").textContent =
        `${messages.length} total entries`;
    renderMessages();
}

async function handleSend() {
    const input = document.getElementById("messageInput");
    const text = input.value.trim();
    if (!text || !currentRoomId) return;

    await apiPost(`/rooms/${currentRoomId}/messages`, {
        sender: "me",
        content: text
    });

    input.value = "";
    await refreshMessages();
}

// ---------- DARK MODE ----------

function setupDarkMode() {
    const toggle = document.getElementById("darkModeToggle");
    if (!toggle) return;

    toggle.addEventListener("change", () => {
        document.body.classList.toggle("light-mode", !toggle.checked);
    });
}

// ---------- EVENTS ----------

function setupEvents() {
    const sendBtn = document.getElementById("sendButton");
    const input = document.getElementById("messageInput");
    const plusBtn = document.getElementById("plusButton");
    const calendarBtn = document.getElementById("calendarButton");

    if (sendBtn) {
        sendBtn.addEventListener("click", handleSend);
    }

    if (input) {
        input.addEventListener("keypress", e => {
            if (e.key === "Enter") handleSend();
        });
    }

    // Plus: focus input for quick typing
    if (plusBtn) {
        plusBtn.addEventListener("click", () => {
            input && input.focus();
        });
    }

    // Calendar: simple placeholder for now
    if (calendarBtn) {
        calendarBtn.addEventListener("click", () => {
            alert("Date filtering coming soon 🚧");
        });
    }

    setupDarkMode();
}

// ---------- INIT ----------

document.addEventListener("DOMContentLoaded", async () => {
    setupEvents();

    try {
        await loadOrCreateDefaultRoom();
        await refreshMessages();
    } catch (e) {
        console.error(e);
        alert("Could not connect to diary API. Is the server running?");
    }
});
