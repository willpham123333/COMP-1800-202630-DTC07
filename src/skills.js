import { db } from "./firebaseAPI.js";
import { collection, getDocs } from "firebase/firestore";
import { requireUser, tasksFor } from "./learning.js";

requireUser(async function () {
    const message = document.getElementById("skills-message");
    try {
        const snapshots = await getDocs(collection(db, "skills"));
        const template = document.getElementById("skill-template");
        const container = document.getElementById("skills-list");
        container.innerHTML = "";
        snapshots.forEach(function (snapshot) {
            const skill = snapshot.data();
            const card = template.content.cloneNode(true);
            card.querySelector(".card-title").textContent = skill.name;
            card.querySelector(".card-text").textContent = skill.description;
            card.querySelector(".task-count").textContent = tasksFor(snapshot.id).length + " tasks";
            card.querySelector("a").href = "lesson.html?docID=" + snapshot.id;
            container.appendChild(card);
        });
        message.textContent = "Choose a skill to start or resume your saved progress.";
        if (snapshots.empty) message.textContent = "No skills are available yet.";
    } catch (error) {
        message.textContent = "Could not load skills. Please refresh to try again.";
        console.error(error);
    }
});
