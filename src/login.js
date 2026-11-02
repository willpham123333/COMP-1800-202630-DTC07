
import { auth } from "./firebaseAPI.js";
import { signInWithEmailAndPassword } from "firebase/auth";

const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("error-message");

    errorMessage.textContent = "";

    try {
        await signInWithEmailAndPassword(auth, email, password);

        // Redirect after successful login
        window.location.href = "index.html";

    } catch (error) {
        errorMessage.textContent =
            "Sign in failed. Check your email and password.";
        console.error(error.code);
    }
});
