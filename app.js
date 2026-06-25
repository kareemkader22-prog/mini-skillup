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

    // פונקציית החיפוש הכללית - תומכת בכל מקצועות ההייטק והחברות בשוק
    async function handleSearch() {
        let query = searchInput.value.trim();
        
        // אם השדה ריק, נשתמש במילות מפתח רחבות המייצגות את כל שוק ההייטק והחברות
        if (!query) {
            query = "Developer IT QA Cyber Engineer tech";
        }

        searchResultsArea.innerHTML = `
            <div class="loading-screen">
                <div class="loader-circle"></div>
                <p style="color: #64748b;">Scanning tech ecosystem in Israel...</p>
            </div>`;

        try {
            // קריאה לשרת ה-API שמביא משרות וחברות לפי המונח שנבחר
            const url = `https://api.adzuna.com/v1/api/jobs/il/search/1?app_id=c49747cb&app_key=9b83bba0ba50b070bc064a787cd04052&what=${encodeURIComponent(query)}`;
            
            const response = await fetch(url);
            if (!response.ok) throw new Error("API network failure");
            
            const data = await response.json();
            const jobs = data.results || [];
            
            // עדכון נתוני ה-KPI על בסיס התוצאות שהתקבלו מבחוץ
            updateKPIMetrics(query, jobs);
            
            renderJobCards(jobs);
        } catch (error) {
            console.error(error);
            searchResultsArea.innerHTML = '<p style="color: #ef4444; text-align: center; font-size: 13px;">Error fetching live data. Please try again.</p>';
        }
    }

    // פונקציה שמחשבת ומציגה נתוני שוק חיצוניים (KPI) עבור המשרה/חברה
    function updateKPIMetrics(query, jobs) {
        if (!kpiDashboard || !kpiCount || !kpiSalary) return;
        
        if (jobs.length === 0) {
            kpiDashboard.classList.add("hidden");
            return;
        }

        kpiDashboard.classList.remove("hidden");
        kpiCount.textContent = `${jobs.length} local openings`;
        
        // סימולציה חכמה של טווח שכר ממוצע לפי סוג המשרה החיצונית שנכתבה
        const lowerQuery = query.toLowerCase();
        if (lowerQuery.includes("it") || lowerQuery.includes("support")) {
            kpiSalary.textContent = "₪13,000 - ₪18,000 / mo";
        } else if (lowerQuery.includes("qa") || lowerQuery.includes("test")) {
            kpiSalary.textContent = "₪14,000 - ₪21,000 / mo";
        } else if (lowerQuery.includes("cyber") || lowerQuery.includes("security") || lowerQuery.includes("dev")) {
            kpiSalary.textContent = "₪22,000 - ₪34,000 / mo";
        } else {
            kpiSalary.textContent = "₪18,500 - ₪26,000 / mo";
        }
    }

    // יצירת קארדים דינמיים של משרות/חברות
    function renderJobCards(jobs) {
        searchResultsArea.innerHTML = "";
        
        if (jobs.length === 0) {
            searchResultsArea.innerHTML = '<p style="color: #64748b; text-align: center; font-size: 13px; margin-top:20px;">No positions found matching your request.</p>';
            return;
        }

        jobs.forEach((job) => {
            const card = document.createElement("div");
            card.className = "card";
            card.style.cursor = "pointer";
            card.style.transition = "transform 0.2s, box-shadow 0.2s";
            
            const companyName = job.company?.display_name || "Tech Enterprise";
            const locationName = job.location?.display_name || "Israel (Remote/Hybrid)";
            
            card.innerHTML = `
                <h3 style="margin: 0 0 5px 0; color: #1e293b; font-size: 15px; font-weight:700;">${job.title}</h3>
                <p style="margin: 0 0 10px 0; color: #3b71f7; font-weight: 600; font-size: 13px;">🏢 ${companyName}</p>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 11px; color: #64748b;">📍 ${locationName}</span>
                    <span style="font-size: 11px; background: #e0f2fe; color: #0369a1; padding: 2px 8px; border-radius: 12px; font-weight: 600;">Details</span>
                </div>
            `;
            
            // לחיצה על כרטיס המשרה תפתח חלון מודל עשיר עם כל הנתונים
            card.addEventListener("click", () => {
                openJobModal(job);
            });

            searchResultsArea.appendChild(card);
        });
    }

    function openJobModal(job) {
        if (!jobDetailModal) return;
        modalJobTitle.textContent = job.title;
        modalJobCompany.textContent = job.company?.display_name || "Tech Enterprise";
        
        modalJobDetails.innerHTML = `
            <p style="margin-bottom: 12px; font-size:13px; color:#475569;"><strong>Location:</strong> ${job.location?.display_name || "Israel"}</p>
            <p style="margin-bottom: 8px; font-weight: 700; color: #1e293b; font-size:14px;">Requirements & Scope:</p>
            <div style="font-size: 13px; color: #334155; line-height: 1.6; margin-bottom: 20px; max-height:200px; overflow-y:auto; padding-right:5px;">
                ${job.description}
            </div>
            <a href="${job.redirect_url}" target="_blank" class="primary-btn" style="display: block; text-align: center; text-decoration: none; margin-bottom: 0;">Apply External Link</a>
        `;
        
        jobDetailModal.classList.remove("hidden");
    }

    // סגירת חלון המודל
    function closeJobModal() {
        if (jobDetailModal) jobDetailModal.classList.add("hidden");
    }
    if (closeModalBtn) closeModalBtn.addEventListener("click", closeJobModal);
    if (modalBarClose) modalBarClose.addEventListener("click", closeJobModal);

    // האזנה לאירועי החיפוש (בזמן אמת ובלחיצה)
    if (searchSubmitBtn) {
        searchSubmitBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (virtualKeyboard) virtualKeyboard.style.display = "none";
            handleSearch();
        });
    }

    if (searchInput) {
        searchInput.addEventListener("input", handleSearch);
    }

    // ================= AI INTERVIEW LOGIC =================
    const generateBtn = document.getElementById('generateBtn');
    const jobInput = document.getElementById('jobInput');
    const errorBox = document.getElementById('errorBox');
    const resultsDiv = document.getElementById('results');
    const loadingDiv = document.getElementById('loading');
    const techList = document.getElementById('techList');
    const hrList = document.getElementById('hrList');
    const caseList = document.getElementById('caseList');

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

                if (!response.ok) throw new Error("Server failed to generate questions.");

                const data = await response.json();
                
                populateList(techList, data.technical);
                populateList(hrList, data.behavioral);
                populateList(caseList, data.caseStudy);

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

    // מערכת ניווט מובנית בין מסכים
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
                handleSearch(); // טעינה אוטומטית בכניסה
            }
            if (target === "notifications") document.getElementById("notificationsView").classList.remove("hidden");
            if (target === "profile") document.getElementById("profileView").classList.remove("hidden");
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
