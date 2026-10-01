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
    saveNotes();
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

    for (let i = 0; i < notes.length; i++) {
        const note = notes[i];
        const noteBox = document.createElement("div");
        noteBox.className = "note-item";
        noteBox.innerHTML = `
            <div>
                <h3>${note.title}</h3>
                <p>${note.content}</p>
            </div>
            <button class="deleteNoteBtn" data-index="${i}">
                X
            </button>
        `;
        container.appendChild(noteBox);
    }
    document.querySelectorAll(".deleteNoteBtn").forEach(button => {
        button.addEventListener("click", function() {
            const index = this.dataset.index;
            notes.splice(index, 1);
            saveNotes();
            renderNotes();
        });
    });
}

function saveNotes() {
    localStorage.setItem("waymark_notes", JSON.stringify(notes));
}

function loadNotes() {
    const stored = localStorage.getItem("waymark_notes");

    if (stored) {
        const savedNotes = JSON.parse(stored);

        savedNotes.forEach(note => {
            notes.push(note);
        });
    }
}

document.getElementById("addNoteBtn").addEventListener("click", showNoteForm);
document.getElementById("saveNoteBtn").addEventListener("click", addNote);
document.getElementById("cancelNoteBtn").addEventListener("click", hideNoteForm);

loadNotes();
renderNotes();