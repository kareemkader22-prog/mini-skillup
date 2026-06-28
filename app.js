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
     
    // אלמנטים של התפריט העליון והמגירה הצידית החדשה
    const menuBtn = document.getElementById("menuBtn");
    const dropdownMenu = document.getElementById("dropdownMenu");
    const sidebarMenu = document.getElementById("sidebarMenu");
    const menuOverlay = document.getElementById("menuOverlay");
     
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
     
    // ================= ניהול תפריט המגירה הצדדי (Sidebar) והתפריט העליון =================
    function openSidebar() {
        if (sidebarMenu && menuOverlay) {
            sidebarMenu.classList.remove("sidebar-hidden");
            menuOverlay.classList.remove("hidden");
        }
    }

    function closeSidebar() {
        if (sidebarMenu && menuOverlay) {
            sidebarMenu.classList.add("sidebar-hidden");
            menuOverlay.classList.add("hidden");
        }
    }

    function toggleMenu() {
        if (!menuBtn || !dropdownMenu) return;
        
        const isOpen = dropdownMenu.style.display === "block";
        dropdownMenu.style.display = isOpen ? "none" : "block";
        
        if (!isOpen) {
            dropdownMenu.style.opacity = "0";
            dropdownMenu.style.transform = "translateY(-5px)";
            setTimeout(() => {
                dropdownMenu.style.transition = "opacity 0.2s ease, transform 0.2s ease";
                dropdownMenu.style.opacity = "1";
                dropdownMenu.style.transform = "translateY(0)";
            }, 10);
        }
    }
     
    function closeMenu() {
        if (dropdownMenu) {
            dropdownMenu.style.opacity = "0";
            dropdownMenu.style.transform = "translateY(-5px)";
            dropdownMenu.style.transition = "opacity 0.2s ease, transform 0.2s ease";
            setTimeout(() => {
                dropdownMenu.style.display = "none";
            }, 200);
        }
    }
     
    if (menuBtn) {
        menuBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (sidebarMenu) {
                openSidebar();
            } else {
                toggleMenu();
            }
        });
    }
     
    if (menuOverlay) {
        menuOverlay.addEventListener("click", closeSidebar);
    }

    document.addEventListener("click", (e) => {
        if (dropdownMenu && menuBtn) {
            const isClickInsideMenu = dropdownMenu.contains(e.target);
            const isClickOnMenuBtn = menuBtn.contains(e.target);
            
            if (!isClickInsideMenu && !isClickOnMenuBtn && dropdownMenu.style.display === "block") {
                closeMenu();
            }
        }
    });
     
    if (dropdownMenu) {
        const menuItems = dropdownMenu.querySelectorAll("a, button");
        menuItems.forEach(item => {
            item.addEventListener("click", () => {
                closeMenu();
            });
        });
    }

    const sidebarItems = document.querySelectorAll(".sidebar-item");
    sidebarItems.forEach(item => {
        item.addEventListener("click", () => {
            const target = item.getAttribute("data-target");
            
            sidebarItems.forEach(i => i.classList.remove("active-sidebar-item"));
            item.classList.add("active-sidebar-item");

            if (target === "interview") {
                views.forEach(v => v.classList.add("hidden"));
                document.getElementById("interviewView")?.classList.remove("hidden");
                navItems.forEach(i => i.classList.remove("active"));
            } else if (target === "home") {
                views.forEach(v => v.classList.add("hidden"));
                document.getElementById("dashboardView")?.classList.remove("hidden");
                navItems.forEach(i => i.classList.remove("active"));
                document.querySelector('.nav-item[data-target="home"]')?.classList.add("active");
            } else {
                alert(`${item.querySelector('.item-title').textContent} is coming soon!`);
            }
            
            closeSidebar();
        });
    });
     
    // מאגר משרות מלא המשלב משרות ג'וניור ומשרות מנוסים
    const fallbackJobs = [
        // --- משרות ג'וניור ומתחילים ---
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
     
        // --- משרות מתקדמות ובכירים ---
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
            if (lowerQuery.includes("java") || lowerQuery.includes("machine") || lowerQuery.includes("ml")) {
                kpiSalary.textContent = "₪38,000 - ₪52,000 / mo";
            } else if (lowerQuery.includes("ux") || lowerQuery.includes("ui") || lowerQuery.includes("noc")) {
                kpiSalary.textContent = "₪24,000 - ₪36,000 / mo";
            } else {
                kpiSalary.textContent = "₪32,000 - ₪46,000 / mo";
            }
        } else {
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
     
    // פונקציה שמייצרת את קארד המשרה עם תמונת הלוגו הרשמית והצבעונית של החברה
    function renderJobCards(jobs) {
        searchResultsArea.innerHTML = "";
        
        // מילון מובנה שממפה את החברה ללוגו הרשמי והצבעוני שלה דרך השרת היציב של גוגל
        const companyAssets = {
            "wix.com": { logo: "https://www.google.com/s2/favicons?sz=64&domain=wix.com" },
            "google": { logo: "https://www.google.com/s2/favicons?sz=64&domain=google.com" },
            "palo alto networks": { logo: "https://www.google.com/s2/favicons?sz=64&domain=paloaltonetworks.com" },
            "mobileye": { logo: "https://www.google.com/s2/favicons?sz=64&domain=mobileye.com" },
            "intel": { logo: "https://www.google.com/s2/favicons?sz=64&domain=intel.com" },
            "check point": { logo: "https://www.google.com/s2/favicons?sz=64&domain=checkpoint.com" },
            "cyberark": { logo: "https://www.google.com/s2/favicons?sz=64&domain=cyberark.com" }
        };
        
        jobs.forEach((job) => {
            const card = document.createElement("div");
            card.className = "card";
            card.style.cursor = "pointer";
            card.style.transition = "transform 0.2s, box-shadow 0.2s";
            card.style.marginBottom = "12px";
            card.style.display = "flex";
            card.style.alignItems = "center";
            card.style.padding = "16px";
            card.style.gap = "14px";
            
            const companyName = job.company?.display_name || "Tech Enterprise";
            const locationName = job.location?.display_name || "Israel (Remote/Hybrid)";
            
            const compKey = companyName.toLowerCase().trim();
            const asset = companyAssets[compKey];
            
            // ברירת מחדל של ראשי התיבות למקרה חירום בלבד
            let initials = companyName.substring(0, 2).toUpperCase();
            let finalLogoUrl = "";

            if (asset && asset.logo) {
                finalLogoUrl = asset.logo;
            } else {
                // יצירת קישור אוטומטי לכל חברה דינמית אחרת
                const cleanDomain = compKey.replace(/\s+/g, '') + ".com";
                finalLogoUrl = `https://www.google.com/s2/favicons?sz=64&domain=${cleanDomain}`;
            }
            
            // תוכן הריבוע הפנימי - תמונת לוגו רשמית בגודל מלא
            let innerContent = `<img src="${finalLogoUrl}" alt="${companyName} Logo" style="width: 28px; height: 28px; object-fit: contain;" onerror="this.onerror=null; this.replaceWith(document.createTextNode('${initials}'))">`;
            
            let levelBadge = '';
            if (job.isJunior) {
                levelBadge = `<span style="font-size: 10px; background: #f0fdf4; color: #166534; padding: 2px 6px; border-radius: 4px; font-weight: bold; border: 1px solid #bbf7d0; white-space: nowrap;">Junior Friendly</span>`;
            } else {
                levelBadge = `<span style="font-size: 10px; background: #fff7ed; color: #c2410c; padding: 2px 6px; border-radius: 4px; font-weight: bold; border: 1px solid #fed7aa; white-space: nowrap;">Senior / Experienced</span>`;
            }
     
            card.innerHTML = `
                <!-- הריבוע החיצוני המעוגל כפול בדיוק לפי העיצוב -->
                <div style="width: 54px; height: 54px; border: 1px solid #e2e8f0; border-radius: 14px; display: flex; justify-content: center; align-items: center; background: #ffffff; flex-shrink: 0;">
                    <!-- הריבוע הפנימי שמציג כעת את התמונה הצבעונית האמיתית -->
                    <div style="width: 38px; height: 38px; background: #f1f5f9; border-radius: 6px; display: flex; justify-content: center; align-items: center; overflow: hidden; box-sizing: border-box;">
                        ${innerContent}
                    </div>
                </div>

                <!-- תוכן המשרה מימין לריבוע התמונה -->
                <div style="flex: 1; display: flex; flex-direction: column; gap: 4px; min-width: 0;">
                    <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
                        <h3 style="margin: 0; color: #1e293b; font-size: 15px; font-weight: 700; text-align: left; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${job.title}</h3>
                        ${levelBadge}
                    </div>
                    <p style="margin: 0; color: #3b71f7; font-weight: 600; font-size: 13px; text-align: left;">${companyName}</p>
                    <div style="display: flex; justify-content: space-between; align-items: center; direction: ltr; margin-top: 2px;">
                        <span style="font-size: 11px; color: #64748b;">📍 ${locationName}</span>
                        <span style="font-size: 11px; color: #3b71f7; font-weight: 600; display: flex; align-items: center; gap: 2px;">Details <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg></span>
                    </div>
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
     
            if (virtualKeyboard) virtualKeyboard.style.display = "none";
        });
    });
     
    const openInterviewBtn = document.getElementById("openInterviewBtn");
    if (openInterviewBtn) {
        openInterviewBtn.addEventListener("click", () => {
            views.forEach(v => v.classList.add("hidden"));
            document.getElementById("interviewView")?.classList.remove("hidden");
            navItems.forEach(i => i.classList.remove("active"));
        });
    }
    const backToHomeBtn = document.getElementById("backToHomeBtn");
    if (backToHomeBtn) {
        backToHomeBtn.addEventListener("click", () => {
            views.forEach(v => v.classList.add("hidden"));
            document.getElementById("dashboardView").classList.remove("hidden");
            if (virtualKeyboard) virtualKeyboard.style.display = "none";
            navItems.forEach(i => i.classList.remove("active"));
            document.querySelector('.nav-item[data-target="home"]')?.classList.add("active");
        });
    }
     
    // ================= לוגיקת המקלדת הווירטואלית המובנית =================
    if (searchInput) {
        searchInput.addEventListener("focus", function () {
            currentActiveInput = searchInput;
            if (virtualKeyboard) virtualKeyboard.style.display = "block";
        });
    }
     
    if (jobInput) {
        jobInput.addEventListener("focus", function () {
            currentActiveInput = jobInput;
            if (virtualKeyboard) virtualKeyboard.style.display = "block";
        });
    }
     
    const keys = document.querySelectorAll(".key");
    keys.forEach(key => {
        key.addEventListener("click", function (e) {
            e.preventDefault();
            if (currentActiveInput) {
                currentActiveInput.value += key.innerText;
                currentActiveInput.focus();
                
                if (currentActiveInput === searchInput) {
                    handleSearch();
                }
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
                
                if (currentActiveInput === searchInput) {
                    handleSearch();
                }
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
                
                if (currentActiveInput === searchInput) {
                    handleSearch();
                }
            }
        });
    }
     
    const keyClose = document.getElementById("keyClose");
    if (keyClose) {
        keyClose.addEventListener("click", function (e) {
            e.preventDefault();
            if (virtualKeyboard) virtualKeyboard.style.display = "none";
            if (currentActiveInput) {
                currentActiveInput.blur();
            }
        });
    }
     
    // ================= פירוק הפרופיל ל-4 מרובעים נפרדים מעוצבים עם תגיות מעוצבות לפי image_17a238.png =================
    function upgradeProfileLayout() {
        const profileView = document.getElementById("profileView");
        if (!profileView) return;
     
        // רשימת הכישורים המעוצבים כבאדג'ים
        const skills = ["Python", "SQL", "JavaScript", "Git", "HTML", "CSS", "Problem Solving"];
        
        // יצירת מחרוזת ה-HTML עבור ה-Skills כבלונים מעוגלים זה לצד זה
        const skillsHTML = `
            <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 4px;">
                ${skills.map(skill => `
                    <span style="font-size: 12px; background-color: #eff6ff; color: #2563eb; padding: 6px 14px; border-radius: 20px; font-weight: 500; font-family: sans-serif; border: 1px solid #dbeafe; display: inline-block;">
                        ${skill}
                    </span>
                `).join('')}
            </div>
        `;

        const profileData = [
            { 
                title: "Education", 
                text: `<div style="display: flex; flex-direction: column; gap: 2px;">
                        <span style="font-weight: 600; color: #1e293b;">Social Sciences & Tech Student</span>
                        <span style="color: #64748b; font-size: 12px;">University Student</span>
                       </div>`, 
                icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b71f7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5-10 5z"></path><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path></svg>`,
                isEducation: true 
            },
            { 
                title: "Background", 
                text: "Motivated university student with a strong passion for technology. Eager to learn, grow, and start a professional career in the tech industry.", 
                icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b71f7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>` 
            },
            { 
                title: "Target Goal", 
                text: "Looking for my first opportunity in the Tech industry, with a focus on Software Development.", 
                icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b71f7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>` 
            }, 
            { 
                title: "Top Skills", 
                text: skillsHTML, 
                icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b71f7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>` 
            }
        ];
     
        let profileCardsContainer = document.getElementById("profileCardsContainer");
        
        if (!profileCardsContainer) {
            profileCardsContainer = document.createElement("div");
            profileCardsContainer.id = "profileCardsContainer";
            profileCardsContainer.style.marginTop = "15px";
            profileCardsContainer.style.padding = "0 15px";
            profileCardsContainer.style.display = "flex";
            profileCardsContainer.style.flexDirection = "column";
            profileCardsContainer.style.gap = "14px";
     
            const oldAboutMeBlock = profileView.querySelector(".card") ? profileView.querySelectorAll(".card")[1] : null;
            if (oldAboutMeBlock) {
                oldAboutMeBlock.replaceWith(profileCardsContainer);
            } else {
                profileView.appendChild(profileCardsContainer);
            }
        }
     
        // מחיקת התוכן הישן כדי לבנות את הכל מחדש בצורה מושלמת לפי המבנה של התמונה image_17a238.png
        profileCardsContainer.innerHTML = "";
     
        // 1. יצירת ה-KPI Grid החדש (שורת הסטטיסטיקות העליונה בעלת 4 עמודות)
        const statsGrid = document.createElement("div");
        statsGrid.style.display = "grid";
        statsGrid.style.gridTemplateColumns = "repeat(4, 1fr)";
        statsGrid.style.gap = "10px";
        statsGrid.style.backgroundColor = "#ffffff";
        statsGrid.style.borderRadius = "12px";
        statsGrid.style.padding = "14px 8px";
        statsGrid.style.border = "1px solid #e2e8f0";
        statsGrid.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.05)";
        
        const statsData = [
            { value: "3/5", label: "Goals Set", color: "#10b981", bg: "#ecfdf5", icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="2"></circle></svg>` },
            { value: "4", label: "Skills Added", color: "#8b5cf6", bg: "#f5f3ff", icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>` },
            { value: "2", label: "Applications", color: "#f59e0b", bg: "#fffbeb", icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>` },
            { value: "7", label: "Profile Views", color: "#3b82f6", bg: "#eff6ff", icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>` }
        ];

        statsData.forEach(stat => {
            const statBox = document.createElement("div");
            statBox.style.display = "flex";
            statBox.style.flexDirection = "column";
            statBox.style.alignItems = "center";
            statBox.style.gap = "4px";
            statBox.innerHTML = `
                <div style="background-color: ${stat.bg}; color: ${stat.color}; width: 28px; height: 28px; border-radius: 50%; display: flex; justify-content: center; align-items: center;">
                    ${stat.icon}
                </div>
                <span style="font-size: 14px; font-weight: 700; color: #1e293b;">${stat.value}</span>
                <span style="font-size: 10px; color: #64748b; white-space: nowrap;">${stat.label}</span>
            `;
            statsGrid.appendChild(statBox);
        });
        
        profileCardsContainer.appendChild(statsGrid);

        // 2. הוספת ארבעת כרטיסי המידע (Education, Background, Target Goal, Top Skills)
        profileData.forEach(item => {
            const squareCard = document.createElement("div");
            squareCard.style.backgroundColor = "#ffffff";
            squareCard.style.borderRadius = "12px";
            squareCard.style.padding = "16px";
            squareCard.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.05)";
            squareCard.style.border = "1px solid #e2e8f0";
            squareCard.style.textAlign = "left"; 
            squareCard.style.direction = "ltr";
            
            const currentBadgeHTML = item.isEducation 
                ? `<span style="font-size: 11px; background-color: #f0fdf4; color: #166534; padding: 3px 10px; border-radius: 12px; font-weight: bold; border: 1px solid #bbf7d0; margin-left: auto;">Current</span>` 
                : '';
     
            squareCard.innerHTML = `
                <div style="display: flex; align-items: center; margin-bottom: 8px; gap: 10px; width: 100%;">
                    <div style="background: #eff6ff; width: 32px; height: 32px; display: flex; justify-content: center; align-items: center; border-radius: 8px; flex-shrink: 0;">
                        ${item.icon}
                    </div>
                    <strong style="color: #1e293b; font-size: 14px; font-weight: 700; font-family: sans-serif;">${item.title}</strong>
                    ${currentBadgeHTML}
                </div>
                <div style="margin: 0; color: #475569; font-size: 13px; line-height: 1.5; font-family: sans-serif; padding-left: 42px;">
                    ${item.text}
                </div>
            `;
            profileCardsContainer.appendChild(squareCard);
        });

        // 3. יצירת באנר הטיפ (Profile Tip) עם הכפתור הימני
        const tipBanner = document.createElement("div");
        tipBanner.style.backgroundColor = "#eff6ff";
        tipBanner.style.borderRadius = "12px";
        tipBanner.style.padding = "14px 16px";
        tipBanner.style.border = "1px solid #bfdbfe";
        tipBanner.style.display = "flex";
        tipBanner.style.alignItems = "center";
        tipBanner.style.justifyContent = "space-between";
        tipBanner.style.gap = "12px";
        tipBanner.style.direction = "ltr";
        tipBanner.style.textAlign = "left";

        tipBanner.innerHTML = `
            <div style="display: flex; align-items: flex-start; gap: 10px;">
                <span style="color: #2563eb; font-size: 18px; margin-top: 1px;">✨</span>
                <div style="display: flex; flex-direction: column;">
                    <span style="font-size: 13px; font-weight: 700; color: #1e293b; font-family: sans-serif;">Profile Tip</span>
                    <span style="font-size: 11px; color: #475569; font-family: sans-serif; line-height: 1.4; margin-top: 2px;">Add more projects and skills to increase your match rate with job opportunities.</span>
                </div>
            </div>
            <button style="background-color: #ffffff; color: #2563eb; border: 1px solid #bfdbfe; font-size: 11px; font-weight: 700; padding: 7px 12px; border-radius: 8px; cursor: pointer; white-space: nowrap; font-family: sans-serif; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
                ↗ Improve Profile
            </button>
        `;
        profileCardsContainer.appendChild(tipBanner);

        // 4. יצירת בלוק פעילות אחרונה (Recent Activity)
        const activityBlock = document.createElement("div");
        activityBlock.style.backgroundColor = "#ffffff";
        activityBlock.style.borderRadius = "12px";
        activityBlock.style.padding = "16px";
        activityBlock.style.border = "1px solid #e2e8f0";
        activityBlock.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.05)";
        activityBlock.style.display = "flex";
        activityBlock.style.flexDirection = "column";
        activityBlock.style.gap = "12px";
        activityBlock.style.direction = "ltr";
        activityBlock.style.textAlign = "left";

        activityBlock.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                <span style="font-size: 14px; font-weight: 700; color: #1e293b; font-family: sans-serif;">Recent Activity</span>
                <span style="font-size: 12px; font-weight: 600; color: #2563eb; cursor: pointer; font-family: sans-serif;">View All</span>
            </div>
            
            <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 4px;">
                <!-- פעילות 1 -->
                <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="background-color: #e0f2fe; color: #0369a1; width: 24px; height: 24px; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 12px;">✓</div>
                        <span style="font-size: 13px; color: #334155; font-family: sans-serif;">Profile updated</span>
                    </div>
                    <span style="font-size: 11px; color: #94a3b8; font-family: sans-serif;">2 days ago</span>
                </div>
                <!-- פעילות 2 -->
                <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="background-color: #f3e8ff; color: #6b21a8; width: 24px; height: 24px; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 12px;">+</div>
                        <span style="font-size: 13px; color: #334155; font-family: sans-serif;">Added new skill: JavaScript</span>
                    </div>
                    <span style="font-size: 11px; color: #94a3b8; font-family: sans-serif;">5 days ago</span>
                </div>
            </div>
        `;
        profileCardsContainer.appendChild(activityBlock);
    }
     
    upgradeProfileLayout();
     
});
