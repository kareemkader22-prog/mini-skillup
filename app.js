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
    const searchResultsArea = document.getElementById("searchResultsArea");

    // ================= DATA: MOCK JOBS DATABASE =================
    // מאגר משרות דמו כדי שיהיה מה לחפש ולהציג
    const jobsDatabase = [
        { title: "Machine Learning Developer", company: "Google", location: "Tel Aviv", tags: ["Python", "AI", "TensorFlow"] },
        { title: "Data Scientist", company: "Meta", location: "Remote", tags: ["Python", "SQL", "Machine Learning"] },
        { title: "Data Engineer", company: "Microsoft", location: "Herzliya", tags: ["SQL", "Big Data", "Spark"] },
        { title: "AI Research Engineer", company: "OpenAI", location: "Tel Aviv", tags: ["PyTorch", "NLP", "LLM"] },
        { title: "Junior Full Stack Developer", company: "Mobileye", location: "Jerusalem", tags: ["JavaScript", "React", "Node.js"] }
    ];

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
                // כשנכנסים למסך, נציג את כל המשרות כברירת מחדל
                renderJobs(jobsDatabase);
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

    // ================= SEARCH & FILTER LOGIC =================

    // פונקציה שמקבלת רשימת משרות ומציירת אותן יפה על המסך בעיצוב מובייל נקי
    function renderJobs(jobsToRender) {
        if (!searchResultsArea) return;
        
        searchResultsArea.innerHTML = ""; // מנקים את התוצאות הקודמות

        if (jobsToRender.length === 0) {
            searchResultsArea.innerHTML = `
                <p style="color: #94a3b8; text-align: center; margin-top: 20px; font-size: 14px;">
                    No jobs found matching your search.
                </p>`;
            return;
        }

        // יוצרים כרטיס לכל משרה
        jobsToRender.forEach(job => {
            const card = document.createElement("div");
            card.style.cssText = `
                background: white;
                border: 1px solid #e2e8f0;
                border-radius: 12px;
                padding: 14px;
                margin-bottom: 12px;
                text-align: left;
                box-shadow: 0 2px 4px rgba(0,0,0,0.02);
                direction: ltr;
            `;

            // יצירת תגיות טכנולוגיה קטנות
            const tagsHTML = job.tags.map(tag => `
                <span style="background: #eff6ff; color: #1d4ed8; font-size: 11px; padding: 4px 8px; border-radius: 6px; font-weight: 500;">${tag}</span>
            `).join("");

            card.innerHTML = `
                <h4 style="margin: 0; color: #1e293b; font-size: 16px; font-weight: 600;">${job.title}</h4>
                <p style="margin: 4px 0; color: #64748b; font-size: 13px;">${job.company} • <span style="color: #94a3b8;">${job.location}</span></p>
                <div style="display: flex; gap: 6px; margin-top: 8px; flex-wrap: wrap;">
                    ${tagsHTML}
                </div>
            `;
            searchResultsArea.appendChild(card);
        });
    }

    // פונקציית הסינון בפועל לפי מה שכתוב בתיבת הטקסט
    function handleSearch() {
        const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
        
        // אם התיבה ריקה, נציג את כל המשרות
        if (query === "") {
            renderJobs(jobsDatabase);
            return;
        }

        // סינון המערך - בודק אם המילה קיימת בכותרת, בחברה או בתגיות
        const filteredJobs = jobsDatabase.filter(job => {
            return job.title.toLowerCase().includes(query) || 
                   job.company.toLowerCase().includes(query) ||
                   job.tags.some(tag => tag.toLowerCase().includes(query));
        });

        renderJobs(filteredJobs);
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
        if (keyBtn.id === "keyDelete" || keyBtn.id === "keySpace" || keyBtn.id === "keyClose") return;

        keyBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (searchInput) {
                searchInput.value += keyBtn.innerText;
                searchInput.focus();
                handleSearch(); // מריץ סינון מיידי תוך כדי הקלדה!
            }
        });
    });

    // כפתור מחיקה (תו אחרון)
    if (deleteBtn) {
        deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (searchInput) {
                searchInput.value = searchInput.value.slice(0, -1);
                handleSearch(); // מעדכן את החיפוש אחרי המחיקה
            }
        });
    }

    // מקש רווח
    if (spaceBtn) {
        spaceBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (searchInput) {
                searchInput.value += " ";
                handleSearch();
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

    // סגירת מקלדת בלחיצה מחוץ לאזור שלה
    document.addEventListener("click", (e) => {
        if (keyboard && !keyboard.contains(e.target) && e.target !== searchInput) {
            keyboard.style.display = "none";
        }
    });

    // לחיצה על כפתור החיפוש הראשי (Search)
    if (searchSubmitBtn) {
        searchSubmitBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (keyboard) keyboard.style.display = "none";
            handleSearch(); // מריץ סינון אחרון וסוגר מקלדת
        });
    }

    // תמיכה גם בהקלדה רגילה מהמקלדת של המחשב למי שמפתח בדפדפן
    if (searchInput) {
        searchInput.addEventListener("input", handleSearch);
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
        loadingDiv.remove('hidden');
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
