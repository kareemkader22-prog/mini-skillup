document.addEventListener('DOMContentLoaded', () => {
    // --- Navigation Variables ---
    const dashboardView = document.getElementById('dashboardView');
    const interviewView = document.getElementById('interviewView');
    const searchView = document.getElementById('searchView');
    const notificationsView = document.getElementById('notificationsView');
    const profileView = document.getElementById('profileView');

    const openInterviewBtn = document.getElementById('openInterviewBtn');
    const backToHomeBtn = document.getElementById('backToHomeBtn');
    const navItems = document.querySelectorAll('.nav-item');

    // --- Menu Variables ---
    const menuBtn = document.getElementById('menuBtn');
    const sideMenu = document.getElementById('sideMenu');
    const closeMenuBtn = document.getElementById('closeMenuBtn');
    const menuOverlay = document.getElementById('menuOverlay');

    // --- Search & Virtual Keyboard Variables ---
    const searchInput = document.getElementById("searchInput");
    const keyboard = document.getElementById("virtualKeyboard");
    const deleteBtn = document.getElementById("keyDelete");
    const spaceBtn = document.getElementById("keySpace");
    const closeKeyboardBtn = document.getElementById("keyClose");
    const searchSubmitBtn = document.getElementById("searchSubmitBtn");
    const searchResultsArea = document.getElementById('searchResultsArea');

    // ================= APP NAVIGATION LOGIC =================

    // Hide all views function
    function hideAllViews() {
        dashboardView.classList.add('hidden');
        interviewView.classList.add('hidden');
        searchView.classList.add('hidden');
        notificationsView.classList.add('hidden');
        profileView.classList.add('hidden');
    }

    // Switch to Interview Generator
    if (openInterviewBtn) {
        openInterviewBtn.addEventListener('click', () => {
            hideAllViews();
            interviewView.classList.remove('hidden');
            updateBottomNav('none'); // Clear bottom nav selection
        });
    }

    // Switch back to Dashboard
    if (backToHomeBtn) {
        backToHomeBtn.addEventListener('click', () => {
            hideAllViews();
            dashboardView.classList.remove('hidden');
            updateBottomNav('home');
        });
    }

    // Bottom Navigation Clicks
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const target = item.getAttribute('data-target');
            hideAllViews();

            if (target === 'home') {
                dashboardView.classList.remove('hidden');
                updateBottomNav('home');
            } else if (target === 'search') {
                searchView.classList.remove('hidden');
                updateBottomNav('search');
            } else if (target === 'notifications') {
                notificationsView.classList.remove('hidden');
                updateBottomNav('notifications');
            } else if (target === 'profile') {
                profileView.classList.remove('hidden');
                updateBottomNav('profile');
            }
        });
    });

    function updateBottomNav(targetId) {
        navItems.forEach(nav => {
            if (nav.getAttribute('data-target') === targetId) {
                nav.classList.add('active');
            } else {
                nav.classList.remove('active');
            }
        });
    }

    // ================= MENU LOGIC =================

    // Open Menu
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            sideMenu.classList.add('open');
            menuOverlay.classList.add('open');
        });
    }

    // Close Menu (Cross button, Overlay, or Escape key)
    function closeMenu() {
        sideMenu.classList.remove('open');
        menuOverlay.classList.remove('open');
    }

    if (closeMenuBtn) {
        closeMenuBtn.addEventListener('click', closeMenu);
    }

    if (menuOverlay) {
        menuOverlay.addEventListener('click', closeMenu);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape" && sideMenu.classList.contains('open')) {
            closeMenu();
        }
    });

    // Close menu when clicking outside (not the menu or menu button)
    document.addEventListener("click", (e) => {
        if (sideMenu.classList.contains('open') && !sideMenu.contains(e.target) && e.target !== menuBtn && !menuBtn.contains(e.target)) {
            closeMenu();
        }
    });

    // ================= VIRTUAL KEYBOARD LOGIC =================

    // Open Keyboard
    if (searchInput && keyboard) {
        searchInput.addEventListener("click", (e) => {
            e.stopPropagation(); // Prevent closing when clicking the input
            keyboard.classList.add("visible");
            keyboard.style.display = "block"; // Required for initial visibility
        });
    }

    // Close Keyboard
    function closeKeyboard() {
        if (keyboard) {
            keyboard.classList.remove("visible");
            keyboard.style.display = "none";
        }
    }

    if (closeKeyboardBtn) {
        closeKeyboardBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            closeKeyboard();
        });
    }

    // Close Keyboard on outside click
    document.addEventListener("click", (e) => {
        if (keyboard.classList.contains('visible') && !keyboard.contains(e.target) && e.target !== searchInput) {
            closeKeyboard();
        }
    });

    // Handle character input
    document.querySelectorAll(".key").forEach(keyBtn => {
        // Skip special keys (handled separately)
        if (["keyDelete", "keySpace", "keyClose"].includes(keyBtn.id)) return;

        keyBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (searchInput) {
                searchInput.value += keyBtn.innerText;
                searchInput.focus(); // Keep focus for smoother typing
            }
        });
    });

    // Handle space key
    if (spaceBtn) {
        spaceBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (searchInput) {
                searchInput.value += " ";
            }
        });
    }

    // Handle delete key (backspace)
    if (deleteBtn) {
        deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (searchInput) {
                searchInput.value = searchInput.value.slice(0, -1);
            }
        });
    }

    // ================= SEARCH RESULTS LOGIC =================

    // Real-time Search Input Handling
    if (searchInput) {
        searchInput.addEventListener('input', showSearchResults);
    }

    if (searchSubmitBtn) {
        searchSubmitBtn.addEventListener('click', showSearchResults);
    }

    function showSearchResults() {
        // Use real input value, or fallback to an empty string.
        const query = (searchInput ? searchInput.value.trim() : "").toLowerCase();
        
        // Always close keyboard on search submission
        closeKeyboard();

        if (query === "") {
            searchResultsArea.innerHTML = "";
            return;
        }

        // Simulating result logic - replace this with real API calls if available.
        let resultsHTML = "";
        const resultsData = {
            "dev": [
                { title: "Junior Front-End Developer", company: "TechCorp", description: "Build modern web interfaces with React." },
                { title: "Node.js Back-End Engineer", company: "DataFlow", description: "Design scalable back-end solutions." }
            ],
            "data": [
                { title: "Data Analyst Internship", company: "Insight Solutions", description: "Analyze customer data and create reports." }
            ],
            "amdocs": [
                { title: "Network Quality Assurance", company: "Amdocs", description: "Ensure quality for Amdocs networking products." },
                { title: "Technical Support", company: "Amdocs", description: "Handle technical issues for global clients." },
            ],
            // More generalized cases
            "python": [
              {title: "Junior Python Backend", company: "Amdocs", description: "Amdocs is hiring junior devs"},
            ]
        };

        // Create results
        if (query in resultsData) {
            resultsData[query].forEach(job => {
                resultsHTML += `
                    <div class="search-result-card" style="margin-bottom: 12px; background: white; padding: 15px; border-radius: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                        <h4 style="color: #0f172a; margin-top: 0; margin-bottom: 5px; font-weight: 600;">${job.title}</h4>
                        <p style="color: #64748b; font-size: 13px; margin: 0;">${job.company}</p>
                        <p style="color: #475569; font-size: 14px; margin-top: 8px; margin-bottom: 0;">${job.description}</p>
                    </div>
                `;
            });
        } else {
            resultsHTML = `<p style="text-align: center; color: #666; margin-top: 20px;">No results found for "${query}". Try 'dev', 'data', or 'amdocs'.</p>`;
        }

        // Add to DOM
        if (searchResultsArea) {
            searchResultsArea.innerHTML = resultsHTML;
        }
    }
});
