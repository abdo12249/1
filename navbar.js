// وظيفة للتحقق من وجود العناصر وإعادة المحاولة إذا لزم الأمر
function initializeElements() {
// عنصر تبديل الثيم
const themeToggle = document.getElementById('themeToggle');

// دالة لتطبيق الثيم بناءً على التخزين المحلي
function applyTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.classList.add(savedTheme);
    } else {
        // إذا لم يكن هناك ثيم محفوظ، يمكن تعيين الثيم الافتراضي
        document.body.classList.add('dark-mode'); // أو 'dark-mode' حسب الرغبة
    }
}

// تطبيق الثيم عند تحميل الصفحة
applyTheme();

if (themeToggle) {
    themeToggle.addEventListener('click', function () {
        // التبديل بين الثيمات
        if (document.body.classList.contains('dark-mode')) {
            document.body.classList.add('light-mode');
            document.body.classList.remove('dark-mode');
            // حفظ الثيم في localStorage
            localStorage.setItem('theme', 'light-mode');
        } else {
            document.body.classList.add('dark-mode');
            document.body.classList.remove('light-mode');
            // حفظ الثيم في localStorage
            localStorage.setItem('theme', 'dark-mode');
        }
    });
} else {
    console.log("لم يتم العثور على themeToggle. سيتم المحاولة مرة أخرى بعد 5 ثوانٍ...");
    setTimeout(initializeElements, 1000); // إعادة المحاولة بعد 5 ثوانٍ
    return;
}


    // عنصر القائمة الجانبية الموبيل
    const menuBtn = document.getElementById('menu-btn');
    const sidebar = document.getElementById('sidebar');
    if (menuBtn && sidebar) {
        menuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('active'); // فتح أو غلق القائمة
        });
    } else {
        console.log("لم يتم العثور على menu-btn أو sidebar. سيتم المحاولة مرة أخرى بعد 5 ثوانٍ...");
        setTimeout(initializeElements, 1000); // إعادة المحاولة بعد 5 ثوانٍ
        return;
    }

    console.log("تم العثور على جميع العناصر المطلوبة وتفعيل الأحداث.");
}

// استدعاء الوظيفة لأول مرة
initializeElements();


// تفضيلت 

document.addEventListener("DOMContentLoaded", function () {
    let currentPage = {
        url: window.location.href,
        title: document.title // اسم الموقع الحالي
    };

    let savedSites = localStorage.getItem("savedSites") ? JSON.parse(localStorage.getItem("savedSites")) : [];

    function updateButtonState() {
        let button = document.getElementById("saveButton");
        if (!button) return;

        let isSaved = savedSites.some(site => site.url === currentPage.url);

        if (isSaved) {
            button.textContent = "إزالة من للمفضل";
            button.classList.add("saved");
            button.classList.remove("not-saved");
        } else {
            button.textContent = "اضافة للمفضل ";
            button.classList.add("not-saved");
            button.classList.remove("saved");
        }
    }

    function toggleLink() {
        let index = savedSites.findIndex(site => site.url === currentPage.url);

        if (index === -1) {
            savedSites.push(currentPage); // إضافة الموقع
        } else {
            savedSites.splice(index, 1); // إزالة الموقع
        }

        localStorage.setItem("savedSites", JSON.stringify(savedSites));
        updateButtonState();
    }

    function loadLinks() {
        let list = document.getElementById("linksList");
        if (!list) return;

        let savedSites = localStorage.getItem("savedSites") ? JSON.parse(localStorage.getItem("savedSites")) : [];
        list.innerHTML = "";

        savedSites.forEach(site => {
            let listItem = document.createElement("li");
            let anchor = document.createElement("a");
            anchor.href = site.url;
            anchor.textContent = site.title;
            anchor.target = "_blank"; // فتح الرابط في نافذة جديدة

            listItem.appendChild(anchor);
            list.appendChild(listItem);
        });
    }

    function clearLinks() {
        localStorage.removeItem("savedSites");
        loadLinks();
    }

    // إذا كان الزر موجودًا في الصفحة، قم بتحديث حالته
    if (document.getElementById("saveButton")) {
        updateButtonState();
        document.getElementById("saveButton").addEventListener("click", toggleLink);
    }

    // إذا كان هناك قائمة للروابط المحفوظة، قم بتحميلها
    if (document.getElementById("linksList")) {
        loadLinks();
        let clearButton = document.getElementById("clearButton");
        if (clearButton) clearButton.addEventListener("click", clearLinks);
    }
});

// تحميل gtag.js مرة واحدة فقط
if (!document.querySelector('script[src*="www.googletagmanager.com/gtag/js"]')) {
    const gtagScript = document.createElement('script');
    gtagScript.async = true;
    gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-BX7750CBQ5';
    document.head.appendChild(gtagScript);
}

// تعريف dataLayer و gtag مرة واحدة فقط
if (!window.dataLayer) {
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag; // حفظها في window للتأكد إنها متاحة
    gtag('js', new Date());
    gtag('config', 'G-BX7750CBQ5');
}



import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// مصادقة جوجل
const auth = getAuth();
const provider = new GoogleAuthProvider();

// تسجيل الدخول
async function signIn() {
  try {
    await signInWithPopup(auth, provider);
  } catch (err) {
    console.error("Login Error:", err);
  }
}

// تسجيل الخروج
async function logOut() {
  try {
    await signOut(auth);
  } catch (err) {
    console.error("Logout Error:", err);
  }
}

// مراقبة حالة المستخدم
onAuthStateChanged(auth, (user) => {
  const navButtons = document.querySelector(".nav-buttons");
  if (!navButtons) return;

  let loginBtn = navButtons.querySelector("#login-btn");
  if (loginBtn) loginBtn.remove(); // شيل زر تسجيل الدخول القديم

  // لو المستخدم مسجل
  if (user) {
    // اعمل عنصر جديد لصورة البروفايل + منيو صغيرة
    const profileDiv = document.createElement("div");
    profileDiv.classList.add("profile-menu");
    profileDiv.innerHTML = `
      <img src="${user.photoURL}" alt="Profile" class="profile-pic" style="width:35px; height:35px; border-radius:50%; cursor:pointer;">
      <div class="dropdown-menu" style="display:none; position:absolute; background:#fff; border:1px solid #ccc; padding:10px; border-radius:10px;">
        <p>${user.displayName}</p>
        <button id="logout-btn">تسجيل الخروج</button>
      </div>
    `;
    navButtons.appendChild(profileDiv);

    const img = profileDiv.querySelector(".profile-pic");
    const menu = profileDiv.querySelector(".dropdown-menu");
    img.addEventListener("click", () => {
      menu.style.display = menu.style.display === "none" ? "block" : "none";
    });

    // زر تسجيل الخروج
    profileDiv.querySelector("#logout-btn").addEventListener("click", logOut);

  } else {
    // لو مش مسجل رجع زر تسجيل الدخول
    const loginBtn = document.createElement("button");
    loginBtn.id = "login-btn";
    loginBtn.classList.add("icon-button");
    loginBtn.textContent = "تسجيل دخول";
    loginBtn.addEventListener("click", signIn);
    navButtons.appendChild(loginBtn);
  }
});
