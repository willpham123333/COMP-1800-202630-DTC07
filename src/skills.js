import { db } from "./firebaseAPI.js";
import { doc, getDoc } from "firebase/firestore";
async function loadSkill() {
    const skillRef = doc(db, "skills", "cooking-basics");
    const skillDoc = await getDoc(skillRef);

    if (skillDoc.exists()) {
        const skill = skillDoc.data();

        document.getElementById("cooking-name").textContent = skill.name;
        document.getElementById("cooking-description").textContent = skill.description;
    }
}

loadSkill();