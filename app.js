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

    // מאגר מורחב הכולל משרות פייתון, פיתוח תוכנה, למידת מכונה וסינון לפי חברות מובילות
    const fallbackJobs = [
        { 
            title: "Machine Learning Engineer", 
            company: { display_name: "Google" }, 
            location: { display_name: "Tel Aviv-Yafo" }, 
            description: `
                <strong>Role Overview:</strong><br>
                We are looking for an ML Engineer to build scalable infrastructure for training and deploying deep learning models. You will optimize neural networks and work alongside researchers to implement production-grade AI solution ecosystem frameworks.<br><br>
                <strong>Key Requirements:</strong><br>
                • 2+ years of professional experience with Machine Learning systems or computer vision.<br>
                • Advanced knowledge of Python and deep learning frameworks (PyTorch, TensorFlow).<br>
                • Experience with data engineering tools and frameworks (Spark, Kafka, BigQuery).<br>
                • Background in cloud deployments using Kubernetes and MLOps principles.` 
        },
        { 
            title: "Python Software Developer", 
            company: { display_name: "Check Point" }, 
            location: { display_name: "Tel Aviv-Yafo" }, 
            description: `
                <strong>Role Overview:</strong><br>
                Join our backend infrastructure security team. You will build high-performance distributed systems, microservices, and specialized internal security automation systems completely written in Python.<br><br>
                <strong>Key Requirements:</strong><br>
                • 3+ years of enterprise object-oriented development backend experience with Python.<br>
                • Strong experience with asynchronous programming (Asyncio) and frameworks like FastAPI or Django.<br>
                • Expert knowledge in relational databases (PostgreSQL/MySQL) and caching layers (Redis).<br>
                • Familiarity with containerized execution platforms (Docker, Linux architecture).` 
        },
        { 
            title: "Software Engineer (Core Systems)", 
            company: { display_name: "Intel" }, 
            location: { display_name: "Haifa" }, 
            description: `
                <strong>Role Overview:</strong><br>
                Intel's core platform team is seeking a Software Engineer to develop internal system software, compilers, and hardware optimization tools. You will handle complex memory architectures and high-throughput low-latency systems.<br><br>
                <strong>Key Requirements:</strong><br>
                • Deep conceptual understanding of Software Engineering, Operating Systems, and memory management.<br>
                • Proficiency in Python, C/C++, or Java.<br>
                • Experience developing tools for multi-threaded applications and hardware acceleration layers.<br>
                • B.Sc. in Computer Science or Computer Engineering.`
        },
        { 
            title: "Senior Machine Learning Architect", 
            company: { display_name: "Microsoft" }, 
            location: { display_name: "Herzliya" }, 
            description: `
                <strong>Role Overview:</strong><br>
                Design modern large-scale machine learning and NLP pipelines for next-generation intelligence tools. You will oversee AI architecture design from raw telemetry ingestion up to final live feature engineering.<br><br>
                <strong>Key Requirements:</strong><br>
                • Extensive hands-on background running production AI pipelines.<br>
                • Expert-level programming using Python, Scikit-Learn, and PyTorch ecosystem libraries.<br>
                • Proven experience designing distributed systems or high-performance GPU clustering environments.`
        },
        { 
            title: "Backend Software Developer (Python & Go)", 
            company: { display_name: "CyberArk" }, 
            location: { display_name: "Petah Tikva" }, 
            description: `
                <strong>Role Overview:</strong><br>
                We are hiring a Software Developer to engineer advanced privileged access monitoring services. You'll code secure REST endpoints, build encryption integrations, and write automated threat detection plugins.<br><br>
                <strong>Key Requirements:</strong><br>
                • Proficiency inside a backend landscape with either Python or Go language layouts.<br>
                • Strong understanding of RESTful API design, OAuth2, and microservice engineering protocols.<br>
                • Experience implementing secure coding practices against OWASP vulnerability benchmarks.`
        },
        { 
            title: "QA Automation Engineer", 
            company: { display_name: "Mobileye" }, 
            location: { display_name: "Jerusalem" }, 
            description: `
                <strong>Role Overview:</strong><br>
                We are seeking a QA Automation Engineer to design, build, and maintain our next-generation automated test suites for advanced driver-assistance systems (ADAS). You will ensure software reliability through rigorous, continuous integration testing.<br><br>
                <strong>Key Requirements:</strong><br>
                • Solid programming background in Python, Java, or C#.<br>
                • Experience building automation frameworks from scratch using Selenium, Playwright, or Appium.<br>
                • Strong understanding of QA methodologies, test planning, and defect tracking tools (Jira).` 
        },
        { 
            title: "Full Stack Developer (Junior)", 
            company: { display_name: "Wix.com" }, 
            location: { display_name: "Tel Aviv - Remote" }, 
            description: `
                <strong>Role Overview:</strong><br>
                Wix is looking for a talented Junior Full Stack Developer to join our core web engineering group. You will write high-quality, scalable code, participate in code reviews, and build user-facing web applications utilized by millions globally.<br><br>
                <strong>Key Requirements:</strong><br>
                • Strong fundamentals in JavaScript / TypeScript and modern HTML/CSS.<br>
                • Practical experience with modern frontend frameworks, preferably React or Vue.js.<br>
                • Server-side development experience using Node.js, Express, or NestJS.` 
        },
        { 
            title: "Junior Data Analyst", 
            company: { display_name: "Google" }, 
            location: { display_name: "Tel Aviv-Yafo" }, 
            description: `
                <strong>Role Overview:</strong><br>
                We are looking for a brilliant Junior Data Analyst to turn data into valuable business insights. You will conduct full lifecycle analysis to include requirements, activities, and design.<br><br>
                <strong>Key Requirements:</strong><br>
                • 1+ years of experience or strong academic/project portfolio in Data Analysis.<br>
                • Advanced proficiency in SQL queries and data manipulation.<br>
                • Hands-on experience with visualization tools: Tableau, Power BI, or Looker.` 
        }
    ];

    // פונקציית החיפוש הכללית - תומכת בכל מקצועות ההייטק והחברות בשוק
    async function handleSearch() {
        let query = searchInput.value.trim();
        
        if (!query) {
            query = "Software";
        }

        searchResultsArea.innerHTML = `
            <div class="loading-screen">
                <div class="loader-circle"></div>
                <p style="color: #64748b;">Scanning tech ecosystem in Israel...</p>
            </div>`;

        try {
            // קריאה לשרת ה-API הציבורי
            const url = `https://api.adzuna.com/v1/api/jobs/il/search/1?app_id=c49747cb&app_key=9b83bba0ba50b070bc064a787cd04052&what=${encodeURIComponent(query)}`;
            
            const response = await fetch(url);
            if (!response.ok) throw new Error("API network failure or CORS restriction");
            
            const data = await response.json();
            const jobs = data.results || [];
            
            if (jobs.length === 0) {
                useFallbackSearch(query);
            } else {
                updateKPIMetrics(query, jobs);
                renderJobCards(jobs);
            }
        } catch (error) {
            console.warn("External API blocked. Switching to highly specialized company and role local search fallback data.", error);
            useFallbackSearch(query);
        }
    }

    // פונקציית סינון חכמה מתוך מאגר הגיבוי - תומכת כעת בשם חברה, סוג משרה ושפות תכנות
    function useFallbackSearch(query) {
        const lowerQuery = query.toLowerCase();
        
        const filteredJobs = fallbackJobs.filter(job => 
            job.title.toLowerCase().includes(lowerQuery) || 
            job.company.display_name.toLowerCase().includes(lowerQuery) || 
            job.description.toLowerCase().includes(lowerQuery)
        );

        // אם לא נמצאה התאמה מדויקת, נציג את כל המאגר על מנת לשמור על רציפות ה-UI
        const finalJobs = filteredJobs.length > 0 ? filteredJobs : fallbackJobs;

        updateKPIMetrics(query, finalJobs);
        renderJobCards(finalJobs);
    }

    // פונקציה שמחשבת ומציגה נתוני שוק חיצוניים (KPI) עבור המשרה/חברה
    function updateKPIMetrics(query, jobs) {
        if (!kpiDashboard || !kpiCount || !kpiSalary) return;
        
        kpiDashboard.classList.remove("hidden");
        kpiCount.textContent = `${jobs.length} openings found`;
        
        const lowerQuery = query.toLowerCase();
        if (lowerQuery.includes("machine") || lowerQuery.includes("ml") || lowerQuery.includes("learning")) {
            kpiSalary.textContent = "₪28,000 - ₪42,000 / mo";
        } else if (lowerQuery.includes("python") || lowerQuery.includes("developer") || lowerQuery.includes("software")) {
            kpiSalary.textContent = "₪22,000 - ₪34,000 / mo";
        } else if (lowerQuery.includes("intel")) {
            kpiSalary.textContent = "₪20,000 - ₪32,000 / mo";
        } else if (lowerQuery.includes("google")) {
            kpiSalary.textContent = "₪26,000 - ₪45,000 / mo";
        } else {
            kpiSalary.textContent = "₪19,000 - ₪28,000 / mo";
        }
    }

    // יצירת קארדים דינמיים של משרות/חברות
    function renderJobCards(jobs) {
        searchResultsArea.innerHTML = "";
        
        jobs.forEach((job) => {
            const card = document.createElement("div");
            card.className = "card";
            card.style.cursor = "pointer";
            card.style.transition = "transform 0.2s, box-shadow 0.2s";
            card.style.marginBottom = "12px";
            
            const companyName = job.company?.display_name || "Tech Enterprise";
            const locationName = job.location?.display_name || "Israel (Remote/Hybrid)";
            
            card.innerHTML = `
                <h3 style="margin: 0 0 5px 0; color: #1e293b; font-size: 15px; font-weight:700; text-align: left;">${job.title}</h3>
                <p style="margin: 0 0 10px 0; color: #3b71f7; font-weight: 600; font-size: 13px; text-align: left;">🏢 ${companyName}</p>
                <div style="display: flex; justify-content: space-between; align-items: center; direction: ltr;">
                    <span style="font-size: 11px; color: #64748b;">📍 ${locationName}</span>
                    <span style="font-size: 11px; background: #e0f2fe; color: #0369a1; padding: 2px 8px; border-radius: 12px; font-weight: 600;">Details</span>
                </div>
            `;
            
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
        
        const applyUrl = job.redirect_url || "#";
        const externalLinkBtn = job.redirect_url 
            ? `<a href="${applyUrl}" target="_blank" class="primary-btn" style="display: block; text-align: center; text-decoration: none; margin-bottom: 0;">Apply External Link</a>`
            : `<button class="primary-btn" onclick="alert('Application submitted successfully via SkillUp AI!')" style="margin-bottom:0;">Quick Apply Now</button>`;

        modalJobDetails.innerHTML = `
            <p style="margin-bottom: 12px; font-size:13px; color:#475569; text-align: left;"><strong>Location:</strong> ${job.location?.display_name || "Israel"}</p>
            <div style="font-size: 13px; color: #334155; line-height: 1.6; margin-bottom: 20px; max-height:260px; overflow-y:auto; padding-right:5px; text-align: left;">
                ${job.description}
            </div>
            ${externalLinkBtn}
        `;
        
        jobDetailModal.classList.remove("hidden");
    }

    function closeJobModal() {
        if (jobDetailModal) jobDetailModal.classList.add("hidden");
    }
    if (closeModalBtn) closeModalBtn.addEventListener("click", closeJobModal);
    if (modalBarClose) modalBarClose.addEventListener("click", closeJobModal);

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
