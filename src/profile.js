import { requireUser, readSummary } from "./learning.js";
import { db } from "./firebaseAPI.js";
import { doc, getDoc } from "firebase/firestore";

requireUser(async function (user) {
    document.getElementById("profile-name").textContent = user.displayName || "Learner";
    document.getElementById("profile-email").textContent = user.email || "";
    try {
        const summary = await readSummary(user);
        document.getElementById("profile-completed").textContent = summary.completed;
        document.getElementById("profile-started").textContent = summary.started;
        document.getElementById("profile-bar").style.width = summary.percent + "%";
        document.getElementById("profile-bar").textContent = summary.completedTasks + " of " + summary.totalTasks + " tasks";
        const userDoc = await getDoc(doc(db, "USER", user.uid));
const badges = userDoc.data()?.badges || [];
const container = document.getElementById("profile-badges");

if (badges.length > 0) {
    container.innerHTML = "";

    for (const badge of badges) {
        const element = document.createElement("p");
        element.textContent = "🏅 " + badge.replaceAll("-", " ");
        element.classList.add("text-capitalize");
        container.appendChild(element);
    }
}
    } catch (error) {
        document.getElementById("profile-message").textContent = "Could not load your saved progress. Please refresh to try again.";
        console.error(error);
    }
});
