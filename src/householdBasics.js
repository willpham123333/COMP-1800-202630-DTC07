import { db } from "./firebaseAPI.js";
import { doc, getDoc } from "firebase/firestore";

async function loadHouseholdBasics() {
    try {
        const skillRef = doc(db, "skills", "household-basics");
        const skillDoc = await getDoc(skillRef);

        if (skillDoc.exists()) {
            const skill = skillDoc.data();
            document.getElementById("household-basics-name").textContent = skill.name;
            document.getElementById("household-basics-description").textContent = skill.description;
        }
    } catch (error) {
        console.error("Unable to load the Household Basics skill:", error);
    }
}

loadHouseholdBasics();
