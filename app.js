document.addEventListener("DOMContentLoaded", () => {
    // אלמנטים לניווט וחיפוש משרות וחברות
    const searchSubmitBtn = document.getElementById("searchSubmitBtn");
    const searchInput = document.getElementById("searchInput");
    const searchResultsArea = document.getElementById("searchResultsArea");
    const virtualKeyboard = document.getElementById("virtualKeyboard");
    
    // אלמנטים של לוח ה-KPI החדש
    const kpiDashboard = document.getElementById("kpiDashboard");
    const kpiCount = document.getElementById("kpiCount");
    const kpiSalary = document.getElementById("kpiSalary");

    // אלמנטים של חלון המודל (הדרישות המלאות)
    const jobDetailModal = document.getElementById("jobDetailModal");
    const closeModalBtn = document.getElementById("closeModalBtn");
    const modalBarClose = document.getElementById("modalBarClose");
    const modalJobTitle = document.getElementById("modalJobTitle");
    const modalJobCompany = document.getElementById("modalJobCompany");
    const modalJobDetails = document.getElementById("modalJobDetails");

    // אלמנטים של התפריט העליון
    const menuBtn = document.getElementById("menuBtn");
    const dropdownMenu = document.getElementById("dropdownMenu");

    // אלמנטים של הראיונות (AI Interview)
    const generateBtn = document.getElementById('generateBtn');
    const jobInput = document.getElementById('jobInput');
    const errorBox = document.getElementById('errorBox');
    const resultsDiv = document.getElementById('results');
    const loadingDiv = document.getElementById('loading');
    const techList = document.getElementById('techList');
    const hrList = document.getElementById('hrList');
    const caseList = document.getElementById('caseList');

    // משתנה עזר לשמירת השדה שנמצא כרגע בפוקוס
    let currentActiveInput = null;

    // ================= לוגיקת תפריט מסך מלא - מוגבל למסך הטלפון בלבד =================
    if (menuBtn && dropdownMenu) {
        // וידוא שהאלמנט האבא (מסך הטלפון) מוגדר כ-relative כדי שהתפריט האבסולוטי יתקבע בתוכו
        if (dropdownMenu.parentElement) {
            dropdownMenu.parentElement.style.position = "relative";
        }

        // הגדרת סגנונות דינמיים - שינוי ל-absolute ו-100% כדי שלא יגלוש לדפדפן החיצוני
        Object.assign(dropdownMenu.style, {
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(255, 255, 255, 0.98)", // רקע לבן נקי כמעט אטום לגמרי
            zIndex: "9999",
            display: "none", // מוסתר כברירת מחדל
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "18px",
            padding: "20px",
            boxSizing: "border-box"
        });

        // בנייה מחדש של תוכן התפריט
        dropdownMenu.innerHTML = `
            <div id="closeMenuBtn" style="position: absolute; top: 15px; right: 20px; font-size: 30px; cursor: pointer; color: #1e293b; font-weight: bold; user-select: none;">&times;</div>
            
            <div class="menu-fullscreen-item" data-target="home" style="font-size: 18px; font-weight: 600; color: #3b71f7; cursor: pointer; padding: 8px 16px;">💻 Portfolio Analyzer</div>
            <div class="menu-fullscreen-item" data-target="search" style="font-size: 18px; font-weight: 600; color: #1e293b; cursor: pointer; padding: 8px 16px;">📄 Resume Checker</div>
            <div class="menu-fullscreen-item" id="menuInterviewPrep" style="font-size: 18px; font-weight: 600; color: #1e293b; cursor: pointer; padding: 8px 16px;">🎙️ Interview Prep</div>
            <div class="menu-fullscreen-item" style="font-size: 18px; font-weight: 600; color: #1e293b; cursor: pointer; padding: 8px 16px;">🗄️ Assignment DB</div>
            
            <hr style="width: 60%; border: 0; border-top: 1px solid #e2e8f0; margin: 10px 0;">
            
            <div class="menu-fullscreen-item" id="menuATSChecker" style="font-size: 18px; font-weight: 600; color: #166534; cursor: pointer; padding: 8px 16px;">📊 ATS Optimization</div>
            <div class="menu-fullscreen-item" id="menuPrivacy" style="font-size: 18px; font-weight: 600; color: #475569; cursor: pointer; padding: 8px 16px;">🔒 Privacy Settings</div>
            <div class="menu-fullscreen-item" id="menuLogout" style="font-size: 18px; font-weight: 700; color: #dc2626; cursor: pointer; padding: 8px 16px; margin-top: 10px;">🚪 Logout</div>
        `;

        // הוספת אפקט הובר דינמי באמצעות קוד לטאץ' ולעכבר
        dropdownMenu.querySelectorAll(".menu-fullscreen-item").forEach(item => {
            item.style.transition = "transform 0.15s ease, opacity 0.15s ease";
            item.addEventListener("mouseenter", () => { item.style.transform = "scale(1.04)"; item.style.opacity = "0.85"; });
            item.addEventListener("mouseleave", () => { item.style.transform = "scale(1)"; item.style.opacity = "1"; });
        });

        // פתיחת התפריט בלחיצה על כפתור ההמבורגר
        menuBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            dropdownMenu.style.display = "flex"; 
        });

        // סגירת התפריט בלחיצה על ה-X
        document.getElementById("closeMenuBtn").addEventListener("click", () => {
            dropdownMenu.style.display = "none";
        });

        // סגירה וניווט אוטומטי עבור כפתורי הניווט הסטנדרטיים
        dropdownMenu.querySelectorAll(".menu-fullscreen-item").forEach(item => {
            item.addEventListener("click", () => {
                const target = item.getAttribute("data-target");
                dropdownMenu.style.display = "none";
                if (target) {
                    const navTarget = document.querySelector(`.nav-item[data-target="${target}"]`);
                    if (navTarget) navTarget.click();
                }
            });
        });

        // חיבור ספציפי של כפתור הראיונות בתוך התפריט למערכת הניווט
        document.getElementById("menuInterviewPrep").addEventListener("click", () => {
            dropdownMenu.style.display = "none";
            const openInterviewBtn = document.getElementById("openInterviewBtn");
            if (openInterviewBtn) {
                openInterviewBtn.click();
            } else {
                // הגנת fallback במידה ואין אלמנט כזה, מפעיל ישירות את הטאב הייעודי
                const interviewSection = document.getElementById("interviewView") || document.getElementById("notificationsView");
                if (interviewSection) {
                    document.querySelectorAll(".view-section").forEach(v => v.classList.add("hidden"));
                    interviewSection.classList.remove("hidden");
                }
            }
        });

        // לוגיקה ייעודית עבור לחצן ה-ATS
        document.getElementById("menuATSChecker").addEventListener("click", () => {
            alert("ATS Optimization Engine: Scan completed. Your resume is 85% optimized for Junior Developer roles!");
        });

        // לוגיקה ייעודית עבור לחצן הגדרות פרטיות
        document.getElementById("menuPrivacy").addEventListener("click", () => {
            alert("Privacy Settings: System profile is currently secure. Anonymous application mode is enabled.");
        });

        // לוגיקה ייעודית עבור לחצן התנתקות
        document.getElementById("menuLogout").addEventListener("click", () => {
            if (confirm("Are you sure you want to log out of SkillUp AI?")) {
                alert("Logging out safely...");
                window.location.reload(); 
            }
        });
    }

    // מאגר המשרות
    const fallbackJobs = [
        { 
            title: "Junior Full Stack Developer", 
            company: { display_name: "Wix.com" }, 
            location: { display_name: "Tel Aviv - Remote" }, 
            isJunior: true,
            description: `<strong>Role Overview:</strong><br>Wix is looking for a talented Junior Full Stack Developer to join our core web engineering group...` 
        },
        { 
            title: "Junior Data Analyst", 
            company: { display_name: "Google" }, 
            location: { display_name: "Tel Aviv-Yafo" }, 
            isJunior: true,
            description: `<strong>Role Overview:</strong><br>We are looking for a brilliant Junior Data Analyst to turn data into valuable business insights...` 
        },
        { 
            title: "NOC Tier 1 Specialist", 
            company: { display_name: "Palo Alto Networks" }, 
            location: { display_name: "Tel Aviv" }, 
            isJunior: true,
            description: `<strong>Role Overview:</strong><br>Excellent entry-level opportunity for students or recent graduates! Monitor our production cloud environments...`
        },
        { 
            title: "Junior UI/UX Designer", 
            company: { display_name: "Mobileye" }, 
            location: { display_name: "Jerusalem" }, 
            isJunior: true,
            description: `<strong>Role Overview:</strong><br>Looking for an enthusiastic Junior UI/UX Designer to join our product layout unit...`
        },
        { 
            title: "Java Software Developer (Entry Level)", 
            company: { display_name: "Intel" }, 
            location: { display_name: "Haifa" }, 
            isJunior: true,
            description: `<strong>Role Overview:</strong><br>Kickstart your software engineering career. Join our validation backend framework group coding in Java...`
        },
        { 
            title: "Senior Java Software Architect", 
            company: { display_name: "Intel" }, 
            location: { display_name: "Haifa" }, 
            isJunior: false,
            description: `<strong>Role Overview:</strong><br>We are seeking a Senior Java Architect to spearhead the structural redesign...`
        },
        { 
            title: "UI/UX Product Design Lead", 
            company: { display_name: "Wix.com" }, 
            location: { display_name: "Tel Aviv" }, 
            isJunior: false,
            description: `<strong>Role Overview:</strong><br>Take full design ownership of a global product line used by over 50 million creators...`
        },
        { 
            title: "NOC & Technical Operations Manager", 
            company: { display_name: "Palo Alto Networks" }, 
            location: { display_name: "Tel Aviv" }, 
            isJunior: false,
            description: `<strong>Role Overview:</strong><br>We are searching for a seasoned NOC Manager to direct our global 24/7 technical incident response...`
        },
        { 
            title: "Senior Machine Learning Engineer", 
            company: { display_name: "Google" }, 
            location: { display_name: "Tel Aviv-Yafo" }, 
            isJunior: false,
            description: `<strong>Role Overview:</strong><br>We are looking for an expert ML Engineer to build scalable infrastructure for training and deploying deep learning models...` 
        }
    ];

    // פונקציית החיפוש והטעינה הכללית
    async function handleSearch() {
        let query = searchInput ? searchInput.value.trim() : "";
        
        if (!query) {
            const juniorJobs = fallbackJobs.filter(job => job.isJunior === true);
            updateKPIMetrics("Junior", juniorJobs);
            renderJobCards(juniorJobs);
            return;
        }

        if (searchResultsArea) {
            searchResultsArea.innerHTML = `
                <div class="loading-screen">
                    <div class="loader-circle"></div>
                    <p style="color: #64748b;">Scanning tech ecosystem in Israel...</p>
                </div>`;
        }

        try {
            const url = `https://api.adzuna.com/v1/api/jobs/il/search/1?app_id=c49747cb&app_key=9b83bba0ba50b070bc064a787cd04052&what=${encodeURIComponent(query)}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error("API Network issue or CORS block");
            
            const data = await response.json();
            const jobs = data.results || [];
            
            if (jobs.length === 0) {
                useFallbackSearch(query);
            } else {
                updateKPIMetrics(query, jobs);
                renderJobCards(jobs);
            }
        } catch (error) {
            console.warn("External API restricted. Switching to smart fallback matching.", error);
            useFallbackSearch(query);
        }
    }

    function useFallbackSearch(query) {
        const lowerQuery = query.toLowerCase();
        const filteredJobs = fallbackJobs.filter(job => 
            job.title.toLowerCase().includes(lowerQuery) || 
            job.company.display_name.toLowerCase().includes(lowerQuery) || 
            job.description.toLowerCase().includes(lowerQuery)
        );
        const finalJobs = filteredJobs.length > 0 ? filteredJobs : fallbackJobs.filter(job => job.isJunior === true);
        updateKPIMetrics(query, finalJobs);
        renderJobCards(finalJobs);
    }

    function updateKPIMetrics(query, jobs) {
        if (!kpiDashboard || !kpiCount || !kpiSalary) return;
        kpiDashboard.classList.remove("hidden");
        kpiCount.textContent = `${jobs.length} openings found`;
        const lowerQuery = query.toLowerCase();
        
        if (lowerQuery.includes("senior") || lowerQuery.includes("manager") || lowerQuery.includes("architect") || lowerQuery.includes("lead")) {
            kpiSalary.textContent = "₪32,000 - ₪46,000 / mo";
        } else {
            kpiSalary.textContent = "₪14,000 - ₪20,000 / mo";
        }
    }

    function renderJobCards(jobs) {
        if (!searchResultsArea) return;
        searchResultsArea.innerHTML = "";
        
        jobs.forEach((job) => {
            const card = document.createElement("div");
            card.className = "card";
            card.style.cursor = "pointer";
            card.style.marginBottom = "12px";
            
            const companyName = job.company?.display_name || "Tech Enterprise";
            const locationName = job.location?.display_name || "Israel (Remote/Hybrid)";
            
            let levelBadge = job.isJunior 
                ? `<span style="font-size: 10px; background: #f0fdf4; color: #166534; padding: 2px 6px; border-radius: 4px; margin-left: 8px; font-weight: bold;">Junior Friendly</span>`
                : `<span style="font-size: 10px; background: #fff7ed; color: #c2410c; padding: 2px 6px; border-radius: 4px; margin-left: 8px; font-weight: bold;">Senior</span>`;

            card.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 5px;">
                    <h3 style="margin: 0; color: #1e293b; font-size: 15px; font-weight:700;">${job.title}</h3>
                    ${levelBadge}
                </div>
                <p style="margin: 0 0 10px 0; color: #3b71f7; font-weight: 600; font-size: 13px;">🏢 ${companyName}</p>
                <div style="display: flex; justify-content: space-between; align-items: center; direction: ltr;">
                    <span style="font-size: 11px; color: #64748b;">📍 ${locationName}</span>
                    <span style="font-size: 11px; background: #e0f2fe; color: #0369a1; padding: 2px 8px; border-radius: 12px; font-weight: 600;">Details</span>
                </div>
            `;
            card.addEventListener("click", () => openJobModal(job));
            searchResultsArea.appendChild(card);
        });
    }

    function openJobModal(job) {
        if (!jobDetailModal) return;
        modalJobTitle.textContent = job.title;
        modalJobCompany.textContent = job.company?.display_name || "Tech Enterprise";
        
        const applyUrl = job.redirect_url || "#";
        const externalLinkBtn = job.redirect_url 
            ? `<a href="${applyUrl}" target="_blank" class="primary-btn" style="display: block; text-align: center; text-decoration: none;">Apply External Link</a>`
            : `<button class="primary-btn" onclick="alert('Application submitted via SkillUp AI!')">Quick Apply Now</button>`;

        modalJobDetails.innerHTML = `
            <p style="margin-bottom: 12px; font-size:13px; color:#475569;"><strong>Location:</strong> ${job.location?.display_name || "Israel"}</p>
            <div style="font-size: 13px; color: #334155; line-height: 1.6; margin-bottom: 20px; max-height:260px; overflow-y:auto;">
                ${job.description}
            </div>
            ${externalLinkBtn}
        `;
        jobDetailModal.classList.remove("hidden");
    }

    if (closeModalBtn) closeModalBtn.addEventListener("click", () => jobDetailModal.classList.add("hidden"));
    if (modalBarClose) modalBarClose.addEventListener("click", () => jobDetailModal.classList.add("hidden"));

    if (searchSubmitBtn) {
        searchSubmitBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (virtualKeyboard) virtualKeyboard.style.display = "none";
            handleSearch();
        });
    }
    if (searchInput) searchInput.addEventListener("input", handleSearch);

    // הפעלה ראשונית של המשרות
    handleSearch();

    // ================= AI INTERVIEW LOGIC =================
    if (generateBtn) {
        generateBtn.addEventListener('click', async () => {
            const jobDescription = jobInput.value.trim();
            if (!jobDescription) {
                showError("Please paste a job description first.");
                return;
            }
            errorBox.classList.add('hidden');
            resultsDiv.classList.add('hidden');
            loadingDiv.classList.remove('hidden');
            generateBtn.disabled = true;

            try {
                const response = await fetch('/api/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ jobDescription })
                });
                if (!response.ok) throw new Error("Server failed.");
                const data = await response.json();
                
                populateList(techList, data.technical);
                populateList(hrList, data.behavioral);
                populateList(caseList, data.caseStudy);

                loadingDiv.classList.add('hidden');
                resultsDiv.classList.remove('hidden');
            } catch (error) {
                loadingDiv.classList.add('hidden');
                showError("An error occurred while connecting to the AI. Please try again.");
            } finally {
                generateBtn.disabled = false;
            }
        });
    }

    function populateList(listElement, items) {
        if (!listElement) return;
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
        if (!errorBox) return;
        errorBox.textContent = message;
        errorBox.classList.remove('hidden');
    }

    // ================= מערכת ניווט מובנית בין מסכים וכפתורי ה-Launch במערכת =================
    const navItems = document.querySelectorAll(".nav-item");
    const views = document.querySelectorAll(".view-section");

    function switchView(targetViewId) {
        views.forEach(v => v.classList.add("hidden"));
        const targetView = document.getElementById(targetViewId);
        if (targetView) targetView.classList.remove("hidden");
        if (virtualKeyboard) virtualKeyboard.style.display = "none";
    }

    navItems.forEach(item => {
        item.addEventListener("click", () => {
            const target = item.getAttribute("data-target");
            navItems.forEach(i => i.classList.remove("active"));
            item.classList.add("active");

            if (target === "home") switchView("dashboardView");
            if (target === "search") { switchView("searchView"); handleSearch(); }
            if (target === "notifications") switchView("notificationsView"); // משמש גם כטקסט אינטרוויוז בחלק מהגרסאות
            if (target === "profile") switchView("profileView");
        });
    });

    // חיבור דינמי לכל כפתורי ה-Launch הישירים בדף הבית המקורי שלך!
    document.querySelectorAll(".card .primary-btn, .card button").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const cardTitle = btn.parentElement.querySelector("h3")?.textContent || "";
            
            if (cardTitle.includes("Interview") || btn.id === "openInterviewBtn") {
                e.preventDefault();
                e.stopPropagation();
                // מפעיל את תצוגת סימולטור הראיונות (notificationsView / interviewView)
                const interviewSection = document.getElementById("interviewView") || document.getElementById("notificationsView");
                if (interviewSection) {
                    switchView(interviewSection.id);
                    // עדכון מצב האקטיב בבר התחתון
                    navItems.forEach(i => i.classList.remove("active"));
                    const interviewNav = document.querySelector('.nav-item[data-target="notifications"]');
                    if (interviewNav) interviewNav.classList.add("active");
                }
            } else if (cardTitle.includes("Resume") || cardTitle.includes("Checker")) {
                e.preventDefault();
                e.stopPropagation();
                switchView("searchView");
                const searchNav = document.querySelector('.nav-item[data-target="search"]');
                if (searchNav) searchNav.classList.add("active");
            }
        });
    });

    const backToHomeBtn = document.getElementById("backToHomeBtn");
    if (backToHomeBtn) {
        backToHomeBtn.addEventListener("click", () => switchView("dashboardView"));
    }

    // ================= לוגיקת המקלדת הווירטואלית =================
    if (searchInput) {
        searchInput.addEventListener("focus", () => { currentActiveInput = searchInput; if (virtualKeyboard) virtualKeyboard.style.display = "block"; });
    }
    if (jobInput) {
        jobInput.addEventListener("focus", () => { currentActiveInput = jobInput; if (virtualKeyboard) virtualKeyboard.style.display = "block"; });
    }

    const keys = document.querySelectorAll(".key");
    keys.forEach(key => {
        key.addEventListener("click", function (e) {
            e.preventDefault();
            if (currentActiveInput) {
                currentActiveInput.value += key.innerText;
                currentActiveInput.focus();
                if (currentActiveInput === searchInput) handleSearch();
            }
        });
    });

    const keyDelete = document.getElementById("keyDelete");
    if (keyDelete) {
        keyDelete.addEventListener("click", function (e) {
            e.preventDefault();
            if (currentActiveInput && currentActiveInput.value.length > 0) {
                currentActiveInput.value = currentActiveInput.value.slice(0, -1);
                currentActiveInput.focus();
                if (currentActiveInput === searchInput) handleSearch();
            }
        });
    }

    const keySpace = document.getElementById("keySpace");
    if (keySpace) {
        keySpace.addEventListener("click", function (e) {
            e.preventDefault();
            if (currentActiveInput) {
                currentActiveInput.value += " ";
                currentActiveInput.focus();
                if (currentActiveInput === searchInput) handleSearch();
            }
        });
    }

    const keyClose = document.getElementById("keyClose");
    if (keyClose) {
        keyClose.addEventListener("click", function (e) {
            e.preventDefault();
            if (virtualKeyboard) virtualKeyboard.style.display = "none";
            if (currentActiveInput) currentActiveInput.blur();
        });
    }

    // ================= תוספת עיצוב: כרטיסיות פרופיל =================
    function upgradeProfileLayout() {
        const profileView = document.getElementById("profileView");
        if (!profileView) return;

        const profileData = [
            { title: "Education", text: "Social Sciences & Tech Student.", icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b71f7" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5-10 5z"></path><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path></svg>` },
            { title: "Background", text: "Motivated university student with a strong passion for technology.", icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b71f7" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>` },
            { title: "Target Goal", text: "Looking for my first opportunity in the Tech industry.", icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b71f7" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle></svg>` }, 
            { title: "Top Skills", text: `<ul style="margin: 0; padding-left: 16px;"><li>Python</li><li>SQL</li><li>JavaScript</li><li>Git</li></ul>`, icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b71f7" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>` }
        ];

        let profileCardsContainer = document.getElementById("profileCardsContainer");
        if (!profileCardsContainer) {
            profileCardsContainer = document.createElement("div");
            profileCardsContainer.id = "profileCardsContainer";
            profileCardsContainer.style.marginTop = "20px";
            profileCardsContainer.style.display = "flex";
            profileCardsContainer.style.flexDirection = "column";
            profileCardsContainer.style.gap = "14px"; 

            const oldAboutMeBlock = profileView.querySelector(".card") ? profileView.querySelectorAll(".card")[1] : null;
            if (oldAboutMeBlock) oldAboutMeBlock.replaceWith(profileCardsContainer);
            else profileView.appendChild(profileCardsContainer);
        }

        profileCardsContainer.innerHTML = "";
        profileData.forEach(item => {
            const squareCard = document.createElement("div");
            squareCard.style.backgroundColor = "#ffffff";
            squareCard.style.borderRadius = "12px";
            squareCard.style.padding = "16px";
            squareCard.style.border = "1px solid #e2e8f0";
            squareCard.style.textAlign = "left"; 
            squareCard.style.direction = "ltr";

            squareCard.innerHTML = `
                <div style="display: flex; align-items: center; margin-bottom: 8px; gap: 10px;">
                    <div style="background: #eff6ff; width: 32px; height: 32px; display: flex; justify-content: center; align-items: center; border-radius: 8px;">
                        ${item.icon}
                    </div>
                    <strong style="color: #1e293b; font-size: 14px;">${item.title}:</strong>
                </div>
                <div style="margin: 0; color: #475569; font-size: 13px; padding-left: 42px;">
                    ${item.text}
                </div>
            `;
            profileCardsContainer.appendChild(squareCard);
        });
    }
    upgradeProfileLayout();
});
