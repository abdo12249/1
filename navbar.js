// ---------------- نظام البحث المتصل بملف JSON ----------------

// نستنى تحميل محتوى navbar.html الأول
document.addEventListener("DOMContentLoaded", () => {
  // نتحقق أولاً من تحميل الـ navbar داخل العنصر
  const navbarContainer = document.getElementById("navbar-container");

  // مراقب DOM ينتظر تحميل عناصر البحث بعد تحميل navbar.html
  const observer = new MutationObserver(() => {
    const searchInput = document.getElementById("searchInput");
    const animeList = document.getElementById("animeList");

    // لما عناصر البحث تظهر، نوقف المراقبة ونبدأ النظام
    if (searchInput && animeList) {
      observer.disconnect();
      initializeSearchSystem(searchInput, animeList);
    }
  });

  // مراقبة تغيرات داخل الـ navbar-container
  observer.observe(navbarContainer, { childList: true, subtree: true });
});

function initializeSearchSystem(searchInput, animeList) {
  const dataUrl = "https://abdo12249.github.io/1/test1/animes.json"; // مسار ملف الأنميات
  let animeData = {};

  // تحميل ملف JSON
  fetch(dataUrl)
    .then(res => res.json())
    .then(data => {
      animeData = data;
      console.log("✅ تم تحميل بيانات الأنميات بنجاح");
    })
    .catch(err => console.error("❌ فشل تحميل بيانات الأنميات:", err));

  // شكل قائمة النتائج
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

  // عند الكتابة
  searchInput.addEventListener("input", function () {
    const query = this.value.toLowerCase().trim();
    animeList.innerHTML = "";

    if (!query) {
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

      const img = document.createElement("img");
      img.src = anime.image || "https://abdo12249.github.io/1/img/no-image.webp";
      img.alt = anime.title;
      img.style.width = "40px";
      img.style.height = "55px";
      img.style.objectFit = "cover";
      img.style.borderRadius = "6px";

      const titleDiv = document.createElement("div");
      titleDiv.textContent = anime.title;
      titleDiv.style.flex = "1";

      item.addEventListener("mouseover", () => (item.style.background = "rgba(255,255,255,0.1)"));
      item.addEventListener("mouseout", () => (item.style.background = "transparent"));

      item.appendChild(img);
      item.appendChild(titleDiv);
      animeList.appendChild(item);
    });

    animeList.style.display = "block";
  });

  // إخفاء القائمة عند الضغط خارجها
  document.addEventListener("click", (e) => {
    if (!searchInput.contains(e.target) && !animeList.contains(e.target)) {
      animeList.style.display = "none";
    }
  });
}
