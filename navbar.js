// ------------------ Firebase Config ------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } 
    from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAQpXUUOLyN2B6IWGb5Ru2Dl8NZPNimTEg",
  authDomain: "wep1-25124.firebaseapp.com",
  projectId: "wep1-25124",
  storageBucket: "wep1-25124.firebasestorage.app",
  messagingSenderId: "400763524699",
  appId: "1:400763524699:web:b3d5b77815de059ad9117e",
  measurementId: "G-ER2GCC7BK4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// عناصر تسجيل الدخول
const loginButton = document.getElementById("loginButton");
const logoutButton = document.getElementById("logoutButton");
const userMenu = document.getElementById("userMenu");
const userPhoto = document.getElementById("userPhoto");
const dropdownMenu = document.getElementById("dropdownMenu");
const dropdownPhoto = document.getElementById("dropdownPhoto");
const dropdownName = document.getElementById("dropdownName");

// تسجيل الدخول
loginButton?.addEventListener("click", async () => {
    try {
        await signInWithPopup(auth, provider);
    } catch (error) {
        console.error("خطأ أثناء تسجيل الدخول:", error);
    }
});

// تسجيل الخروج
logoutButton?.addEventListener("click", async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("خطأ أثناء تسجيل الخروج:", error);
    }
});

// متابعة حالة تسجيل الدخول
onAuthStateChanged(auth, (user) => {
    if (user) {
        loginButton.style.display = "none";
        userMenu.style.display = "inline-block";
        userPhoto.src = user.photoURL;
        dropdownPhoto.src = user.photoURL;
        dropdownName.textContent = user.displayName;
    } else {
        loginButton.style.display = "inline-block";
        userMenu.style.display = "none";
    }
});

// فتح/إغلاق القائمة المنسدلة
userPhoto?.addEventListener("click", () => {
    dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";
});

// ------------------ كود الثيم + الموبايل ------------------
function initializeElements() {
    const themeToggle = document.getElementById('themeToggle');

    function applyTheme() {
        const savedTheme = localStorage.getItem('theme');
        document.body.classList.add(savedTheme || 'dark-mode');
    }
    applyTheme();

    themeToggle?.addEventListener('click', () => {
        if (document.body.classList.contains('dark-mode')) {
            document.body.classList.replace('dark-mode', 'light-mode');
            localStorage.setItem('theme', 'light-mode');
        } else {
            document.body.classList.replace('light-mode', 'dark-mode');
            localStorage.setItem('theme', 'dark-mode');
        }
    });

    const menuBtn = document.getElementById('menu-btn');
    const sidebar = document.getElementById('sidebar');
    menuBtn?.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });
}
initializeElements();
