import { loginWithGoogle, logout, subscribeToAuthChanges } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
    loadComponent('/components/navbar.html', 'navbar', () => {
        initNavbar();
        setupAuthHandler();
    });
    loadComponent('/components/footer.html', 'footer');
});

async function loadComponent(url, elementId, callback) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;
        if (callback) callback();
    } catch (error) {
        console.error(`Error loading component from ${url}:`, error);
    }
}

function setupAuthHandler() {
    const authContainer = document.getElementById('authContainer');

    subscribeToAuthChanges((user) => {
        if (!authContainer) return;

        if (user) {
            authContainer.innerHTML = `
                <div class="flex items-center gap-2 group cursor-pointer relative" id="userProfile">
                    <div class="flex flex-col items-end mr-1">
                        <span class="text-[0.6rem] font-bold text-white leading-tight">${user.displayName}</span>
                        <span id="logoutBtn" class="text-[0.5rem] font-black text-accent uppercase tracking-tighter hover:text-white transition-colors" style="cursor:pointer">Sign Out</span>
                    </div>
                    <img src="${user.photoURL}" class="w-8 h-8 rounded-lg border border-accent/20 group-hover:border-accent/60 transition-all shadow-lg" alt="Profile">
                </div>
            `;
            const logoutTrigger = document.getElementById('logoutBtn');
            if(logoutTrigger) logoutTrigger.addEventListener('click', (e) => {
                e.stopPropagation();
                logout();
            });
        } else {
            const isGuest = sessionStorage.getItem('sf_guest_mode') === 'true';
            if (isGuest) {
                 authContainer.innerHTML = `
                    <div class="flex items-center gap-2">
                        <span class="text-[0.6rem] font-bold text-slate-400 uppercase tracking-widest">Guest Access</span>
                        <i id="guestExit" class="fa-solid fa-right-from-bracket text-[0.7rem] text-accent/60 hover:text-accent cursor-pointer transition-colors"></i>
                    </div>
                `;
                const exitTrigger = document.getElementById('guestExit');
                if(exitTrigger) exitTrigger.addEventListener('click', () => {
                    sessionStorage.removeItem('sf_guest_mode');
                    window.location.href = '/pages/login.html';
                });
            } else if (!window.location.pathname.includes('login.html')) {
                window.location.href = '/pages/login.html';
            }
        }
    });
}

function initNavbar() {
    const path = window.location.pathname;
    const links = document.querySelectorAll('#navLinks a');
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (path === href || (path === '/' && href === '/index.html') || (path.includes(href) && href !== '/index.html')) {
            link.classList.add('text-white', 'border-b-2', 'border-accent');
            link.classList.remove('text-slate-400');
        }
    });

    const mobileBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    if (path.includes('food-order')) {
        const cartBtn = document.getElementById('cartToggleNav');
        if (cartBtn) cartBtn.classList.remove('hidden');
    }
}

