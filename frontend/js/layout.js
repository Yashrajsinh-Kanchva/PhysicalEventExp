document.addEventListener('DOMContentLoaded', () => {
    loadComponent('/components/navbar.html', 'navbar', initNavbar);
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

    // 2. Mobile Menu Toggle
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('flex');
        });
    }

    // 3. Show Cart Button on Food Page only
    if (path.includes('food-order')) {
        const cartBtn = document.getElementById('cartToggleNav');
        if (cartBtn) cartBtn.classList.remove('hidden');
    }

    // 4. Cart Click Logic (Triggered here to link to food.js logic)
    const cartToggle = document.getElementById('cartToggleNav');
    if (cartToggle) {
        cartToggle.addEventListener('click', () => {
            const drawer = document.getElementById('cartDrawerOverlay');
            if (drawer) drawer.classList.remove('hidden');
        });
    }
}
