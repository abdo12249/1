// ------------------ Firebase Config ------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } 
    from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAQpXUUOLyN2B6IWGb5Ru2Dl8NZPNimTEg",
  authDomain: "wep1-25124.firebaseapp.com",
  databaseURL: "https://wep1-25124-default-rtdb.firebaseio.com",
  projectId: "wep1-25124",
  storageBucket: "wep1-25124.firebasestorage.app",
  messagingSenderId: "400763524699",
  appId: "1:400763524699:web:b3d5b77815de059ad9117e",
  measurementId: "G-ER2GCC7BK4"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// عناصر تسجيل الدخول
window.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById("loginButton");
    const logoutButton = document.getElementById("logoutButton");
    const userInfo = document.getElementById("userInfo");

    // تسجيل الدخول بجوجل
    if (loginButton) {
        loginButton.addEventListener("click", async () => {
            try {
                const result = await signInWithPopup(auth, provider);
                const user = result.user;
                console.log("تم تسجيل الدخول:", user);

                // حفظ بيانات المستخدم في LocalStorage
                localStorage.setItem("user", JSON.stringify({
                    name: user.displayName,
                    email: user.email,
                    photo: user.photoURL
                }));
            } catch (error) {
                console.error("خطأ أثناء تسجيل الدخول:", error);
            }
        });
    }

    // تسجيل الخروج
    if (logoutButton) {
        logoutButton.addEventListener("click", async () => {
            try {
                await signOut(auth);
                console.log("تم تسجيل الخروج");
                localStorage.removeItem("user");
            } catch (error) {
                console.error("خطأ أثناء تسجيل الخروج:", error);
            }
        });
    }

    // التحقق من LocalStorage عند التحميل
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
        if (loginButton) loginButton.style.display = "none";
        if (logoutButton) logoutButton.style.display = "inline-block";
        if (userInfo) userInfo.innerHTML = "مرحبًا، " + storedUser.name;
    }

    // متابعة حالة تسجيل الدخول
    onAuthStateChanged(auth, (user) => {
    if (user) {
        if (loginButton) loginButton.style.display = "none";
        if (logoutButton) logoutButton.style.display = "inline-block";
        if (userInfo) userInfo.innerHTML = "مرحبًا، " + user.displayName;

        localStorage.setItem("user", JSON.stringify({
            name: user.displayName,
            email: user.email,
            photo: user.photoURL
        }));
    } else {
        if (loginButton) loginButton.style.display = "inline-block";
        if (logoutButton) logoutButton.style.display = "none";
        if (userInfo) userInfo.innerHTML = "";
        localStorage.removeItem("user");
    }
});



// ------------------ كود الثيم + الموبايل + المفضلات ------------------
// (نفس الكود اللي عندك، ما غيرتهش، خليته شغال مع تسجيل الدخول)

// وظيفة للتحقق من وجود العناصر وإعادة المحاولة إذا لزم الأمر
function initializeElements() {
    const themeToggle = document.getElementById('themeToggle');

    function applyTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.body.classList.add(savedTheme);
        } else {
            document.body.classList.add('dark-mode');
        }
    }
    applyTheme();

    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            if (document.body.classList.contains('dark-mode')) {
                document.body.classList.add('light-mode');
                document.body.classList.remove('dark-mode');
                localStorage.setItem('theme', 'light-mode');
            } else {
                document.body.classList.add('dark-mode');
                document.body.classList.remove('light-mode');
                localStorage.setItem('theme', 'dark-mode');
            }
        });
    } else {
        setTimeout(initializeElements, 1000);
        return;
    }

    const menuBtn = document.getElementById('menu-btn');
    const sidebar = document.getElementById('sidebar');
    if (menuBtn && sidebar) {
        menuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    } else {
        setTimeout(initializeElements, 1000);
        return;
    }
}
initializeElements();



