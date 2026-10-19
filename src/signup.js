
import { auth } from "./firebaseAPI.js";
import {
    createUserWithEmailAndPassword,
    updateProfile
} from "firebase/auth";

const signupForm = document.getElementById("signup-form");

signupForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const fullName = document.getElementById("full-name").value.trim();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("error-message");

    errorMessage.textContent = "";

    try {
        const userCredential = await createUserWithEmailAndPassword(
            auth, email, password
        );

        await updateProfile(userCredential.user, {
            displayName: fullName
        });

        window.location.href = "profile.html";

    } catch (error) {
        console.error("Signup error:", error);
        errorMessage.textContent =
            "Could not create account: " + (error.message || String(error));
    }
});
