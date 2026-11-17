import { requireUser, readSummary, tasksFor } from "./learning.js";

requireUser(async function (user) {
    const message = document.getElementById("progress-message");
    try {
        const summary = await readSummary(user);
        document.getElementById("completed-count").textContent = summary.completed;
        document.getElementById("started-count").textContent = summary.started;
        document.getElementById("total-count").textContent = summary.skills.size;
        document.getElementById("overall-percent").textContent = summary.completedTasks + " of " + summary.totalTasks + " tasks";
        document.getElementById("overall-bar").style.width = summary.percent + "%";
        const container = document.getElementById("progress-list");
        const template = document.getElementById("progress-template");
        summary.skills.forEach(function (snapshot) {
            const skill = snapshot.data();
            const record = summary.records[snapshot.id];
            const total = tasksFor(snapshot.id).length;
            let count = 0;
            let status = "Not started";
            if (record) {
                count = (record.completedTasks || []).length;
                status = "In progress";
                if (total > 0 && count === total) status = "Completed";
            }
            const card = template.content.cloneNode(true);
            card.querySelector(".card-title").textContent = skill.name;
            card.querySelector(".skill-status").textContent = status;
            card.querySelector(".task-count").textContent = count + " of " + total + " tasks completed";
            card.querySelector("a").href = "lesson.html?docID=" + snapshot.id;
            card.querySelector("a").textContent = record ? "View saved progress" : "Start skill";
            container.appendChild(card);
        });
        message.textContent = "Your saved progress from Firestore. New skills start at zero.";
    } catch (error) {
        message.textContent = "Could not load your progress. Please refresh to try again.";
        console.error(error);
    }
});
