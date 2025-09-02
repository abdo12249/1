// Firebase Config
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

// ✅ تهيئة Firebase (v8)
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

// عناصر تسجيل الدخول
const loginButton = document.getElementById("loginButton");
const logoutButton = document.getElementById("logoutButton");
const userInfo = document.getElementById("userInfo");

// تسجيل الدخول
if (loginButton) {
    loginButton.addEventListener("click", () => {
        auth.signInWithPopup(provider)
            .then(result => {
                const user = result.user;
                console.log("تم تسجيل الدخول:", user);

                // حفظ بيانات المستخدم
                localStorage.setItem("user", JSON.stringify({
                    name: user.displayName,
                    email: user.email,
                    photo: user.photoURL
                }));

                userInfo.innerHTML = `مرحبًا، ${user.displayName}`;
            })
            .catch(error => {
                console.error("خطأ أثناء تسجيل الدخول:", error);
            });
    });
}

// تسجيل الخروج
if (logoutButton) {
    logoutButton.addEventListener("click", () => {
        auth.signOut()
            .then(() => {
                console.log("تم تسجيل الخروج");
                localStorage.removeItem("user");
                userInfo.innerHTML = "";
            })
            .catch(error => {
                console.error("خطأ أثناء تسجيل الخروج:", error);
            });
    });
}

// متابعة حالة تسجيل الدخول
auth.onAuthStateChanged(user => {
    if (user) {
        loginButton.style.display = "none";
        logoutButton.style.display = "inline-block";
        userInfo.innerHTML = `مرحبًا، ${user.displayName}`;
    } else {
        loginButton.style.display = "inline-block";
        logoutButton.style.display = "none";
        userInfo.innerHTML = "";
    }
});
