import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "../firebase";

export async function requestDeviceToken(userToken) {
    try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
            const fcmToken = await getToken(messaging, {
                vapidKey: "BPrNzP5FgXulnppQP_VjFVglKNt-P4cKTC51NF32qwsckd-Uo6jRWrZun2YPW4sdzyQnv-kjrvXwlVUwrVLvpzM", // from Firebase console
            });

            console.log("FCM Token:", fcmToken);

            // 🔹 Save to backend
            await fetch("http://localhost:8000/api/register-device-token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userToken}`,
                },
                body: JSON.stringify({
                    device_token: fcmToken,
                    platform: "web",
                }),
            });
        }
    } catch (err) {
        console.error("FCM error:", err);
    }
}

// Foreground messages
onMessage(messaging, (payload) => {
    console.log("Foreground notification:", payload);
    alert(`${payload.notification.title}: ${payload.notification.body}`);
});
