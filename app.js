// ================= לוגיקת ניווט ומקלדת במסך החיפוש במובייל =================
document.addEventListener("DOMContentLoaded", () => {
    // 1. אלמנטים של הניווט התחתון
    // (החלף את הסלקטור במידה ולחצן החיפוש התחתון מוגדר אחרת אצלך)
    const searchNavBtn = document.querySelector(".nav-tabs .search-tab") || document.querySelectorAll(".nav-section-btn")[1] || document.querySelector("footer .fa-search") || document.querySelector(".search-icon");
    
    // 2. אלמנטים של שדה החיפוש והמקלדת
    const searchInput = document.getElementById("searchInput");
    const keyboard = document.getElementById("virtualKeyboard");
    const deleteBtn = document.getElementById("keyDelete");
    const spaceBtn = document.getElementById("keySpace");
    const closeBtn = document.getElementById("keyClose");
    const searchSubmitBtn = document.getElementById("searchSubmitBtn");

    // פתיחת המקלדת באופן אוטומטי כשלוחצים על תיבת הטקסט בתוך מסך החיפוש
    if (searchInput && keyboard) {
        searchInput.addEventListener("click", (e) => {
            e.stopPropagation(); // מונע סגירה מיידית מהאזנה לקליק הכללי
            keyboard.style.display = "block";
        });
    }

    // הקלדת אותיות מהמקלדת הווירטואלית
    document.querySelectorAll(".key").forEach(keyBtn => {
        // מדלגים על מקשים מיוחדים כדי שלא ידפיסו את הטקסט שלהם ("Del", "Space")
        if (keyBtn.id === "keyDelete" || keyBtn.id === "keySpace" || keyBtn.id === "keyClose") return;

        keyBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (searchInput) {
                searchInput.value += keyBtn.innerText;
                searchInput.focus(); // שומר על הפוקוס בתיבה
            }
        });
    });

    // כפתור מחיקה (תו אחרון)
    if (deleteBtn) {
        deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (searchInput) {
                searchInput.value = searchInput.value.slice(0, -1);
            }
        });
    }

    // מקש רווח
    if (spaceBtn) {
        spaceBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (searchInput) {
                searchInput.value += " ";
            }
        });
    }

    // כפתור סגירת מקלדת (Done)
    if (closeBtn) {
        closeBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (keyboard) keyboard.style.display = "none";
        });
    }

    // סגירת מקלדת בלחיצה מחוץ לאזור שלה בתוך המכשיר
    document.addEventListener("click", (e) => {
        if (keyboard && !keyboard.contains(e.target) && e.target !== searchInput) {
            keyboard.style.display = "none";
        }
    });

    // לחיצה על כפתור החיפוש - סוגרת מקלדת ומריצה חיפוש
    if (searchSubmitBtn) {
        searchSubmitBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (keyboard) keyboard.style.display = "none";
            
            const query = searchInput ? searchInput.value.trim() : "";
            console.log("Searching inside mobile frame for: ", query);
            
            // כאן המקום להוסיף את לוגיקת הסינון האמיתית של המשרות שלך במערך!
        });
    }
});
