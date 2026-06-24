document.addEventListener('DOMContentLoaded', () => {
    // --- Navigation Variables ---
    const dashboardView = document.getElementById('dashboardView');
    const interviewView = document.getElementById('interviewView');
    const searchView = document.getElementById('searchView');
    const notificationsView = document.getElementById('notificationsView');
    const profileView = document.getElementById('profileView');

    const openInterviewBtn = document.getElementById('openInterviewBtn');
    const backToHomeBtn = document.getElementById('backToHomeBtn');
    const navItems = document.querySelectorAll('.nav-item');

    // --- Interview Feature Variables ---
    const generateBtn = document.getElementById('generateBtn');
    const jobInput = document.getElementById('jobInput');
    const loadingDiv = document.getElementById('loading');
    const resultsDiv = document.getElementById('results');
    const errorBox = document.getElementById('errorBox');
    const techList = document.getElementById('techList');
    const hrList = document.getElementById('hrList');
    const caseList = document.getElementById('caseList');

    // --- Search & Virtual Keyboard Variables ---
    const searchInput = document.getElementById("searchInput");
    const keyboard = document.getElementById("virtualKeyboard");
    const deleteBtn = document.getElementById("keyDelete");
    const spaceBtn = document.getElementById("keySpace");
    const closeBtn = document.getElementById("keyClose");
    const searchSubmitBtn = document.getElementById("searchSubmitBtn");

    // פונקציה שמסתירה את כל הדפים בבת אחת
    function hideAllViews() {
        dashboardView.classList.add('hidden');
        interviewView.classList.add('hidden');
        searchView.classList.add('hidden');
        notificationsView.classList.add('hidden');
        profileView.classList.add('hidden');
    }

    // ================= APP NAVIGATION LOGIC =================
    
    // Switch to Interview Generator
    openInterviewBtn.addEventListener('click', () => {
        hideAllViews();
        interviewView.classList.remove('hidden');
        updateBottomNav('none'); // clear bottom nav selection
    });

    // Switch back to Dashboard
    backToHomeBtn.addEventListener('click', () => {
        hideAllViews();
        dashboardView.classList.remove('hidden');
        updateBottomNav('home');
    });

    // Bottom Navigation Clicks
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const target = item.getAttribute('data-target');
            hideAllViews();
            
            if (target === 'home') {
                dashboardView.classList.remove('hidden');
                updateBottomNav('home');
            } else if (target === 'search') {
                searchView.classList.remove('hidden');
                updateBottomNav('search');
            } else if (target === 'notifications') {
                notificationsView.classList.remove('hidden');
                updateBottomNav('notifications');
            } else if (target === 'profile') {
                profileView.classList.remove('hidden');
                updateBottomNav('profile');
            }
        });
    });

    function updateBottomNav(targetId) {
        navItems.forEach(nav => {
            if(nav.getAttribute('data-target') === targetId) {
                nav.classList.add('active');
            } else {
                nav.classList.remove('active');
            }
        });
    }

    // ================= VIRTUAL KEYBOARD LOGIC =================

    // פתיחת המקלדת בלחיצה על תיבת הטקסט של החיפוש
    if (searchInput && keyboard) {
        searchInput.addEventListener("click", (e) => {
            e.stopPropagation();
            keyboard.style.display = "block";
        });
    }

    // הוספת האותיות בלחיצה על המקשים
    document.querySelectorAll(".key").forEach(keyBtn => {
        // מדלגים על מקשים מיוחדים כדי שלא ידפיסו את הטקסט הפנימי שלהם
        if (keyBtn.id === "keyDelete" || keyBtn.id === "keySpace" || keyBtn.id === "keyClose") return;

        keyBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (searchInput) {
                searchInput.value += keyBtn.innerText;
                searchInput.focus();
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

    // כפתור סגירה (Done)
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

    // דימוי ביצוע חיפוש וסגירת מקלדת
    if (searchSubmitBtn) {
        searchSubmitBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (keyboard) keyboard.style.display = "none";
            
            const query = searchInput ? searchInput.value.trim() : "";
            console.log("Searching for: ", query);
            
            // כאן תוכל להוסיף בעתיד לוגיקת סינון רשומות אמיתית
        });
    }

    // ================= AI INTERVIEW LOGIC =================

    generateBtn.addEventListener('click', async () => {
        const jobDescription = jobInput.value.trim();
        
        if (!jobDescription) {
            showError("Please paste a job description first.");
            return;
        }

        // Reset UI
        errorBox.classList.add('hidden');
        resultsDiv.classList.add('hidden');
        loadingDiv.classList.remove('hidden');
        generateBtn.disabled = true;

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ jobDescription })
            });

            if (!response.ok) {
                throw new Error("Server failed to generate questions.");
            }

            const data = await response.json();
            
            // Populate lists
            populateList(techList, data.technical);
            populateList(hrList, data.behavioral);
            populateList(caseList, data.caseStudy);

            // Show results
            loadingDiv.classList.add('hidden');
            resultsDiv.classList.remove('hidden');

        } catch (error) {
            console.error(error);
            loadingDiv.classList.add('hidden');
            showError("An error occurred while connecting to the AI. Please try again.");
        } finally {
            generateBtn.disabled = false;
        }
    });

    function populateList(listElement, items) {
        listElement.innerHTML = '';
        if (!items || items.length === 0) {
            listElement.innerHTML = '<li>No questions generated.</li>';
            return;
        }
        items.forEach(item => {
            const li = document.createElement('li');
            
            li.textContent = item;
            listElement.appendChild(li);
        });
    }

    function showError(message) {
        errorBox.textContent = message;
        errorBox.classList.remove('hidden');
    }
});
