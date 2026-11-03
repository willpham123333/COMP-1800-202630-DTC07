import { db } from "./firebaseAPI.js";
import { doc, getDoc } from "firebase/firestore";

async function loadTimeManagement() {
    try {
        const skillRef = doc(db, "skills", "time-management");
        const skillDoc = await getDoc(skillRef);

        if (skillDoc.exists()) {
            const skill = skillDoc.data();
            document.getElementById("time-management-name").textContent = skill.name;
            document.getElementById("time-management-description").textContent = skill.description;
        }
    } catch (error) {
        console.error("Unable to load the Time Management skill:", error);
    }
}

loadTimeManagement();
