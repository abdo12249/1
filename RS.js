// ---------------- Firebase Config ----------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import {
  getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore, doc, getDoc, setDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ✅ إعداد Firebase
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
let watchedEpisodes = []; // ✅ قائمة الحلقات التي تم مشاهدتها
let userId = null;

// ✅ تحميل السجل من Firebase
async function loadHistoryFromFirebase() {
  if (!userId) return;

  try {
    const docRef = doc(db, "histories", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      history = data.history || [];
      watchedEpisodes = data.watchedEpisodes || [];
    } else {
      history = [];
      watchedEpisodes = [];
    }

    localStorage.setItem("watchHistoryBackup", JSON.stringify(history));
    localStorage.setItem("watchedEpisodesBackup", JSON.stringify(watchedEpisodes));

  } catch (err) {
    console.warn("⚠️ فشل تحميل البيانات من Firebase:", err);
    const backup = localStorage.getItem("watchHistoryBackup");
    const backupWatched = localStorage.getItem("watchedEpisodesBackup");
    if (backup) history = JSON.parse(backup);
    if (backupWatched) watchedEpisodes = JSON.parse(backupWatched);
  }

  displayHistory();
}

// ✅ حفظ السجل في Firebase (مع دمج)
async function saveHistoryToFirebase() {
  if (!userId) return;

  try {
    await setDoc(
      doc(db, "histories", userId),
      { history, watchedEpisodes },
      { merge: true }
    );

    localStorage.setItem("watchHistoryBackup", JSON.stringify(history));
    localStorage.setItem("watchedEpisodesBackup", JSON.stringify(watchedEpisodes));

  } catch (err) {
    console.error("⚠️ فشل حفظ البيانات في Firebase:", err);
  }
}

// ✅ إضافة صفحة إلى السجل
function addToHistory(pageName, pageURL = window.location.href) {
  if (
    pageName.includes("سجل المشاهدة") ||
    pageURL.includes("watch-history") ||
    pageURL.includes("سجل")
  ) return;

  const exists = history.some(item => item.url === pageURL);
  if (!exists) {
    history.unshift({ name: pageName, url: pageURL });
  }

  // ✅ تحليل عنوان الحلقة لإضافتها في قائمة المشاهدة
  try {
    const urlParams = new URL(pageURL);
    const episode = urlParams.searchParams.get("episode");
    const animeId = urlParams.searchParams.get("id");

    if (animeId && episode) {
      const key = `${animeId}-E${episode}`;
      if (!watchedEpisodes.includes(key)) {
        watchedEpisodes.push(key);
      }
    }
  } catch (err) {
    console.warn("تعذر تحليل رابط الحلقة:", err);
  }

  saveHistoryToFirebase();
  displayHistory();
}

// ✅ دالة تُستخدم في صفحة الحلقات للتحقق هل الحلقة تم مشاهدتها أم لا
function isEpisodeWatched(animeId, episodeNumber) {
  const key = `${animeId}-E${episodeNumber}`;
  return watchedEpisodes.includes(key);
}

// ✅ عرض السجل في الصفحة
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

// ✅ مسح السجل
function clearHistory() {
  history = [];
  watchedEpisodes = [];
  saveHistoryToFirebase();
  displayHistory();
}

// ✅ عكس ترتيب السجل
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
    await loadHistoryFromFirebase();
  } else {
    userId = null;
    history = [];
    watchedEpisodes = [];
    displayHistory();
  }
});

// ---------------- ربط الأزرار ----------------
const clearHistoryButton = document.getElementById("clear-history");
if (clearHistoryButton) clearHistoryButton.addEventListener("click", clearHistory);

const reverseHistoryButton = document.getElementById("reverse-history");
if (reverseHistoryButton) reverseHistoryButton.addEventListener("click", reverseHistory);

// ✅ جعل الدوال متاحة عالمياً
window.addToHistory = addToHistory;
window.clearHistory = clearHistory;
window.reverseHistory = reverseHistory;
window.signIn = signIn;
window.isEpisodeWatched = isEpisodeWatched; // ✅ مهمة جداً لاستخدامها في صفحة الحلقات
