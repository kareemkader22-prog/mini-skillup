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

    if (menuBtn && dropdownMenu) {
        menuBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            dropdownMenu.style.display = dropdownMenu.style.display === "none" ? "block" : "none";
        });
        document.addEventListener("click", () => {
            dropdownMenu.style.display = "none";
        });
    }

    // מאגר ענק ומקיף המשלב משרות ג'וניור ומשרות מנוסים
    const fallbackJobs = [
        { 
            title: "Junior Full Stack Developer", 
            company: { display_name: "Wix.com" }, 
            location: { display_name: "Tel Aviv - Remote" }, 
            isJunior: true,
            description: `<strong>Role Overview:</strong><br>Wix is looking for a talented Junior Full Stack Developer to join our core web engineering group.` 
        },
        { 
            title: "Junior Data Analyst", 
            company: { display_name: "Google" }, 
            location: { display_name: "Tel Aviv-Yafo" }, 
            isJunior: true,
            description: `<strong>Role Overview:</strong><br>We are looking for a brilliant Junior Data Analyst to turn data into business insights.` 
        },
        { 
            title: "NOC Tier 1 Specialist", 
            company: { display_name: "Palo Alto Networks" }, 
            location: { display_name: "Tel Aviv" }, 
            isJunior: true,
            description: `<strong>Role Overview:</strong><br>Excellent entry-level opportunity for students or recent graduates to monitor production infrastructure.`
        },
        { 
            title: "Junior UI/UX Designer", 
            company: { display_name: "Mobileye" }, 
            location: { display_name: "Jerusalem" }, 
            isJunior: true,
            description: `<strong>Role Overview:</strong><br>Help build wireframes, user flows, and high-fidelity layouts.`
        },
        { 
            title: "Java Software Developer (Entry Level)", 
            company: { display_name: "Intel" }, 
            location: { display_name: "Haifa" }, 
            isJunior: true,
            description: `<strong>Role Overview:</strong><br>Kickstart your software engineering career coding enterprise-level Java frameworks.`
        },
        { 
            title: "Senior Java Software Architect", 
            company: { display_name: "Intel" }, 
            location: { display_name: "Haifa" }, 
            isJunior: false,
            description: `<strong>Role Overview:</strong><br>Spearhead the structural design of enterprise data pipelines.<br><br><strong>Key Requirements:</strong><br>• 7+ years of experience with enterprise Java.`
        },
        { 
            title: "UI/UX Product Design Lead", 
            company: { display_name: "Wix.com" }, 
            location: { display_name: "Tel Aviv" }, 
            isJunior: false,
            description: `<strong>Role Overview:</strong><br>Take design ownership of a global product line.<br><br><strong>Key Requirements:</strong><br>• 5+ years of experience leading UI/UX systems.`
        },
        { 
            title: "NOC & Technical Operations Manager", 
            company: { display_name: "Palo Alto Networks" }, 
            location: { display_name: "Tel Aviv" }, 
            isJunior: false,
            description: `<strong>Role Overview:</strong><br>Direct global 24/7 technical incident response pipelines.`
        },
        { 
            title: "Senior Machine Learning Engineer", 
            company: { display_name: "Google" }, 
            location: { display_name: "Tel Aviv-Yafo" }, 
            isJunior: false,
            description: `<strong>Role Overview:</strong><br>Build scalable infrastructure for training and deploying neural network arrays.` 
        }
    ];

    // פונקציית החיפוש והטעינה הכללית
    async function handleSearch() {
        let query = searchInput.value.trim();
        
        if (!query) {
            const juniorJobs = fallbackJobs.filter(job => job.isJunior === true);
            updateKPIMetrics("Junior", juniorJobs);
            renderJobCards(juniorJobs);
            return;
        }

        searchResultsArea.innerHTML = `<div class="loading-screen"><div class="loader-circle"></div><p>Scanning tech ecosystem...</p></div>`;

        try {
            const url = `https://api.adzuna.com/v1/api/jobs/il/search/1?app_id=c49747cb&app_key=9b83bba0ba50b070bc064a787cd04052&what=${encodeURIComponent(query)}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error("API Network issue");
            
            const data = await response.json();
            const jobs = data.results || [];
            
            if (jobs.length === 0) useFallbackSearch(query);
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
            kpiSalary.textContent = "₪34,000 - ₪50,000 / mo";
        } else {
            kpiSalary.textContent = "₪14,000 - ₪22,000 / mo";
        }
    }

    function renderJobCards(jobs) {
        searchResultsArea.innerHTML = "";
        jobs.forEach((job) => {
            const card = document.createElement("div");
            card.className = "card";
            card.style.cursor = "pointer";
            card.style.marginBottom = "12px";
            
            const levelBadge = job.isJunior 
                ? `<span style="font-size: 10px; background: #f0fdf4; color: #166534; padding: 2px 6px; border-radius: 4px; font-weight: bold;">Junior Friendly</span>`
                : `<span style="font-size: 10px; background: #fff7ed; color: #c2410c; padding: 2px 6px; border-radius: 4px; font-weight: bold;">Senior / Experienced</span>`;

            card.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 5px;">
                    <h3 style="margin: 0; color: #1e293b; font-size: 15px; font-weight:700; text-align: left;">${job.title}</h3>
                    ${levelBadge}
                </div>
                <p style="margin: 0 0 10px 0; color: #3b71f7; font-weight: 600; font-size: 13px; text-align: left;">🏢 ${job.company?.display_name || "Tech"}</p>
                <div style="display: flex; justify-content: space-between; align-items: center; direction: ltr;">
                    <span style="font-size: 11px; color: #64748b;">📍 ${job.location?.display_name || "Israel"}</span>
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
            <p style="margin-bottom: 12px; font-size:13px; text-align: left;"><strong>Location:</strong> ${job.location?.display_name || "Israel"}</p>
            <div style="font-size: 13px; line-height: 1.6; margin-bottom: 20px; text-align: left;">${job.description}</div>
            <button class="primary-btn" style="margin-bottom:0;">Quick Apply Now</button>
        `;
        jobDetailModal.classList.remove("hidden");
    }

    function closeJobModal() { if (jobDetailModal) jobDetailModal.classList.add("hidden"); }
    if (closeModalBtn) closeModalBtn.addEventListener("click", closeJobModal);
    if (modalBarClose) modalBarClose.addEventListener("click", closeJobModal);

    // ================= לוגיקת מקלדת וירטואלית מובנית לחיפוש =================
    if (searchInput && virtualKeyboard) {
        // פתיחת מקלדת בפוקוס
        searchInput.addEventListener("focus", (e) => {
            e.stopPropagation();
            virtualKeyboard.classList.remove("hidden");
        });

        // מניעת סגירה בלחיצה בתוך המקלדת
        virtualKeyboard.addEventListener("click", (e) => {
            e.stopPropagation();
        });

        // סגירה בלחיצה מחוץ למקלדת
        document.addEventListener("click", () => {
            virtualKeyboard.classList.add("hidden");
        });

        // ניהול המקשים במקלדת
        const keys = virtualKeyboard.querySelectorAll(".key");
        keys.forEach(key => {
            key.addEventListener("click", (e) => {
                e.stopPropagation();
                
                const id = key.id;
                const value = key.textContent;

                if (id === "keyBackspace") {
                    searchInput.value = searchInput.value.slice(0, -1);
                } else if (id === "keySpace") {
                    searchInput.value += " ";
                } else if (id === "keySearch") {
                    virtualKeyboard.classList.add("hidden");
                    handleSearch();
                    return;
                } else {
                    searchInput.value += value;
                }

                // עדכון חיפוש דינמי בזמן אמת מהמקלדת
                handleSearch();
            });
        });
    }

    if (searchSubmitBtn) {
        searchSubmitBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (virtualKeyboard) virtualKeyboard.classList.add("hidden");
            handleSearch();
        });
    }

    if (searchInput) {
        searchInput.addEventListener("input", handleSearch);
    }

    // הפעלה ראשונית של הרשימה
    handleSearch();

    // ================= מערכת ניווט מובנית בין מסכים =================
    const navItems = document.querySelectorAll(".nav-item");
    const views = document.querySelectorAll(".view-section");

    navItems.forEach(item => {
        item.addEventListener("click", () => {
            const target = item.getAttribute("data-target");
            navItems.forEach(i => i.classList.remove("active"));
            item.classList.add("active");
            views.forEach(v => v.classList.add("hidden"));
            
            if (target === "home") document.getElementById("dashboardView").classList.remove("hidden");
            if (target === "search") {
                document.getElementById("searchView").classList.remove("hidden");
                handleSearch(); 
            }
        });
    });

    const openInterviewBtn = document.getElementById("openInterviewBtn");
    if (openInterviewBtn) {
        openInterviewBtn.addEventListener("click", () => {
            views.forEach(v => v.classList.add("hidden"));
            document.getElementById("interviewView").classList.remove("hidden");
        });
    }
    const backToHomeBtn = document.getElementById("backToHomeBtn");
    if (backToHomeBtn) {
        backToHomeBtn.addEventListener("click", () => {
            views.forEach(v => v.classList.add("hidden"));
            document.getElementById("dashboardView").classList.remove("hidden");
        });
    }
});
