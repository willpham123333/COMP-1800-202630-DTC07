// Demo 06 auth checks, Demo 07 document reads, Demo 09 arrayUnion writes.
import { auth, db } from "./firebaseAPI.js";
import { onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDoc, getDocs, setDoc, arrayUnion, serverTimestamp } from "firebase/firestore";

// Starter task text belongs to the interface; completions are stored per user.
const starterTasks = {
    "cooking-basics": [
        "Wash your hands and clean the kitchen work surface.",
        "Choose a simple recipe and gather its ingredients and equipment.",
        "Prepare the recipe, following its cooking and food safety instructions.",
        "Clean the equipment and store leftovers safely."
    ],
    "household-basics": [
        "Choose one small area of your home to tidy.",
        "Sort the items and return them to their proper places.",
        "Clean the surfaces using the product label instructions.",
        "Make a weekly reminder to maintain this area."
    ],
    "time-management": [
        "List the tasks you need to finish today.",
        "Choose your most important task and estimate how long it will take.",
        "Schedule a focused work session and complete that task.",
        "Review your day and plan one improvement for tomorrow."
    ]
};

export function requireUser(callback) {
    onAuthStateChanged(auth, function (user) {
        if (!user) {
            window.location.href = "login.html";
            return;
        }
        callback(user);
    });
}

export function tasksFor(skillId) {
    return starterTasks[skillId] || [];
}

export function progressRef(user, skillId) {
    return doc(db, "USER", user.uid, "skills", skillId);
}

export async function readProgress(user, skillId) {
    const snapshot = await getDoc(progressRef(user, skillId));
    if (snapshot.exists()) return snapshot.data();
    return { completedTasks: [] };
}

export async function startSkill(user, skillId, skill) {
    const reference = progressRef(user, skillId);
    const snapshot = await getDoc(reference);
    if (!snapshot.exists()) {
        await setDoc(reference, {
            owner: user.uid,
            skillId: skillId,
            name: skill.name,
            completedTasks: arrayUnion(),
            startedAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        }, { merge: true });
    }
    return readProgress(user, skillId);
}

export async function completeTask(user, skillId, taskId, taskName) {
    // Demo 09: arrayUnion prevents duplicate completion IDs.
    await setDoc(progressRef(user, skillId), {
        completedTasks: arrayUnion(taskId),
        completedTaskNames: arrayUnion(taskName),
        updatedAt: serverTimestamp()
    }, { merge: true });
    const progress = await readProgress(user, skillId);
    if (progress.completedTasks.length === tasksFor(skillId).length && !progress.completedAt) {
        await setDoc(progressRef(user, skillId), {
            completedAt: serverTimestamp()
        }, { merge: true });
    }
    return progress;
}

export async function readSummary(user) {
    const skills = await getDocs(collection(db, "skills"));
    const progress = await getDocs(collection(db, "User", user.uid, "skills"));
    let completed = 0;
    let started = 0;
    let completedTasks = 0;
    let totalTasks = 0;
    const records = {};
    progress.forEach(function (snapshot) {
        records[snapshot.id] = snapshot.data();
    });
    skills.forEach(function (snapshot) {
        const total = tasksFor(snapshot.id).length;
        const saved = records[snapshot.id];
        totalTasks = totalTasks + total;
        if (saved) {
            const count = (saved.completedTasks || []).length;
            completedTasks = completedTasks + count;
            if (total > 0 && count === total) completed = completed + 1;
            else started = started + 1;
        }
    });
    let percent = 0;
    if (totalTasks > 0) percent = completedTasks / totalTasks * 100;
    return { skills, records, completed, started, percent, completedTasks, totalTasks };
}
