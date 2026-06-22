document.addEventListener('DOMContentLoaded', () => {
    // --- Navigation Variables ---
    const dashboardView = document.getElementById('dashboardView');
    const interviewView = document.getElementById('interviewView');
    const openInterviewBtn = document.getElementById('openInterviewBtn');
    const backToHomeBtn = document.getElementById('backToHomeBtn');
    const navItems = document.querySelectorAll('.nav-item');

    // --- Interview Feature Variables ---
    const generateBtn = document.getElementById('generateBtn');
    const jobInput = document.getElementById('jobInput');
    const loadingDiv = document.getElementById('loading');
    const resultsDiv = document.getElementById('results');
    const errorBox = document.getElementById('errorBox');
    const techList = document.getElementById('techList');
    const hrList = document.getElementById('hrList');
    const caseList = document.getElementById('caseList');

    // ================= APP NAVIGATION LOGIC =================
    
    // Switch to Interview Generator
    openInterviewBtn.addEventListener('click', () => {
        dashboardView.classList.add('hidden');
        interviewView.classList.remove('hidden');
        updateBottomNav('none'); // clear bottom nav selection
    });

    // Switch back to Dashboard
    backToHomeBtn.addEventListener('click', () => {
        interviewView.classList.add('hidden');
        dashboardView.classList.remove('hidden');
        updateBottomNav('home');
    });

    // Bottom Navigation Clicks
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const target = item.getAttribute('data-target');
            
            // Only 'home' works right now
            if (target === 'home') {
                interviewView.classList.add('hidden');
                dashboardView.classList.remove('hidden');
                updateBottomNav('home');
            } else {
                // Just visually select it and show an alert
                updateBottomNav(target);
                alert('This tab is under construction!');
                // Snap back to home selection visually
                setTimeout(() => updateBottomNav('home'), 500); 
            }
        });
    });

    function updateBottomNav(targetId) {
        navItems.forEach(nav => {
            if(nav.getAttribute('data-target') === targetId) {
                nav.classList.add('active');
            } else {
                nav.classList.remove('active');
            }
        });
    }


    // ================= AI INTERVIEW LOGIC =================

    generateBtn.addEventListener('click', async () => {
        const jobDescription = jobInput.value.trim();
        
        if (!jobDescription) {
            showError("Please paste a job description first.");
            return;
        }

        // Reset UI
        errorBox.classList.add('hidden');
        resultsDiv.classList.add('hidden');
        loadingDiv.classList.remove('hidden');
        generateBtn.disabled = true;

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ jobDescription })
            });

            if (!response.ok) {
                throw new Error("Server failed to generate questions.");
            }

            const data = await response.json();
            
            // Populate lists
            populateList(techList, data.technical);
            populateList(hrList, data.behavioral);
            populateList(caseList, data.caseStudy);

            // Show results
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

    function populateList(listElement, items) {
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
        errorBox.textContent = message;
        errorBox.classList.remove('hidden');
    }
})