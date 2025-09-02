// --- Firebase استيراد ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// --- بيانات المشروع بتاعك ---
const firebaseConfig = {
  apiKey: "AIzaSyAQpXUUOLyN2B6IWGb5Ru2Dl8NZPNimTEg",
  authDomain: "wep1-25124.firebaseapp.com",
  projectId: "wep1-25124",
  storageBucket: "wep1-25124.firebasestorage.app",
  messagingSenderId: "400763524699",
  appId: "1:400763524699:web:b3d5b77815de059ad9117e",
  measurementId: "G-ER2GCC7BK4"
};

// --- تهيئة Firebase ---
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const historyKey = "browsingHistory";
let history = JSON.parse(localStorage.getItem(historyKey)) || [];

// تسجيل الدخول
window.login = async function () {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  alert("مرحبًا " + result.user.displayName);

  // تحميل السجل من Firestore
  const snap = await getDoc(doc(db, "users", result.user.uid));
  if (snap.exists()) {
    history = snap.data().history || [];
    localStorage.setItem(historyKey, JSON.stringify(history));
  }
  displayHistory();
};

// حفظ السجل في localStorage + Firestore
async function saveHistory() {
  localStorage.setItem(historyKey, JSON.stringify(history));
  const user = auth.currentUser;
  if (user) {
    await setDoc(doc(db, "users", user.uid), { history });
  }
}

// إضافة صفحة جديدة للسجل
export function addToHistory(pageName, pageURL = window.location.href) {
  if (pageName.includes("سجل المشاهدة") || pageURL.includes("watch-history") || pageURL.includes("سجل")) {
    return;
  }
  history = history.filter(entry => entry.url !== pageURL);
  history.unshift({ name: pageName, url: pageURL });
  saveHistory();
}

// عرض السجل
function displayHistory() {
  const historyList = document.getElementById("history-list");
  if (historyList) {
    historyList.innerHTML = "";
    if (history.length === 0) {
      historyList.innerHTML = "<li>لا يوجد سجل حتى الآن</li>";
    } else {
      history.forEach((entry) => {
        const li = document.createElement("li");
        const link = document.createElement("a");
        link.href = entry.url;
        link.textContent = entry.name;
        link.style.textDecoration = "none";
        link.style.color = "#007bff";
        li.appendChild(link);
        historyList.appendChild(li);
      });
    }
  }
}

// مسح السجل
function clearHistory() {
  history = [];
  saveHistory();
  displayHistory();
}

// عكس الترتيب
function reverseHistory() {
  history.reverse();
  saveHistory();
  displayHistory();
}

// ربط الأزرار
document.getElementById("clear-history")?.addEventListener("click", clearHistory);
document.getElementById("reverse-history")?.addEventListener("click", reverseHistory);

// عرض عند التحميل
displayHistory();
