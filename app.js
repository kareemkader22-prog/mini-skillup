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

    // ================= עדכון תפריט מובייל למסך מלא בעיצוב נקי (כמו Enhancv) =================
    if (menuBtn && dropdownMenu) {
        // הגדרת המכולה הראשית של התפריט שתיפתח על כל המסך מלמעלה
        dropdownMenu.style.position = "absolute";
        dropdownMenu.style.top = "0";
        dropdownMenu.style.left = "0";
        dropdownMenu.style.width = "100%";
        dropdownMenu.style.height = "100%";
        dropdownMenu.style.backgroundColor = "#ffffff";
        dropdownMenu.style.zIndex = "99999";
        dropdownMenu.style.padding = "24px 24px";
        dropdownMenu.style.boxSizing = "border-box";
        dropdownMenu.style.flexDirection = "column";
        dropdownMenu.style.display = "none";
        dropdownMenu.style.borderRadius = "32px"; // התאמה לקימור המכשיר
        dropdownMenu.style.overflowY = "auto";

        // יצירת מבנה הניווט החלק עם שורות, חצים ו-X לסגירה בצד ימין
        dropdownMenu.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="background: #eff6ff; width: 32px; height: 32px; display: flex; justify-content: center; align-items: center; border-radius: 8px;">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b71f7" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                    </div>
                    <span style="font-size: 18px; font-weight: 800; color: #1e293b; font-family: system-ui;">SkillUp AI</span>
                </div>
                <button id="closeFullscreenMenu" style="background: none; border: none; font-size: 22px; cursor: pointer; color: #1e293b; padding: 5px; font-weight: 300;">✕</button>
            </div>

            <div style="display: flex; flex-direction: column; width: 100%;">
                
                <div class="menu-linear-item" data-target="home" style="display: flex; justify-content: space-between; align-items: center; padding: 18px 0; border-bottom: 1px solid #f1f5f9; cursor: pointer;">
                    <span style="font-size: 16px; font-weight: 600; color: #1e293b;">Portfolio Analyzer</span>
                    <span style="color: #94a3b8; font-size: 16px; font-weight: 400;">›</span>
                </div>

                <div class="menu-linear-item" data-target="home" style="display: flex; justify-content: space-between; align-items: center; padding: 18px 0; border-bottom: 1px solid #f1f5f9; cursor: pointer;">
                    <span style="font-size: 16px; font-weight: 600; color: #1e293b;">Resume Checker</span>
                    <span style="color: #94a3b8; font-size: 16px; font-weight: 400;">›</span>
                </div>

                <div id="linearMenuInterview" style="display: flex; justify-content: space-between; align-items: center; padding: 18px 0; border-bottom: 1px solid #f1f5f9; cursor: pointer;">
                    <span style="font-size: 16px; font-weight: 600; color: #1e293b;">Interview Generator</span>
                    <span style="color: #94a3b8; font-size: 16px; font-weight: 400;">›</span>
                </div>

                <div class="menu-linear-item" data-target="home" style="display: flex; justify-content: space-between; align-items: center; padding: 18px 0; border-bottom: 1px solid #f1f5f9; cursor: pointer;">
                    <span style="font-size: 16px; font-weight: 600; color: #1e293b;">Assignment DB</span>
                    <span style="color: #94a3b8; font-size: 16px; font-weight: 400;">›</span>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; padding: 18px 0; border-bottom: 1px solid #f1f5f9; cursor: pointer;" onclick="alert('ATS Keyword Match Engine coming soon!')">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="font-size: 16px; font-weight: 600; color: #1e293b;">ATS Optimization</span>
                        <span style="background: #e0f2fe; color: #0369a1; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px;">PRO</span>
                    </div>
                    <span style="color: #94a3b8; font-size: 16px; font-weight: 400;">›</span>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; padding: 18px 0; border-bottom: 1px solid #f1f5f9; cursor: pointer;" onclick="alert('Privacy Controls: Stored data is fully encrypted.')">
                    <span style="font-size: 16px; font-weight: 600; color: #1e293b;">Privacy & Settings</span>
                    <span style="color: #94a3b8; font-size: 16px; font-weight: 400;">›</span>
                </div>

            </div>

            <div style="margin-top: auto; padding-top: 40px; display: flex; flex-direction: column; gap: 12px; width: 100%;">
                <button class="primary-btn" style="margin: 0; width: 100%; border-radius: 8px; padding: 14px; font-weight: 600;" onclick="alert('Welcome back, Yosef!')">Sign In</button>
                <button style="width: 100%; background: #f8fafc; border: 1px solid #e2e8f0; color: #475569; padding: 14px; border-radius: 8px; font-weight: 600; cursor: pointer;" onclick="alert('Starting fresh workflow setup...')">Get Started</button>
            </div>
        `;

        // פתיחת התפריט בלחיצה על כפתור ההמבורגר
        menuBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            dropdownMenu.style.display = "flex";
        });

        // סגירת התפריט בלחיצה על כפתור ה-✕
        document.getElementById("closeFullscreenMenu").addEventListener("click", (e) => {
            e.stopPropagation();
            dropdownMenu.style.display = "none";
        });

        // ניווט בלחיצה על השורות
        const menuLinearItems = dropdownMenu.querySelectorAll(".menu-linear-item");
        menuLinearItems.forEach(item => {
            item.addEventListener("click", () => {
                const target = item.getAttribute("data-target");
                dropdownMenu.style.display = "none";
                const matchingNav = document.querySelector(`.nav-item[data-target="${target}"]`);
                if (matchingNav) matchingNav.click();
            });
        });

        // ניווט מותאם אישית לטאב הראיונות
        document.getElementById("linearMenuInterview").addEventListener("click", () => {
            dropdownMenu.style.display = "none";
            const openInterviewBtn = document.getElementById("openInterviewBtn");
            if (openInterviewBtn) openInterviewBtn.click();
        });
    }

    // מאגר משרות מורחב (ג'וניור ובכירים) לחיפוש
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
            description: `<strong>Role Overview:</strong><br>We are seeking a Senior Java Architect to spearhead the structural redesign of our enterprise manufacturing data pipelines...`
        }
    ];

    // פונקציית החיפוש
    async function handleSearch() {
        let query = searchInput.value.trim();
        if (!query) {
            const juniorJobs = fallbackJobs.filter(job => job.isJunior === true);
            updateKPIMetrics("Junior", juniorJobs);
            renderJobCards(juniorJobs);
            return;
        }

        searchResultsArea.innerHTML = `
            <div class="loading-screen">
                <div class="loader-circle"></div>
                <p style="color: #64748b;">Scanning tech ecosystem in Israel...</p>
            </div>`;

        try {
            const url = `https://api.adzuna.com/v1/api/jobs/il/search/1?app_id=c49747cb&app_key=9b83bba0ba50b070bc064a787cd04052&what=${encodeURIComponent(query)}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error("API network issue");
            
            const data = await response.json();
            const jobs = data.results || [];
            
            if (jobs.length === 0) { useFallbackSearch(query); } 
            else { updateKPIMetrics(query, jobs); renderJobCards(jobs); }
        } catch (error) {
            useFallbackSearch(query);
        }
    }

    function useFallbackSearch(query) {
        const lowerQuery = query.toLowerCase();
        const filteredJobs = fallbackJobs.filter(job => 
            job.title.toLowerCase().includes(lowerQuery) || 
            job.company.display_name.toLowerCase().includes(lowerQuery)
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
        if (lowerQuery.includes("senior") || lowerQuery.includes("manager") || lowerQuery.includes("architect")) {
            kpiSalary.textContent = "₪34,000 - ₪48,000 / mo";
        } else {
            kpiSalary.textContent = "₪14,000 - ₪21,000 / mo";
        }
    }

    function renderJobCards(jobs) {
        searchResultsArea.innerHTML = "";
        jobs.forEach((job) => {
            const card = document.createElement("div");
            card.className = "card";
            card.style.cursor = "pointer";
            card.style.marginBottom = "12px";
            
            const companyName = job.company?.display_name || "Tech Enterprise";
            const locationName = job.location?.display_name || "Israel";
            const levelBadge = job.isJunior 
                ? `<span style="font-size: 10px; background: #f0fdf4; color: #166534; padding: 2px 6px; border-radius: 4px; font-weight: bold; border: 1px solid #bbf7d0;">Junior Friendly</span>`
                : `<span style="font-size: 10px; background: #fff7ed; color: #c2410c; padding: 2px 6px; border-radius: 4px; font-weight: bold; border: 1px solid #fed7aa;">Experienced</span>`;

            card.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 5px;">
                    <h3 style="margin: 0; color: #1e293b; font-size: 15px; font-weight:700;">${job.title}</h3>
                    ${levelBadge}
                </div>
                <p style="margin: 0 0 10px 0; color: #3b71f7; font-weight: 600; font-size: 13px;">🏢 ${companyName}</p>
                <div style="display: flex; justify-content: space-between; align-items: center;">
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
        modalJobDetails.innerHTML = `
            <p style="font-size:13px; color:#475569;"><strong>Location:</strong> ${job.location?.display_name || "Israel"}</p>
            <div style="font-size: 13px; color: #334155; line-height: 1.6; margin-bottom: 20px;">${job.description}</div>
            <button class="primary-btn" onclick="alert('Applied successfully via SkillUp AI!')" style="margin-bottom:0; width:100%;">Quick Apply Now</button>
        `;
        jobDetailModal.classList.remove("hidden");
    }

    if (closeModalBtn) closeModalBtn.addEventListener("click", () => jobDetailModal.classList.add("hidden"));
    if (modalBarClose) modalBarClose.addEventListener("click", () => jobDetailModal.classList.add("hidden"));
    if (searchSubmitBtn) searchSubmitBtn.addEventListener("click", handleSearch);
    if (searchInput) searchInput.addEventListener("input", handleSearch);

    // טעינת משרות ראשונית
    handleSearch();

    // ================= AI INTERVIEW SIMULATOR =================
    if (generateBtn) {
        generateBtn.addEventListener('click', async () => {
            const jobDescription = jobInput.value.trim();
            if (!jobDescription) { showError("Please paste a job description first."); return; }

            errorBox.classList.add('hidden');
            resultsDiv.classList.add('hidden');
            loadingDiv.classList.remove('hidden');

            try {
                const response = await fetch('/api/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ jobDescription })
                });
                if (!response.ok) throw new Error("Generation failed.");
                const data = await response.json();
                
                populateList(techList, data.technical);
                populateList(hrList, data.behavioral);
                populateList(caseList, data.caseStudy);

                loadingDiv.classList.add('hidden');
                resultsDiv.classList.remove('hidden');
            } catch (error) {
                loadingDiv.classList.add('hidden');
                showError("An error occurred while connecting to the AI.");
            }
        });
    }

    function populateList(listElement, items) {
        if (!listElement) return;
        listElement.innerHTML = '';
        (items || []).forEach(item => {
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

    // ================= מערכת ניווט טאבים מובנית =================
    const navItems = document.querySelectorAll(".nav-item");
    const views = document.querySelectorAll(".view-section");

    navItems.forEach(item => {
        item.addEventListener("click", () => {
            const target = item.getAttribute("data-target");
            navItems.forEach(i => i.classList.remove("active"));
            item.classList.add("active");
            views.forEach(v => v.classList.add("hidden"));
            
            if (target === "home") document.getElementById("dashboardView").classList.remove("hidden");
            if (target === "search") { document.getElementById("searchView").classList.remove("hidden"); handleSearch(); }
            if (target === "notifications") document.getElementById("notificationsView").classList.remove("hidden");
            if (target === "profile") document.getElementById("profileView").classList.remove("hidden");

            if (virtualKeyboard) virtualKeyboard.style.display = "none";
        });
    });

    const openInterviewBtn = document.getElementById("openInterviewBtn");
    if (openInterviewBtn) {
        openInterviewBtn.addEventListener("click", () => {
            views.forEach(v => v.classList.add("hidden"));
            document.getElementById("interviewView").classList.remove("hidden");
        });
    }

    // ================= לוגיקת המקלדת הווירטואלית =================
    if (searchInput) searchInput.addEventListener("focus", () => { currentActiveInput = searchInput; if (virtualKeyboard) virtualKeyboard.style.display = "block"; });
    if (jobInput) jobInput.addEventListener("focus", () => { currentActiveInput = jobInput; if (virtualKeyboard) virtualKeyboard.style.display = "block"; });

    document.querySelectorAll(".key").forEach(key => {
        key.addEventListener("click", (e) => {
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
        keyDelete.addEventListener("click", (e) => {
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
        keySpace.addEventListener("click", (e) => {
            e.preventDefault();
            if (currentActiveInput) { currentActiveInput.value += " "; currentActiveInput.focus(); if (currentActiveInput === searchInput) handleSearch(); }
        });
    }

    const keyClose = document.getElementById("keyClose");
    if (keyClose) {
        keyClose.addEventListener("click", (e) => {
            e.preventDefault();
            if (virtualKeyboard) virtualKeyboard.style.display = "none";
            if (currentActiveInput) currentActiveInput.blur();
        });
    }

    // ================= פירוק הפרופיל ל-4 מרובעים נפרדים (ללא גיל) במסך הפרופיל =================
    function upgradeProfileLayout() {
        const profileView = document.getElementById("profileView");
        if (!profileView) return;

        const profileData = [
            { 
                title: "Education", 
                text: "Social Sciences & Tech Student.", 
                icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b71f7" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5-10 5z"></path><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path></svg>` 
            },
            { 
                title: "Background", 
                text: "Motivated university student with a strong passion for technology. Eager to learn, grow, and start a professional career.", 
                icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b71f7" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>` 
            },
            { 
                title: "Target Goal", 
                text: "Looking for my first opportunity in the Tech industry, with a focus on Software Development.", 
                icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b71f7" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle></svg>` 
            }, 
            { 
                title: "Top Skills", 
                text: `<ul style="margin: 0; padding-left: 16px; list-style-type: disc;"><li>Python</li><li>SQL</li><li>JavaScript</li><li>Git</li></ul>`, 
                icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b71f7" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>` 
            }
        ];

        let profileCardsContainer = document.getElementById("profileCardsContainer");
        if (!profileCardsContainer) {
            profileCardsContainer = document.createElement("div");
            profileCardsContainer.id = "profileCardsContainer";
            profileCardsContainer.style.marginTop = "20px";
            profileCardsContainer.style.padding = "0 15px";
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
            squareCard.style.boxShadow = "0 4px 6px -1px rgba(0,0,0,0.05)";
            squareCard.style.border = "1px solid #e2e8f0";
            squareCard.style.textAlign = "left"; 

            squareCard.innerHTML = `
                <div style="display: flex; align-items: center; margin-bottom: 8px; gap: 10px;">
                    <div style="background: #eff6ff; width: 32px; height: 32px; display: flex; justify-content: center; align-items: center; border-radius: 8px;">
                        ${item.icon}
                    </div>
                    <strong style="color: #1e293b; font-size: 14px; font-weight:700;">${item.title}:</strong>
                </div>
                <div style="margin: 0; color: #475569; font-size: 13px; line-height: 1.5; padding-left: 42px;">
                    ${item.text}
                </div>
            `;
            profileCardsContainer.appendChild(squareCard);
        });
    }

    upgradeProfileLayout();
});
