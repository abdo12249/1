document.addEventListener("DOMContentLoaded", function () {

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
                document.body.classList.add('dark-mode'); // ثيم افتراضي
            }
        }

        // تطبيق الثيم عند تحميل الصفحة
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
            console.log("لم يتم العثور على themeToggle. سيتم المحاولة مرة أخرى بعد 1 ثانية...");
            setTimeout(initializeElements, 1000);
            return;
        }

        // عنصر القائمة الجانبية للموبايل
        const menuBtn = document.getElementById('menu-btn');
        const sidebar = document.getElementById('sidebar');
        if (menuBtn && sidebar) {
            menuBtn.addEventListener('click', () => {
                sidebar.classList.toggle('active');
            });
        } else {
            console.log("لم يتم العثور على menu-btn أو sidebar. سيتم المحاولة مرة أخرى بعد 1 ثانية...");
            setTimeout(initializeElements, 1000);
            return;
        }

        console.log("تم العثور على جميع العناصر المطلوبة وتفعيل الأحداث.");
    }

    // استدعاء الوظيفة لأول مرة
    initializeElements();


    // ====== كود المفضلة ======
    let currentPage = {
        url: window.location.href,
        title: document.title
    };

    let savedSites = localStorage.getItem("savedSites") ? JSON.parse(localStorage.getItem("savedSites")) : [];

    function updateButtonState() {
        let button = document.getElementById("saveButton");
        if (!button) return;

        let isSaved = savedSites.some(site => site.url === currentPage.url);

        if (isSaved) {
            button.textContent = "إزالة من المفضلة";
            button.classList.add("saved");
            button.classList.remove("not-saved");
        } else {
            button.textContent = "إضافة للمفضلة";
            button.classList.add("not-saved");
            button.classList.remove("saved");
        }
    }

    function toggleLink() {
        let index = savedSites.findIndex(site => site.url === currentPage.url);

        if (index === -1) {
            savedSites.push(currentPage);
        } else {
            savedSites.splice(index, 1);
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
            anchor.target = "_blank";
            listItem.appendChild(anchor);
            list.appendChild(listItem);
        });
    }

    function clearLinks() {
        localStorage.removeItem("savedSites");
        loadLinks();
    }

    if (document.getElementById("saveButton")) {
        updateButtonState();
        document.getElementById("saveButton").addEventListener("click", toggleLink);
    }

    if (document.getElementById("linksList")) {
        loadLinks();
        let clearButton = document.getElementById("clearButton");
        if (clearButton) clearButton.addEventListener("click", clearLinks);
    }

    const searchInput = document.getElementById("searchInput");
const animeList = document.getElementById("animeList");

let animesData = {};

if (searchInput && animeList) {
    fetch("test1/animes.json")
        .then(response => response.json())
        .then(data => {
            animesData = data;
        })
        .catch(error => console.error("حدث خطأ أثناء تحميل ملف الأنمي:", error));

    // لما المستخدم يكتب
    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase().trim();
        animeList.innerHTML = "";

        if (query.length === 0) return;

        const results = Object.keys(animesData).filter(key =>
            animesData[key].title.toLowerCase().includes(query)
        );

        if (results.length === 0) {
            animeList.innerHTML = "<p>لم يتم العثور على نتائج</p>";
            return;
        }

        results.forEach(key => {
            const anime = animesData[key];
            const animeItem = document.createElement("div");
            animeItem.classList.add("anime-item");
            animeItem.style.cursor = "pointer";
            animeItem.innerHTML = `
                <img src="${anime.image}" alt="${anime.title}" width="50">
                <span>${anime.title}</span>
            `;

            // عند الضغط على النتيجة، يروح لصفحة الأنمي
            animeItem.addEventListener("click", () => {
                window.location.href = anime.url; // تأكد إن animes.json فيه "url"
            });

            animeList.appendChild(animeItem);
        });
    });
}
