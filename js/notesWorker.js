self.onmessage = function(event) {
    const note = event.data;
    const wordCount = note.content.trim() === "" ? 0 : note.content.trim().split(/\s+/).length;
    const result = {
        title: note.title,
        content: note.content,
        wordCount: wordCount
    };
    self.postMessage(result);
};