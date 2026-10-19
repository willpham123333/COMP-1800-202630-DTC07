
import { auth } from "./firebaseAPI.js";
import { onAuthStateChanged, signOut } from "firebase/auth";

const authButton = document.getElementById("auth-button");

if (authButton) {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            authButton.textContent = "Logout";
            authButton.href = "#";
        } else {
            authButton.textContent = "Login";
            authButton.href = "login.html";
        }
    });

    authButton.addEventListener("click", async (event) => {
        if (auth.currentUser) {
            event.preventDefault();

            try {
                await signOut(auth);
                window.location.href = "login.html";
            } catch (error) {
                console.error("Logout failed:", error);
            }
        }
    });
}
