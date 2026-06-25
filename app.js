document.addEventListener('DOMContentLoaded', () => {
    // אלמנטים של הניווט
    const dashboardView = document.getElementById('dashboardView');
    const interviewView = document.getElementById('interviewView');
    const openInterviewBtn = document.getElementById('openInterviewBtn');
    const backToHomeBtn = document.getElementById('backToHomeBtn');
    const navItems = document.querySelectorAll('.nav-item');

    // אלמנטים של תפריט הצד
    const menuBtn = document.getElementById('menuBtn');
    const sideMenu = document.getElementById('sideMenu');
    const closeMenuBtn = document.getElementById('closeMenuBtn');
    const menuOverlay = document.getElementById('menuOverlay');

    function hideAllViews() {
        dashboardView.classList.add('hidden');
        interviewView.classList.add('hidden');
        closeSideMenu();
    }

    // מעבר לפיצ'ר ראיון
    if (openInterviewBtn) {
        openInterviewBtn.addEventListener('click', () => {
            hideAllViews();
            interviewView.classList.remove('hidden');
        });
    }

    // חזרה למסך הבית
    if (backToHomeBtn) {
        backToHomeBtn.addEventListener('click', () => {
            hideAllViews();
            dashboardView.classList.remove('hidden');
        });
    }

    // לוגיקת תפריט צדדי
    function closeSideMenu() {
        if(sideMenu) sideMenu.classList.remove('open');
        if(menuOverlay) menuOverlay.classList.remove('open');
    }

    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            sideMenu.classList.add('open');
            menuOverlay.classList.add('open');
        });
    }

    if (closeMenuBtn) closeMenuBtn.addEventListener('click', closeSideMenu);
    if (menuOverlay) menuOverlay.addEventListener('click', closeSideMenu);
});
