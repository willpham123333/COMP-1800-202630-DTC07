import { db } from "./firebaseAPI.js";
import { doc, getDoc } from "firebase/firestore";
import { requireUser, tasksFor, startSkill, completeTask } from "./learning.js";

const params = new URL(window.location.href).searchParams;
const skillId = params.get("docID");
const message = document.getElementById("lesson-message");
let saving = false;

const learningContent = {
    "cooking-basics": [
        "Wash your hands with soap and water for at least 20 seconds. Clean the kitchen counter and utensils before preparing food.",

        "Choose a beginner-friendly recipe. Read the instructions carefully and gather all the ingredients and equipment before starting.",

        "Follow the recipe step by step. Use a food thermometer when needed and keep raw meat separate from other ingredients.",

        "Wash the dishes and clean the cooking area. Store leftovers in sealed containers and refrigerate them within two hours."
    ],

    "household-basics": [
        "Start with a small area, such as your desk or a drawer. Remove unnecessary items to make cleaning easier.",

        "Separate items into things to keep, donate or throw away. Return useful items to their proper places.",

        "Use suitable cleaning products for each surface. Follow the instructions on the label and never mix cleaning products.",

        "Create a weekly cleaning schedule. Set a reminder on your phone to keep your space clean and organized."
    ],

    "time-management": [
        "Write down everything you need to accomplish today. Break larger tasks into smaller, manageable steps.",

        "Identify your most important task based on its urgency and deadline. Estimate how much time it will take.",

        "Try the Pomodoro technique. Work for 25 minutes without distractions, followed by a 5-minute break.",

        "Review the tasks you completed today. Identify what distracted you and decide how to improve tomorrow."
    ]
};

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
        card.querySelector(".task-description").textContent = learningContent[skillId][index];
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
