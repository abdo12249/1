const historyKey = "browsingHistory";

// الحصول على السجل الموجود أو إنشاء سجل جديد
let history = JSON.parse(localStorage.getItem(historyKey)) || [];

// إضافة الصفحة الحالية إلى السجل (مع تجنب صفحة سجل المشاهدة والتكرار)
function addToHistory(pageName, pageURL = window.location.href) {
    // لا تسجل صفحة سجل المشاهدة
    if (
        pageName.includes("سجل المشاهدة") ||
        pageURL.includes("watch-history") ||
        pageURL.includes("سجل")
    ) {
        return;
    }

    // حذف أي نسخة قديمة لنفس الرابط
    history = history.filter(entry => entry.url !== pageURL);

    // إضافة الصفحة إلى أول السجل (الأحدث في الأعلى)
    history.unshift({ name: pageName, url: pageURL });

    // حفظ التحديث
    localStorage.setItem(historyKey, JSON.stringify(history));
}

// عرض السجل في الصفحة
function displayHistory() {
    const historyList = document.getElementById("history-list");
    if (historyList) {
        historyList.innerHTML = ""; // تفريغ القائمة

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
                link.target = "_self";

                listItem.appendChild(link);
                historyList.appendChild(listItem);
            });
        }
    }
}

// مسح السجل
function clearHistory() {
    history = [];
    localStorage.removeItem(historyKey);
    displayHistory();
}

// عكس ترتيب السجل
function reverseHistory() {
    history.reverse();
    localStorage.setItem(historyKey, JSON.stringify(history));
    displayHistory();
}

// ربط الأزرار بالوظائف إن وجدت
const clearHistoryButton = document.getElementById("clear-history");
if (clearHistoryButton) {
    clearHistoryButton.addEventListener("click", clearHistory);
}

const reverseHistoryButton = document.getElementById("reverse-history");
if (reverseHistoryButton) {
    reverseHistoryButton.addEventListener("click", reverseHistory);
}

// ❌ لا تضف الصفحة هنا تلقائياً، خلي صفحات مثل "المشاهدة.html" تضيفها بنفسها بعد تحميل البيانات
// const currentPage = document.title || "صفحة غير معنونة";
// addToHistory(currentPage, window.location.href);

// ✅ لكن اعرض السجل إن وجد عنصر العرض
displayHistory();
