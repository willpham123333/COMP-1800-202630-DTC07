import { db } from "./firebaseAPI.js";
import { doc, getDoc } from "firebase/firestore";
import { requireUser, tasksFor, startSkill, completeTask } from "./learning.js";

const params = new URL(window.location.href).searchParams;
const skillId = params.get("docID");
const message = document.getElementById("lesson-message");
let saving = false;

function displayProgress(progress, user) {
    const tasks = tasksFor(skillId);
    const completed = progress.completedTasks || [];
    const container = document.getElementById("task-list");
    const template = document.getElementById("task-template");
    container.innerHTML = "";
    const percent = completed.length / tasks.length * 100;
    document.getElementById("lesson-progress").textContent = completed.length + " of " + tasks.length + " tasks complete (" + percent + "%)";
    document.getElementById("lesson-bar").style.width = percent + "%";
    tasks.forEach(function (task, index) {
        const taskId = "task-" + (index + 1);
        const card = template.content.cloneNode(true);
        card.querySelector(".task-title").textContent = (index + 1) + ". " + task;
        const button = card.querySelector("button");
        if (completed.includes(taskId)) {
            button.textContent = "Completed";
            button.disabled = true;
            button.classList.replace("btn-dark", "btn-success");
        } else if (index > 0 && !completed.includes("task-" + index)) {
            button.textContent = "Complete the previous task first";
            button.disabled = true;
        } else {
            button.addEventListener("click", async function () {
                if (saving) return;
                saving = true;
                button.disabled = true;
                button.textContent = "Saving…";
                message.textContent = "Saving your completion to Firestore…";
                try {
                    const saved = await completeTask(user, skillId, taskId, task);
                    displayProgress(saved, user);
                    if (saved.completedTasks.length === tasks.length) {
                        message.textContent = "Skill completed! Your achievement is saved in Firestore.";
                    } else message.textContent = "Task completed and saved in Firestore.";
                } catch (error) {
                    message.textContent = "Could not confirm the save. Refresh to check your saved progress, or try again.";
                    button.disabled = false;
                    button.textContent = "Complete task";
                    console.error(error);
                }
                saving = false;
            });
        }
        container.appendChild(card);
    });
    if (completed.length === tasks.length) {
    message.textContent = "Skill completed! Your achievement is saved in Firestore.";
    document.getElementById("skill-badge").classList.remove("d-none");
} else {
    document.getElementById("skill-badge").classList.add("d-none");
}
}

requireUser(async function (user) {
    if (!skillId || tasksFor(skillId).length === 0) {
        message.textContent = "Choose an available skill from the Skills page.";
        return;
    }
    try {
        const snapshot = await getDoc(doc(db, "skills", skillId));
        if (!snapshot.exists()) {
            message.textContent = "This skill is no longer available.";
            return;
        }
        const skill = snapshot.data();
        document.getElementById("lesson-name").textContent = skill.name;
        document.getElementById("lesson-description").textContent = skill.description;
        const progress = await startSkill(user, skillId, skill);
        message.textContent = "Progress saved. Complete the tasks in order at your own pace.";
        displayProgress(progress, user);
    } catch (error) {
        message.textContent = "Could not load your saved progress. Please refresh to try again.";
        console.error(error);
    }
});
