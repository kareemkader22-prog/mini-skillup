document.addEventListener("DOMContentLoaded", () => {
    // אלמנטים לניווט וחיפוש
    const searchSubmitBtn = document.getElementById("searchSubmitBtn");
    const searchInput = document.getElementById("searchInput");
    const searchResultsArea = document.getElementById("searchResultsArea");
    const virtualKeyboard = document.getElementById("virtualKeyboard");

    // אלמנטים של חלון המודל (הדרישות המלאות)
    const jobDetailModal = document.getElementById("jobDetailModal");
    const closeModalBtn = document.getElementById("closeModalBtn");
    const modalJobTitle = document.getElementById("modalJobTitle");
    const modalJobCompany = document.getElementById("modalJobCompany");
    const modalJobDetails = document.getElementById("modalJobDetails");

    let currentFetchedJobs = [];

    // פונקציית החיפוש הכללית - תומכת בכל מקצועות ההייטק (מפתחים, IT, QA וכו')
    async function handleSearch() {
        let query = searchInput.value.trim();
        
        // אם השדה ריק, נחפש ברירת מחדל של משרות הייטק כלליות בישראל
        if (!query) {
            query = "Developer IT Tech QA Cyber";
        }

        searchResultsArea.innerHTML = `
            <div class="loading-screen">
                <div class="loader-circle"></div>
                <p style="color: #ffffff;">Searching for jobs in Israel...</p>
            </div>`;

        try {
            // קריאה ל-API שמביא את כל סוגי המשרות לפי מילת המפתח שהוקלדה
            const url = `https://api.adzuna.com/v1/api/jobs/il/search/1?app_id=c49747cb&app_key=9b83bba0ba50b070bc064a787cd04052&what=${encodeURIComponent(query)}`;
            
            const response = await fetch(url);
            if (!response.ok) throw new Error("API network failure");
            
            const data = await response.json();
            currentFetchedJobs = data.results || [];
            
            renderJobCards(currentFetchedJobs);
        } catch (error) {
            console.error(error);
            searchResultsArea.innerHTML = '<p style="color: #ef4444; text-align: center;">Error fetching live data. Please try again.</p>';
        }
    }

    // יצירת קארדים לבנים ונקיים על גבי הרקע השחור
    function renderJobCards(jobs) {
        searchResultsArea.innerHTML = "";
        
        if (jobs.length === 0) {
            searchResultsArea.innerHTML = '<p style="color: #94a3b8; text-align: center;">No jobs found matching your request.</p>';
            return;
        }

        jobs.forEach((job, index) => {
            const card = document.createElement("div");
            card.className = "card clickable-job-card";
            card.setAttribute("data-index", index);
            
            const companyName = job.company?.display_name || "Unknown Company";
            const locationName = job.location?.display_name || "Israel";
            
            card.innerHTML = `
                <h3 style="margin: 0 0 5px 0; color: #1e293b; font-size: 16px; font-weight:700;">${job.title}</h3>
                <p style="margin: 0 0 10px 0; color: #3b71f7; font-weight: 600; font-size: 14px;">${companyName}</p>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 12px; color: #64748b;">📍 ${locationName}</span>
                    <span style="font-size: 12px; background: #e0f2fe; color: #0369a1; padding: 2px 8px; border-radius: 12px; font-weight: 500;">View Details</span>
                </div>
            `;
            
            // לחיצה על קארד המשרה פותחת את המודל עם הדרישות המלאות
            card.addEventListener("click", () => {
                openJobModal(job);
            });

            searchResultsArea.appendChild(card);
        });
    }

    function openJobModal(job) {
        modalJobTitle.textContent = job.title;
        modalJobCompany.textContent = job.company?.display_name || "Unknown Company";
        
        modalJobDetails.innerHTML = `
            <p style="margin-bottom: 12px;"><strong>Location:</strong> ${job.location?.display_name || "Israel"}</p>
            <p style="margin-bottom: 15px; font-weight: 600; color: #1e293b;">Job Description & Requirements:</p>
            <div style="font-size: 14px; color: #334155; line-height: 1.6; margin-bottom: 20px;">
                ${job.description}
            </div>
            <a href="${job.redirect_url}" target="_blank" class="primary-btn" style="display: block; text-align: center; text-decoration: none; margin-bottom: 0;">Apply for this Job</a>
        `;
        
        jobDetailModal.classList.remove("hidden");
    }

    // סגירת חלון המודל
    if (closeModalBtn) {
        closeModalBtn.addEventListener("click", () => {
            jobDetailModal.classList.add("hidden");
        });
    }

    // האזנה ללחצני החיפוש
    if (searchSubmitBtn) {
        searchSubmitBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (virtualKeyboard) virtualKeyboard.style.display = "none";
            handleSearch();
        });
    }

    if (searchInput) {
        searchInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                handleSearch();
            }
        });
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
                // טעינה אוטומטית של משרות ברגע שנכנסים למסך החיפוש
                handleSearch();
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
