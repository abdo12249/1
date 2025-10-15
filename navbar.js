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



// ---------------- نظام البحث المتصل بملف JSON ----------------

document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("searchInput");
  const animeList = document.getElementById("animeList");
  const dataUrl = "https://abdo12249.github.io/1/test1/animes.json"; // رابط ملف الأنميات

  if (!searchInput || !animeList) return;

  let animeData = {};

  // تحميل بيانات الأنميات من الملف
  fetch(dataUrl)
    .then(response => response.json())
    .then(data => {
      animeData = data;
      console.log("✅ تم تحميل بيانات الأنميات بنجاح");
    })
    .catch(err => {
      console.error("❌ فشل تحميل ملف الأنميات:", err);
    });

  // تنسيق قائمة النتائج
  Object.assign(animeList.style, {
    position: "absolute",
    background: "var(--search-bg, #222)",
    color: "white",
    width: "100%",
    maxHeight: "250px",
    overflowY: "auto",
    borderRadius: "10px",
    display: "none",
    zIndex: "1000",
    padding: "5px",
    direction: "rtl"
  });

  // عند الكتابة في مربع البحث
  searchInput.addEventListener("input", function () {
    const query = this.value.toLowerCase().trim();
    animeList.innerHTML = "";

    if (query === "") {
      animeList.style.display = "none";
      return;
    }

    const results = Object.entries(animeData).filter(([key, anime]) =>
      anime.title.toLowerCase().includes(query)
    );

    if (results.length === 0) {
      animeList.innerHTML = `<p style="padding:8px;color:#aaa;">لا توجد نتائج</p>`;
      animeList.style.display = "block";
      return;
    }

    results.forEach(([key, anime]) => {
      const item = document.createElement("a");
      item.href = `https://abdo12249.github.io/1/tag/wep/${key}.html`;
      item.style.display = "flex";
      item.style.alignItems = "center";
      item.style.padding = "8px";
      item.style.gap = "8px";
      item.style.textDecoration = "none";
      item.style.color = "inherit";
      item.style.borderBottom = "1px solid rgba(255,255,255,0.1)";
      item.style.transition = "background 0.2s";

      // الصورة (إذا كانت موجودة)
      const img = document.createElement("img");
      img.src = anime.image || "https://abdo12249.github.io/1/img/no-image.webp";
      img.alt = anime.title;
      img.style.width = "40px";
      img.style.height = "55px";
      img.style.objectFit = "cover";
      img.style.borderRadius = "6px";

      // النص
      const titleDiv = document.createElement("div");
      titleDiv.textContent = anime.title;
      titleDiv.style.flex = "1";

      // التفاعل
      item.addEventListener("mouseover", () => (item.style.background = "rgba(255,255,255,0.1)"));
      item.addEventListener("mouseout", () => (item.style.background = "transparent"));

      item.appendChild(img);
      item.appendChild(titleDiv);
      animeList.appendChild(item);
    });

    animeList.style.display = "block";
  });

  // إخفاء القائمة عند الضغط خارج البحث
  document.addEventListener("click", function (e) {
    if (!searchInput.contains(e.target) && !animeList.contains(e.target)) {
      animeList.style.display = "none";
    }
  });
});
