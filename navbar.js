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




// ---------------------- نظام البحث ----------------------

document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchInput");
    const animeList = document.getElementById("animeList");

    if (!searchInput || !animeList) return;

    let animeData = {};

    // تحميل بيانات الأنميات من ملف JSON
    fetch("https://abdo12249.github.io/1/test1/animes.json")
        .then(res => res.json())
        .then(data => {
            animeData = data;
        })
        .catch(err => console.error("حدث خطأ أثناء تحميل ملف animes.json:", err));

    // دالة عرض النتائج
    function showResults(query) {
        animeList.innerHTML = "";
        if (!query.trim()) {
            animeList.style.display = "none";
            return;
        }

        const results = Object.entries(animeData).filter(([key, anime]) =>
            anime.title.toLowerCase().includes(query.toLowerCase())
        );

        if (results.length === 0) {
            animeList.innerHTML = "<p style='padding:8px;text-align:center;'>لا يوجد نتائج</p>";
            animeList.style.display = "block";
            return;
        }

        results.forEach(([id, anime]) => {
            const item = document.createElement("div");
            item.classList.add("search-item");

            const imgSrc = anime.image && anime.image.trim() !== "" 
                ? anime.image 
                : "https://via.placeholder.com/60x80?text=No+Image";

            item.innerHTML = `
                <img src="${imgSrc}" alt="${anime.title}">
                <span>${anime.title}</span>
            `;

            item.addEventListener("click", () => {
                // افتح صفحة الأنمي (غير الرابط حسب نظام موقعك)
                window.location.href = `https://abdo12249.github.io/1/tag/wep/${id}.html`;
            });

            animeList.appendChild(item);
        });

        animeList.style.display = "block";
    }

    // تفعيل البحث أثناء الكتابة
    searchInput.addEventListener("input", (e) => {
        showResults(e.target.value);
    });

    // إخفاء القائمة عند النقر خارجها
    document.addEventListener("click", (e) => {
        if (!animeList.contains(e.target) && e.target !== searchInput) {
            animeList.style.display = "none";
        }
    });
});
