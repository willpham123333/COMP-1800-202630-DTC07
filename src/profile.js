
import { auth } from "./firebaseAPI.js";
import { onAuthStateChanged } from "firebase/auth";

onAuthStateChanged(auth, function(user) {
    if (user) {
        document.getElementById("profile-name").textContent =
            user.displayName || "Learner";

        document.getElementById("profile-email").textContent =
            user.email || "";
    } else {
        window.location.href = "login.html";
    }
});
