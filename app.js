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

    // --- NEW: Menu Variables ---
    const menuBtn = document.getElementById('menuBtn');
    const sideMenu = document.getElementById('sideMenu');
    const closeMenuBtn = document.getElementById('closeMenuBtn');
    const menuOverlay = document.getElementById('menuOverlay');

    // ... Interview Feature Variables ... (as before)
    const generateBtn = document.getElementById('generateBtn');
    // ...

    // Hide all views function
    function hideAllViews() {
        dashboardView.classList.add('hidden');
        interviewView.classList.add('hidden');
        searchView.classList.add('hidden');
        notificationsView.classList.add('hidden');
        profileView.classList.add('hidden');
        // NEW: Always close the side menu when navigating
        closeSideMenu();
    }

    // ================= APP NAVIGATION LOGIC =================
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

    // ================= NEW: MENU LOGIC =================
    // Function to close menu
    function closeSideMenu() {
        if(sideMenu) sideMenu.classList.remove('open');
        if(menuOverlay) menuOverlay.classList.remove('open');
    }

    // Open Menu
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            sideMenu.classList.add('open');
            menuOverlay.classList.add('open');
        });
    }

    // Close Menu (with X button)
    if (closeMenuBtn) {
        closeMenuBtn.addEventListener('click', closeSideMenu);
    }

    // Close Menu (clicking outside)
    if (menuOverlay) {
        menuOverlay.addEventListener('click', closeSideMenu);
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape" && sideMenu && sideMenu.classList.contains('open')) {
            closeSideMenu();
        }
    });

    // ... Rest of your existing interview logic ...
    // ... VIRTUAL KEYBOARD LOGIC ... (keep as before)
    // ... AI INTERVIEW LOGIC ... (keep as before)
});
