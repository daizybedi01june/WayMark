self.addEventListener("install", function() {
    console.log("Service Worker installed");
    self.skipWaiting();
});
self.addEventListener("activate", function() {
    console.log("Service Worker activated");
    self.clients.claim();
});
self.addEventListener("message", function(event) {
    console.log("Message received:", event.data);
    if (event.data.type === "taskDue") {
        self.registration.showNotification("WayMark", {
            body: event.data.title + " is due today!"
        });
    }
});
