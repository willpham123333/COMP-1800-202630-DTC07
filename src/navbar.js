import "bootstrap";
import { auth } from "./firebaseAPI.js";
import { onAuthStateChanged, signOut } from "firebase/auth";

// Demo 06: shared markup, then update controls after the auth check.
const navbar = document.querySelector("nav");
if (navbar) {
    navbar.innerHTML = `
        <div class="container">
            <a class="navbar-brand fw-bold" href="index.html">Skillingo</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarMenu" aria-controls="navbarMenu"
                aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarMenu">
                <div class="navbar-nav ms-auto gap-2 align-items-lg-center mt-3 mt-lg-0">
                    <a class="btn btn-light rounded-pill px-3" href="index.html">Home</a>
                    <a class="btn btn-light rounded-pill px-3" href="skill.html">Skills</a>
                    <a class="btn btn-light rounded-pill px-3" href="progress.html">Progress</a>
                    <a class="btn btn-light rounded-pill px-3" href="profile.html">Profile</a>
                    <span id="navbar-user" class="small text-secondary px-2"></span>
                    <span id="auth-controls"><span class="small text-secondary">Checking sign-in…</span></span>
                </div>
            </div>
        </div>`;
    onAuthStateChanged(auth, function (user) {
        const controls = document.getElementById("auth-controls");
        if (user) {
            document.getElementById("navbar-user").textContent = user.displayName || user.email;
            controls.innerHTML = '<button id="logout-button" class="btn btn-dark rounded-pill px-4" type="button">Sign Out</button>';
            document.getElementById("logout-button").addEventListener("click", async function () {
                try {
                    await signOut(auth);
                    window.location.href = "index.html";
                } catch (error) {
                    alert("Could not sign out. Please try again.");
                }
            });
        } else {
            document.getElementById("navbar-user").textContent = "";
            controls.innerHTML = '<a class="btn btn-dark rounded-pill px-4" href="login.html">Sign In</a> <a class="btn btn-outline-dark rounded-pill px-4" href="signup.html">Sign Up</a>';
        }
    });
}
