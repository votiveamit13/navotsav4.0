importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

// Your Firebase config
firebase.initializeApp({
    apiKey: "AIzaSyAl__sBmfo-et8wlQrPUm3wYo-lySsPNLA",
    authDomain: "the-fifty-play.firebaseapp.com",
    projectId: "the-fifty-play",
    storageBucket: "the-fifty-play.firebasestorage.app",
    messagingSenderId: "579870241953",
    appId: "1:579870241953:web:0ce0bf5df79f9909be6ce0",
});

// Initialize messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log("[firebase-messaging-sw.js] Received background message:", payload);

    const notificationTitle = payload.notification?.title || "New Notification";
    const notificationOptions = {
        body: payload.notification?.body || "",
        icon: "/images/notity_favicon.png",
        data: {
            url: "https://fiftyplay.votivereact.in",
        }
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

