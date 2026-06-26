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

    // אלמנטים של חלון המודל
    const jobDetailModal = document.getElementById("jobDetailModal");
    const closeModalBtn = document.getElementById("closeModalBtn");
    const modalBarClose = document.getElementById("modalBarClose");
    const modalJobTitle = document.getElementById("modalJobTitle");
    const modalJobCompany = document.getElementById("modalJobCompany");
    const modalJobDetails = document.getElementById("modalJobDetails");

    // אלמנטים של התפריט העליון
    const menuBtn = document.getElementById("menuBtn");
    const dropdownMenu = document.getElementById("dropdownMenu");

    // מקלדת וירטואלית
    const keys = document.querySelectorAll("#virtualKeyboard .key");
    const keyDelete = document.getElementById("keyDelete");
    const keyClose = document.getElementById("keyClose");
    const keySpace = document.getElementById("keySpace");

    // ===== מאגר משרות =====
    const fallbackJobs = [
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
                • Extensive experience with distributed systems design and microservices architecture.`
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
                • 5+ years of experience leading UI/UX design operations for complex web/SaaS products.`
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
                • 4+ years of professional experience running Machine Learning or computer vision models in production pipelines.`
        }
    ];

    // ===== Menu Functionality =====
    if (menuBtn && dropdownMenu) {
        menuBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            dropdownMenu.style.display = dropdownMenu.style.display === "none" ? "block" : "none";
        });
        document.addEventListener("click", () => {
            dropdownMenu.style.display = "none";
        });
    }

    // ===== Virtual Keyboard Functions =====
    function showVirtualKeyboard() {
        if (virtualKeyboard) {
            virtualKeyboard.style.display = "block";
            virtualKeyboard.style.position = "fixed";
            virtualKeyboard.style.bottom = "0";
            virtualKeyboard.style.left = "0";
            virtualKeyboard.style.right = "0";
            virtualKeyboard.style.zIndex = "2000";
            virtualKeyboard.style.margin = "0";
            virtualKeyboard.style.borderRadius = "16px 16px 0 0";
            virtualKeyboard.style.maxHeight = "300px";
            virtualKeyboard.style.overflowY = "auto";
        }
    }

    function hideVirtualKeyboard() {
        if (virtualKeyboard) {
            virtualKeyboard.style.display = "none";
        }
    }

    // Setup virtual keyboard keys
    if (keys && keys.length > 0) {
        keys.forEach(key => {
            key.addEventListener("click", (e) => {
                const char = key.textContent.trim();
                if (searchInput && char.length === 1) {
                    searchInput.value += char;
                    searchInput.focus();
                }
            });
        });
    }

    if (keyDelete) {
        keyDelete.addEventListener("click", () => {
            if (searchInput) {
                searchInput.value = searchInput.value.slice(0, -1);
                searchInput.focus();
            }
        });
    }

    if (keySpace) {
        keySpace.addEventListener("click", () => {
            if (searchInput) {
                searchInput.value += " ";
                searchInput.focus();
            }
        });
    }

    if (keyClose) {
        keyClose.addEventListener("click", () => {
            hideVirtualKeyboard();
            const searchView = document.getElementById("searchView");
            if (searchView) {
                searchView.style.paddingBottom = "0";
            }
        });
    }

    // Show keyboard when clicking input
    if (searchInput) {
        searchInput.addEventListener("focus", () => {
            showVirtualKeyboard();
            // Add padding to search view so content doesn't hide behind keyboard
            const searchView = document.getElementById("searchView");
            if (searchView) {
                searchView.style.paddingBottom = "320px";
            }
        });
        searchInput.addEventListener("click", () => {
            showVirtualKeyboard();
            const searchView = document.getElementById("searchView");
            if (searchView) {
                searchView.style.paddingBottom = "320px";
            }
        });
    }

    // ===== Search Functions =====
    async function handleSearch() {
        let query = searchInput.value.trim();
        
        if (!query) {
            const juniorJobs = fallbackJobs.filter(job => job.isJunior === true);
            updateKPIMetrics("Junior", juniorJobs);
            renderJobCards(juniorJobs);
            return;
        }

        searchResultsArea.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <div style="width: 50px; height: 50px; border: 4px solid #e2e8f0; border-top-color: #3b71f7; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto; margin-bottom: 10px;"></div>
                <p style="color: #64748b; font-size: 13px;">Scanning tech ecosystem in Israel...</p>
            </div>`;

        try {
            // ניסיון פנייה ל-API חיצוני
            const url = `https://api.adzuna.com/v1/api/jobs/il/search/1?app_id=c49747cb&app_key=9b83bba0ba50b070bc064a787cd04052&what=${encodeURIComponent(query)}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error("API Network issue");
            
            const data = await response.json();
            const jobs = data.results || [];
            
            if (jobs.length === 0) {
                useFallbackSearch(query);
            } else {
                updateKPIMetrics(query, jobs);
                renderJobCards(jobs);
            }
        } catch (error) {
            console.warn("External API restricted. Using fallback.", error);
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
        
        if (lowerQuery.includes("senior") || lowerQuery.includes("manager") || lowerQuery.includes("architect")) {
            if (lowerQuery.includes("java") || lowerQuery.includes("machine")) {
                kpiSalary.textContent = "₪38,000 - ₪52,000 / mo";
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

    function renderJobCards(jobs) {
        searchResultsArea.innerHTML = "";
        
        if (jobs.length === 0) {
            searchResultsArea.innerHTML = `<p style="text-align: center; color: #94a3b8; padding: 20px;">No jobs found</p>`;
            return;
        }
        
        jobs.forEach((job) => {
            const card = document.createElement("div");
            card.className = "card";
            card.style.cursor = "pointer";
            card.style.transition = "transform 0.2s, box-shadow 0.2s";
            card.style.marginBottom = "12px";
            
            const companyName = job.company?.display_name || "Tech Enterprise";
            const locationName = job.location?.display_name || "Israel";
            
            let levelBadge = '';
            if (job.isJunior) {
                levelBadge = `<span style="font-size: 10px; background: #f0fdf4; color: #166534; padding: 2px 6px; border-radius: 4px; margin-left: 8px; font-weight: bold;">Junior</span>`;
            } else {
                levelBadge = `<span style="font-size: 10px; background: #fff7ed; color: #c2410c; padding: 2px 6px; border-radius: 4px; margin-left: 8px; font-weight: bold;">Senior</span>`;
            }

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
            <div style="font-size: 13px; color: #334155; line-height: 1.6; margin-bottom: 20px; max-height:260px; overflow-y:auto;">
                ${job.description}
            </div>
            <button class="primary-btn" onclick="alert('Applied successfully!')">Apply Now</button>
        `;
        
        jobDetailModal.classList.remove("hidden");
    }

    function closeJobModal() {
        if (jobDetailModal) jobDetailModal.classList.add("hidden");
    }

    if (closeModalBtn) closeModalBtn.addEventListener("click", closeJobModal);
    if (modalBarClose) modalBarClose.addEventListener("click", closeJobModal);

    // ===== Search Button Handler =====
    if (searchSubmitBtn) {
        searchSubmitBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            hideVirtualKeyboard();
            const searchView = document.getElementById("searchView");
            if (searchView) {
                searchView.style.paddingBottom = "0";
            }
            handleSearch();
        });
    }

    if (searchInput) {
        searchInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                handleSearch();
                hideVirtualKeyboard();
                const searchView = document.getElementById("searchView");
                if (searchView) {
                    searchView.style.paddingBottom = "0";
                }
            }
        });
    }

    // Initial Load
    handleSearch();

    // ===== AI INTERVIEW LOGIC =====
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
                const questions = generateQuestions(jobDescription);
                
                populateList(techList, questions.technical);
                populateList(hrList, questions.behavioral);
                populateList(caseList, questions.caseStudy);

                loadingDiv.classList.add('hidden');
                resultsDiv.classList.remove('hidden');

            } catch (error) {
                console.error(error);
                loadingDiv.classList.add('hidden');
                showError("Failed to generate questions.");
            } finally {
                generateBtn.disabled = false;
            }
        });
    }

    function generateQuestions(jobDescription) {
        const lowerDesc = jobDescription.toLowerCase();
        
        let technical = [
            "What technologies have you worked with in similar roles?",
            "How would you approach learning a new technology required for this role?",
            "Describe your experience with the main tech stack mentioned in this job."
        ];
        
        let behavioral = [
            "Tell us about a time you overcame a technical challenge.",
            "How do you handle feedback from senior developers?",
            "Describe your experience working in a team environment."
        ];
        
        let caseStudy = [
            "How would you design a solution for the problem mentioned?",
            "Walk us through your approach to solving real-world problems."
        ];

        return { technical, behavioral, caseStudy };
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

    // ===== Navigation Logic =====
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

    jobDetailModal?.addEventListener("click", (e) => {
        if (e.target === jobDetailModal) {
            closeJobModal();
        }
    });
});
