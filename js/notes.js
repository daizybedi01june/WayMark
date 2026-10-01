const noteWorker = new Worker("../js/notesWorker.js");
const notes = [];

function showNoteForm() {
    document.getElementById("noteForm").style.display = "block";
}

function hideNoteForm() {
    document.getElementById("noteForm").style.display = "none";
}

function addNote() {
    const title = document.getElementById("noteTitle").value;
    const content = document.getElementById("noteContent").value;
    if (title === "" || content === "") {
        alert("Please enter both title and note.");
        return;
    }
    const note = {
        title: title,
        content: content
    };
    noteWorker.postMessage(note);
    document.getElementById("noteTitle").value = "";
    document.getElementById("noteContent").value = "";
    hideNoteForm();
}

noteWorker.onmessage = function(event) {
    const processedNote = event.data;
    notes.push(processedNote);
    renderNotes();
};

function renderNotes() {
    const container = document.getElementById("notesContainer");
    container.innerHTML = "";
    if (notes.length === 0) {
        container.innerHTML = `
            <p class="notes-message">
                No notes added yet.
            </p>
        `;
        return;
    }
    for (const note of notes) {
        const noteBox = document.createElement("div");
        noteBox.className = "note-item";

        noteBox.innerHTML = `
            <h3>${note.title}</h3>
            <p>${note.content}</p>
        `;
        container.appendChild(noteBox);
    }
}

document.getElementById("addNoteBtn").addEventListener("click", showNoteForm);
document.getElementById("saveNoteBtn").addEventListener("click", addNote);
document.getElementById("cancelNoteBtn").addEventListener("click", hideNoteForm);

renderNotes();