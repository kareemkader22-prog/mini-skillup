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

    // מאגר משרות מקיף (ג'וניור ובכירים)
    const fallbackJobs = [
        // --- משרות ג'וניור ומתחילים ---
        { 
            title: "Junior Full Stack Developer", 
            company: { display_name: "Wix.com" }, 
            location: { display_name: "Tel Aviv - Remote" }, 
            isJunior: true,
            description: `<strong>Role Overview:</strong><br>Wix is looking for a talented Junior Full Stack Developer to join our core web engineering group.<br><br><strong>Key Requirements:</strong><br>• Strong fundamentals in JavaScript / TypeScript and HTML/CSS.<br>• Experience with React or Vue.js.` 
        },
        { 
            title: "Junior Data Analyst", 
            company: { display_name: "Google" }, 
            location: { display_name: "Tel Aviv-Yafo" }, 
            isJunior: true,
            description: `<strong>Role Overview:</strong><br>Turn data into valuable business insights using SQL and visualization systems.<br><br><strong>Key Requirements:</strong><br>• Advanced proficiency in SQL queries.<br>• Hands-on experience with Tableau or Power BI.` 
        },
        { 
            title: "NOC Tier 1 Specialist", 
            company: { display_name: "Palo Alto Networks" }, 
            location: { display_name: "Tel Aviv" }, 
            isJunior: true,
            description: `<strong>Role Overview:</strong><br>Excellent entry-level student opportunity! Monitor production cloud environments and handle infrastructure alerts.<br><br><strong>Key Requirements:</strong><br>• Basic networking concepts (TCP/IP, DNS).<br>• Willingness to work in shifts.`
        },
        { 
            title: "Junior UI/UX Designer", 
            company: { display_name: "Mobileye" }, 
            location: { display_name: "Jerusalem" }, 
            isJunior: true,
            description: `<strong>Role Overview:</strong><br>Help build wireframes, user flows, and high-fidelity interface mockups.<br><br><strong>Key Requirements:</strong><br>• Solid portfolio showing web/mobile layout designs.<br>• High proficiency in Figma.`
        },
        { 
            title: "Java Software Developer (Entry Level)", 
            company: { display_name: "Intel" }, 
            location: { display_name: "Haifa" }, 
            isJunior: true,
            description: `<strong>Role Overview:</strong><br>Kickstart your software engineering career in our validation backend framework group coding in Java.<br><br><strong>Key Requirements:</strong><br>• Solid comprehension of OOP principles and Java syntax.`
        },
        // --- משרות מתקדמות ובכירות ---
        { 
            title: "Senior Java Software Architect", 
            company: { display_name: "Intel" }, 
            location: { display_name: "Haifa" }, 
            isJunior: false,
            description: `<strong>Role Overview:</strong><br>Spearhead structural redesign of enterprise manufacturing pipelines.<br><br><strong>Key Requirements:</strong><br>• 7+ years of experience in enterprise Java development (Spring Boot, Microservices).`
        },
        { 
            title: "UI/UX Product Design Lead", 
            company: { display_name: "Wix.com" }, 
            location: { display_name: "Tel Aviv" }, 
            isJunior: false,
            description: `<strong>Role Overview:</strong><br>Take design ownership of global product lines and manage a talented UI/UX unit.<br><br><strong>Key Requirements:</strong><br>• 5+ years design leadership in SaaS environments.`
        },
        { 
            title: "NOC & Technical Operations Manager", 
            company: { display_name: "Palo Alto Networks" }, 
            location: { display_name: "Tel Aviv" }, 
            isJunior: false,
            description: `<strong>Role Overview:</strong><br>Direct global 24/7 technical incident response and cloud orchestration platforms.<br><br><strong>Key Requirements:</strong><br>• 4+ years managing NOC operations or enterprise telemetry stacks.`
        },
        { 
            title: "Senior Machine Learning Engineer", 
            company: { display_name: "Google" }, 
            location: { display_name: "Tel Aviv-Yafo" }, 
            isJunior: false,
            description: `<strong>Role Overview:</strong><br>Build scalable infrastructure for training deep neural architectures.<br><br><strong>Key Requirements:</strong><br>• 4+ years coding production-grade machine learning pipelines with PyTorch/TensorFlow.` 
        },
        { 
            title: "Principal Python Backend Engineer", 
            company: { display_name: "Check Point" }, 
            location: { display_name: "Tel Aviv-Yafo" }, 
            isJunior: false,
            description: `<strong>Role Overview:</strong><br>Design high-performance cybersecurity components and async microservices in Python.<br><br><strong>Key Requirements:</strong><br>• 6+ years enterprise Python experience (FastAPI, Asyncio).` 
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

        searchResultsArea.innerHTML = `<div class="loading-screen"><div class="loader-circle"></div><p>Scanning ecosystem...</p></div>`;

        try {
            const url = `https://api.adzuna.com/v1/api/jobs/il/search/1?app_id=c49747cb&app_key=9b83bba0ba50b070bc064a787cd04052&what=${encodeURIComponent(query)}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error("API failure");
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
        if (lowerQuery.includes("senior") || lowerQuery.includes("manager")) kpiSalary.textContent = "₪32,000 - ₪48,000 / mo";
        else if (lowerQuery.includes("noc")) kpiSalary.textContent = "₪11,000 - ₪14,500 / mo";
        else kpiSalary.textContent = "₪14,000 - ₪22,000 / mo";
    }

    function renderJobCards(jobs) {
        searchResultsArea.innerHTML = "";
        jobs.forEach((job) => {
            const card = document.createElement("div");
            card.className = "card";
            card.style.cursor = "pointer";
            card.style.marginBottom = "12px";
            
            const badge = job.isJunior 
                ? `<span style="font-size: 10px; background: #f0fdf4; color: #166534; padding: 2px 6px; border-radius: 4px; font-weight: bold;">Junior Friendly</span>` 
                : `<span style="font-size: 10px; background: #fff7ed; color: #c2410c; padding: 2px 6px; border-radius: 4px; font-weight: bold;">Experienced</span>`;

            card.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 5px;">
                    <h3 style="margin: 0; font-size: 15px; font-weight:700; text-align: left;">${job.title}</h3>
                    ${badge}
                </div>
                <p style="margin: 0 0 10px 0; color: #3b71f7; font-weight: 600; font-size: 13px; text-align: left;">🏢 ${job.company.display_name}</p>
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
        modalJobCompany.textContent = job.company.display_name;
        modalJobDetails.innerHTML = `
            <p style="margin-bottom: 12px; font-size:13px; text-align: left;"><strong>Location:</strong> ${job.location?.display_name || "Israel"}</p>
            <div style="font-size: 13px; line-height: 1.6; margin-bottom: 20px; text-align: left;">${job.description}</div>
            <button class="primary-btn" onclick="alert('Applied successfully!')">Quick Apply Now</button>
        `;
        jobDetailModal.classList.remove("hidden");
    }

    function closeJobModal() { jobDetailModal.classList.add("hidden"); }
    if (closeModalBtn) closeModalBtn.addEventListener("click", closeJobModal);
    if (modalBarClose) modalBarClose.addEventListener("click", closeJobModal);

    // ================= לוגיקת מקלדת וירטואלית מלאה =================
    if (searchInput && virtualKeyboard) {
        // הצגת המקלדת כאשר לוחצים על שדה החיפוש
        searchInput.addEventListener("focus", (e) => {
            e.stopPropagation();
            virtualKeyboard.classList.remove("hidden");
        });

        // מניעת סגירת המקלדת בלחיצה על המקלדת עצמה
        virtualKeyboard.addEventListener("click", (e) => {
            e.stopPropagation();
        });

        // סגירת המקלדת בלחיצה בכל מקום אחר בעמוד
        document.addEventListener("click", () => {
            virtualKeyboard.classList.add("hidden");
        });

        // האזנה לכל המקשים של המקלדת
        const keys = virtualKeyboard.querySelectorAll(".key");
        keys.forEach(key => {
            key.addEventListener("click", (e) => {
                e.stopPropagation(); // מונע סגירה של המקלדת
                
                const keyId = key.id;
                const keyText = key.textContent;

                if (keyId === "keyBackspace") {
                    // מחיקת תו אחרון
                    searchInput.value = searchInput.value.slice(0, -1);
                } else if (keyId === "keySpace") {
                    // הוספת רווח
                    searchInput.value += " ";
                } else if (keyId === "keySearch") {
                    // כפתור Go - מסתיר את המקלדת ומריץ
                    virtualKeyboard.classList.add("hidden");
                    handleSearch();
                    return;
                } else {
                    // הוספת האות שהוקלדה
                    searchInput.value += keyText;
                }

                // הפעלת החיפוש בזמן אמת עם כל תו שהוקלד במקלדת
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

    // הפעלה ראשונית
    handleSearch();
});
