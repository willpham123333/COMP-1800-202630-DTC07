import { requireUser, readSummary } from "./learning.js";

requireUser(async function (user) {
    document.getElementById("profile-name").textContent = user.displayName || "Learner";
    document.getElementById("profile-email").textContent = user.email || "";
    try {
        const summary = await readSummary(user);
        document.getElementById("profile-completed").textContent = summary.completed;
        document.getElementById("profile-started").textContent = summary.started;
        document.getElementById("profile-bar").style.width = summary.percent + "%";
        document.getElementById("profile-bar").textContent = summary.completedTasks + " of " + summary.totalTasks + " tasks";
    } catch (error) {
        document.getElementById("profile-message").textContent = "Could not load your saved progress. Please refresh to try again.";
        console.error(error);
    }
});
