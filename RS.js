// ---------------- Firebase Config ----------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { 
  getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { 
  getFirestore, doc, getDoc, setDoc 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ---------------- إعداد Firebase ----------------
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

// ---------------- تهيئة ----------------
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// ---------------- سجل المشاهدة ----------------
let history = [];
let userId = null;

// ---------------- عرض السجل ----------------
function displayHistory() {
  const historyList = document.getElementById("history-list");
  if (!historyList) return;

  historyList.innerHTML = "";

  if (history.length === 0) {
    historyList.innerHTML = "<li>لا يوجد سجل حتى الآن</li>";
  } else {
    history.forEach((entry) => {
      const listItem = document.createElement("li");
      const link = document.createElement("a");
      link.href = entry.url;
      link.textContent = entry.name;
      link.style.textDecoration = "none";
      link.style.color = "#007bff";
      listItem.appendChild(link);
      historyList.appendChild(listItem);
    });
  }
}

// ---------------- تحميل السجل من Firebase ----------------
async function loadHistoryFromFirebase() {
  if (!userId) return;

  try {
    const docRef = doc(db, "histories", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      history = docSnap.data().history || [];
    } else {
      history = [];
    }

  } catch (err) {
    console.error("⚠️ فشل تحميل السجل من Firebase:", err);
    history = [];
  }

  displayHistory();
}

// ---------------- حفظ السجل في Firebase ----------------
async function saveHistoryToFirebase() {
  if (!userId) {
    console.warn("No userId, skipping Firebase save");
    return;
  }

  try {
    const docRef = doc(db, "histories", userId);
    await setDoc(docRef, { history: history }, { merge: true });
  } catch (err) {
    console.error("⚠️ فشل حفظ السجل في Firebase:", err);
  }
}

// ---------------- إضافة صفحة للسجل ----------------
function addToHistory(pageName, pageURL = window.location.href) {
  if (!userId) return; // لازم تسجيل دخول

  if (
    pageName.includes("سجل المشاهدة") ||
    pageURL.includes("watch-history") ||
    pageURL.includes("سجل")
  ) return;

  if (history.some(item => item.url === pageURL)) return;

  history.unshift({ name: pageName, url: pageURL });

  saveHistoryToFirebase();
  displayHistory();
}

// ---------------- مسح السجل ----------------
function clearHistory() {
  history = [];
  saveHistoryToFirebase();
  displayHistory();
}

// ---------------- عكس ترتيب السجل ----------------
function reverseHistory() {
  history.reverse();
  saveHistoryToFirebase();
  displayHistory();
}

// ---------------- تسجيل الدخول ----------------
const provider = new GoogleAuthProvider();

async function signIn() {
  try {
    await signInWithPopup(auth, provider);
  } catch (err) {
    console.error("Login Error:", err);
  }
}

onAuthStateChanged(auth, async (user) => {
  if (user) {
    userId = user.uid;
    console.log("User signed in:", user.uid);
    await loadHistoryFromFirebase();
  } else {
    userId = null;
    history = [];
    displayHistory();
  }
});

// ---------------- ربط الأزرار ----------------
const clearHistoryButton = document.getElementById("clear-history");
if (clearHistoryButton) clearHistoryButton.addEventListener("click", clearHistory);

const reverseHistoryButton = document.getElementById("reverse-history");
if (reverseHistoryButton) reverseHistoryButton.addEventListener("click", reverseHistory);

// ---------------- جعل الدوال متاحة عالميًا ----------------
window.addToHistory = addToHistory;
window.clearHistory = clearHistory;
window.reverseHistory = reverseHistory;
window.signIn = signIn;
