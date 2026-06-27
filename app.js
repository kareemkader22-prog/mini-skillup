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

    if (menuBtn && dropdownMenu) {
        menuBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            dropdownMenu.style.display = dropdownMenu.style.display === "none" ? "block" : "none";
        });
        document.addEventListener("click", () => {
            dropdownMenu.style.display = "none";
        });
    }

    // מאגר ענק ומקיף המשלב משרות ג'וניור ומשרות מנוסים (Mid / Senior / Lead)
    const fallbackJobs = [
        // --- משרות ג'וניור ומתחילים (מוצגות כברירת מחדל) ---
        { 
            title: "Junior Full Stack Developer", 
            company: { display_name: "Wix.com" }, 
            location: { display_name: "Tel Aviv - Remote" }, 
            isJunior: true,
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
            isJunior: true,
            description: `
                <strong>Role Overview:</strong><br>
                We are looking for a brilliant Junior Data Analyst to turn data into valuable business insights. You will conduct full lifecycle analysis to include requirements, activities, and design.<br><br>
                <strong>Key Requirements:</strong><br>
                • 1+ years of experience or strong academic/project portfolio in Data Analysis.<br>
                • Advanced proficiency in SQL queries and data manipulation.<br>
                • Hands-on experience with visualization tools: Tableau, Power BI, or Looker.` 
        },
        { 
            title: "NOC Tier 1 Specialist", 
            company: { display_name: "Palo Alto Networks" }, 
            location: { display_name: "Tel Aviv" }, 
            isJunior: true,
            description: `
                <strong>Role Overview:</strong><br>
                Excellent entry-level opportunity for students or recent graduates! Monitor our production cloud environments, track system telemetry, manage infrastructure alerts, and collaborate with DevOps teams to ensure maximum availability.<br><br>
                <strong>Key Requirements:</strong><br>
                • Basic understanding of networking protocols (TCP/IP, DNS, ping/traceroute).<br>
                • Familiarity with Linux command line environments.<br>
                • Willingness to work in shifts (including nights/weekends) – Perfect for students!`
        },
        { 
            title: "Junior UI/UX Designer", 
            company: { display_name: "Mobileye" }, 
            location: { display_name: "Jerusalem" }, 
            isJunior: true,
            description: `
                <strong>Role Overview:</strong><br>
                Looking for an enthusiastic Junior UI/UX Designer to join our product layout unit. You will help build wireframes, user flows, and high-fidelity interface mockups for vehicle management dashboards.<br><br>
                <strong>Key Requirements:</strong><br>
                • Solid portfolio showing design systems, web layouts, or mobile application wireframes.<br>
                • Proficiency in Figma, Adobe XD, or Illustrator.<br>
                • Understanding of user-centric design theories and visual layout hierarchy.`
        },
        { 
            title: "Java Software Developer (Entry Level)", 
            company: { display_name: "Intel" }, 
            location: { display_name: "Haifa" }, 
            isJunior: true,
            description: `
                <strong>Role Overview:</strong><br>
                Kickstart your software engineering career. Join our validation backend framework group coding in Java. You will learn enterprise paradigms, architectural patterns, and object-oriented testing infrastructure.<br><br>
                <strong>Key Requirements:</strong><br>
                • Solid comprehension of OOP principles, Data Structures, and Java syntax.<br>
                • Academic or independent project portfolio written in Java/Spring Boot.`
        },

        // --- משרות מתקדמות, בכירים וסניורים (לא לג'וניורים - נחשפות בחיפוש) ---
        { 
            title: "Senior Java Software Architect", 
            company: { display_name: "Intel" }, 
            location: { display_name: "Haifa" }, 
            isJunior: false,
            description: `
                <strong>Role Overview:</strong><br>
                We are seeking a Senior Java Architect to spearhead the structural redesign of our enterprise manufacturing data pipelines. You will lead technical design choices, mentor senior developers, and ensure low-latency high-throughput stream processing.<br><br>
                <strong>Key Requirements:</strong><br>
                • 7+ years of experience in enterprise Java development (Java 17+, Spring Boot, Hibernate).<br>
                • Extensive experience with distributed systems design and microservices architecture.<br>
                • Mastery of message brokers (Kafka, RabbitMQ) and caching engines (Redis).<br>
                • Strong background in cloud-native tools (Kubernetes, AWS or Azure).`
        },
        { 
            title: "UI/UX Product Design Lead", 
            company: { display_name: "Wix.com" }, 
            location: { display_name: "Tel Aviv" }, 
            isJunior: false,
            description: `
                <strong>Role Overview:</strong><br>
                Take full design ownership of a global product line used by over 50 million creators. You will manage a talented team of UI/UX designers, conduct deep user research, define cross-product design systems, and partner closely with Product VPs.<br><br>
                <strong>Key Requirements:</strong><br>
                • 5+ years of experience leading UI/UX design operations for complex web/SaaS products.<br>
                • Exceptional portfolio demonstrating product design strategy, UX research, and beautiful interactive design.<br>
                • Expert level skills in Figma component methodologies, design systems, and advanced prototyping.<br>
                • Excellent leadership, presentation, and communication skills.`
        },
        { 
            title: "NOC & Technical Operations Manager", 
            company: { display_name: "Palo Alto Networks" }, 
            location: { display_name: "Tel Aviv" }, 
            isJunior: false,
            description: `
                <strong>Role Overview:</strong><br>
                We are searching for a seasoned NOC Manager to direct our global 24/7 technical incident response and system monitoring team. You will be responsible for defining SLA benchmarks, optimizing incident response cycles, and handling critical production crises.<br><br>
                <strong>Key Requirements:</strong><br>
                • 4+ years managing a NOC team or a technical operations group within an enterprise tech company.<br>
                • Deep mastery of advanced network diagnostics, routing protocols, firewalls, and modern SIEM logging tools.<br>
                • Expert knowledge in infrastructure monitoring software (Datadog, Prometheus, Grafana, Splunk).<br>
                • Outstanding crisis management capabilities and flawless execution under pressure.`
        },
        { 
            title: "Senior Machine Learning Engineer", 
            company: { display_name: "Google" }, 
            location: { display_name: "Tel Aviv-Yafo" }, 
            isJunior: false,
            description: `
                <strong>Role Overview:</strong><br>
                We are looking for an expert ML Engineer to build scalable infrastructure for training and deploying deep learning models. You will optimize neural networks and work alongside researchers to implement production-grade AI solution ecosystem frameworks.<br><br>
                <strong>Key Requirements:</strong><br>
                • 4+ years of professional experience running Machine Learning or computer vision models in production pipelines.<br>
                • Advanced knowledge of Python and deep learning frameworks (PyTorch, TensorFlow).<br>
                • Experience with complex big data infrastructure layers (Spark, Kafka, BigQuery, MLOps).` 
        },
        { 
            title: "Principal Python Backend Engineer", 
            company: { display_name: "Check Point" }, 
            location: { display_name: "Tel Aviv-Yafo" }, 
            isJunior: false,
            description: `
                <strong>Role Overview:</strong><br>
                Join our backend infrastructure security team as a Principal Engineer. You will design and code high-performance distributed microservices, network sniffers, and core cybersecurity elements completely driven by Python.<br><br>
                <strong>Key Requirements:</strong><br>
                • 6+ years of enterprise object-oriented backend development experience with Python.<br>
                • Strong experience with high-concurrency asynchronous programming (Asyncio, Celery) and FastAPI.<br>
                • Deep expertise in relational databases, SQL tuning, and advanced Linux architecture kernels.` 
        },
        { 
            title: "Senior Cyber Security & Penetration Tester", 
            company: { display_name: "CyberArk" }, 
            location: { display_name: "Petah Tikva" }, 
            isJunior: false,
            description: `
                <strong>Role Overview:</strong><br>
                We are looking for an elite Cyber Security Analyst / PT expert. You will execute security audits, hunt for sophisticated vulnerabilities, perform red-team operations, and consult our core R&D teams on secure development lifecycles.<br><br>
                <strong>Key Requirements:</strong><br>
                • 5+ years of practical application security or offensive penetration testing experience.<br>
                • Mastery of OWASP Top 10, binary exploitation, and reverse engineering tools (Ghidra, IDA Pro).<br>
                • Professional security credentials (OSCP, OSCE, CISSP) – A major advantage.<br>
                • Expert level programming in Python, Bash, or Go for exploit automation.` 
        }
    ];

    // פונקציית החיפוש והטעינה הכללית
    async function handleSearch() {
        let query = searchInput.value.trim();
        
        // אם השדה ריק - מציגים אוטומטית רק את משרות הג'וניור
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
            // ניסיון פנייה ל-API חיצוני
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

    // פונקציית סינון חכמה מתוך מאגר הגיבוי המלא (ג'וניור + בכירים)
    function useFallbackSearch(query) {
        const lowerQuery = query.toLowerCase();
        
        const filteredJobs = fallbackJobs.filter(job => 
            job.title.toLowerCase().includes(lowerQuery) || 
            job.company.display_name.toLowerCase().includes(lowerQuery) || 
            job.description.toLowerCase().includes(lowerQuery)
        );

        // אם חיפשו משהו שלא קיים בכלל, נשאיר את רשימת הג'וניורים כדי שהמסך תמיד יהיה רלוונטי
        const finalJobs = filteredJobs.length > 0 ? filteredJobs : fallbackJobs.filter(job => job.isJunior === true);

        updateKPIMetrics(query, finalJobs);
        renderJobCards(finalJobs);
    }

    // פונקציה שמחשבת ומציגה נתוני שוק חיצוניים (KPI) ומעדכנת שכר בהתאם לבכירות המשרה
    function updateKPIMetrics(query, jobs) {
        if (!kpiDashboard || !kpiCount || !kpiSalary) return;
        
        kpiDashboard.classList.remove("hidden");
        kpiCount.textContent = `${jobs.length} openings found`;
        
        const lowerQuery = query.toLowerCase();
        
        // התאמת טווחי שכר משמעותיים למשרות בכירות (Senior/Lead/Manager)
        if (lowerQuery.includes("senior") || lowerQuery.includes("manager") || lowerQuery.includes("architect") || lowerQuery.includes("lead")) {
            if (lowerQuery.includes("java") || lowerQuery.includes("machine") || lowerQuery.includes("ml")) {
                kpiSalary.textContent = "₪38,000 - ₪52,000 / mo";
            } else if (lowerQuery.includes("ux") || lowerQuery.includes("ui") || lowerQuery.includes("noc")) {
                kpiSalary.textContent = "₪24,000 - ₪36,000 / mo";
            } else {
                kpiSalary.textContent = "₪32,000 - ₪46,000 / mo";
            }
        } else {
            // טווחי שכר למשרות רגילות וג'וניורס
            if (lowerQuery.includes("noc")) {
                kpiSalary.textContent = "₪11,000 - ₪14,500 / mo";
            } else if (lowerQuery.includes("ux") || lowerQuery.includes("ui")) {
                kpiSalary.textContent = "₪13,500 - ₪19,000 / mo";
            } else if (lowerQuery.includes("java")) {
                kpiSalary.textContent = "₪16,000 - ₪23,000 / mo";
            } else if (lowerQuery.includes("junior")) {
                kpiSalary.textContent = "₪14,000 - ₪20,000 / mo";
            } else {
                kpiSalary.textContent = "₪18,500 - ₪27,000 / mo";
            }
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
            
            // עיצוב תגית שונה למשרות ג'וניור ומשרות בכירים/סניור
            let levelBadge = '';
            if (job.isJunior) {
                levelBadge = `<span style="font-size: 10px; background: #f0fdf4; color: #166534; padding: 2px 6px; border-radius: 4px; margin-left: 8px; font-weight: bold; border: 1px solid #bbf7d0;">Junior Friendly</span>`;
            } else {
                levelBadge = `<span style="font-size: 10px; background: #fff7ed; color: #c2410c; padding: 2px 6px; border-radius: 4px; margin-left: 8px; font-weight: bold; border: 1px solid #fed7aa;">Senior / Experienced</span>`;
            }

            card.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 5px;">
                    <h3 style="margin: 0; color: #1e293b; font-size: 15px; font-weight:700; text-align: left;">${job.title}</h3>
                    ${levelBadge}
                </div>
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

    // הפעלה ראשונית אוטומטית - מציגה ישר את משרות הג'וניורים!
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
            if (target === "notifications") document.getElementById("notificationsView").classList.remove("hidden");
            if (target === "profile") document.getElementById("profileView").classList.remove("hidden");

            // סגירת מקלדת במעבר מסך כדי שלא תישאר פתוחה סתם
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
    const backToHomeBtn = document.getElementById("backToHomeBtn");
    if (backToHomeBtn) {
        backToHomeBtn.addEventListener("click", () => {
            views.forEach(v => v.classList.add("hidden"));
            document.getElementById("dashboardView").classList.remove("hidden");
            if (virtualKeyboard) virtualKeyboard.style.display = "none";
        });
    }

    // ================= לוגיקת המקלדת הווירטואלית החדשה =================

    // פתיחת המקלדת בעת מיקוד (Focus) בשדה החיפוש
    if (searchInput) {
        searchInput.addEventListener("focus", function () {
            currentActiveInput = searchInput;
            if (virtualKeyboard) virtualKeyboard.style.display = "block";
        });
    }

    // פתיחת המקלדת בעת מיקוד (Focus) בשדה ה-Interview Generator
    if (jobInput) {
        jobInput.addEventListener("focus", function () {
            currentActiveInput = jobInput;
            if (virtualKeyboard) virtualKeyboard.style.display = "block";
        });
    }

    // האזנה ללחיצה על המקשים הרגילים (אותיות ותווים)
    const keys = document.querySelectorAll(".key");
    keys.forEach(key => {
        key.addEventListener("click", function (e) {
            e.preventDefault();
            if (currentActiveInput) {
                currentActiveInput.value += key.innerText;
                currentActiveInput.focus(); // החזרת המיקוד לשדה הטקסט
                
                // אם מדובר בשדה החיפוש, נרצה להפעיל את פונקציית החיפוש בזמן אמת
                if (currentActiveInput === searchInput) {
                    handleSearch();
                }
            }
        });
    });

    // כפתור מחיקה (Del) במקלדת הווירטואלית
    const keyDelete = document.getElementById("keyDelete");
    if (keyDelete) {
        keyDelete.addEventListener("click", function (e) {
            e.preventDefault();
            if (currentActiveInput && currentActiveInput.value.length > 0) {
                currentActiveInput.value = currentActiveInput.value.slice(0, -1);
                currentActiveInput.focus();
                
                if (currentActiveInput === searchInput) {
                    handleSearch();
                }
            }
        });
    }

    // כפתור רווח (Space) במקלדת הווירטואלית
    const keySpace = document.getElementById("keySpace");
    if (keySpace) {
        keySpace.addEventListener("click", function (e) {
            e.preventDefault();
            if (currentActiveInput) {
                currentActiveInput.value += " ";
                currentActiveInput.focus();
                
                if (currentActiveInput === searchInput) {
                    handleSearch();
                }
            }
        });
    }

    // כפתור סגירה וסיום (Done / Close)
    const keyClose = document.getElementById("keyClose");
    if (keyClose) {
        keyClose.addEventListener("click", function (e) {
            e.preventDefault();
            if (virtualKeyboard) virtualKeyboard.style.display = "none";
            if (currentActiveInput) {
                currentActiveInput.blur(); // הסרת הפוקוס מהשדה
            }
        });
    }
});
