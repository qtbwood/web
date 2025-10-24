// script.js (全新輪播版)

document.addEventListener("DOMContentLoaded", function() {
    
    // --- 1. 英雄輪播 (*** 全新重製版：淡入淡出 ***) ---
    const slides = document.querySelectorAll('.hero-carousel .slide');
    const totalSlides = slides.length;
    let currentSlideIndex = 0;

    if (totalSlides > 1) {
        function showNextSlide() {
            // 隱藏目前這張
            slides[currentSlideIndex].classList.remove('active');
            
            // 計算下一張 (索引 + 1，然後取餘數)
            currentSlideIndex = (currentSlideIndex + 1) % totalSlides;
            
            // 顯示下一張
            slides[currentSlideIndex].classList.add('active');
        }

        // 設定計時器，每 5 秒 (5000 毫秒) 執行一次
        setInterval(showNextSlide, 5000);
    }
    // (如果只有一張圖片，它會保持 HTML 上的 .active，不執行 JS)

    // --- 2. 導覽列滾動高亮 (維持不變) ---
    const navLinks = document.querySelectorAll('.site-navigation a');
    // 選擇 main 底下的 section (*** 注意：我們排除了 hero-section ***)
    const sections = document.querySelectorAll('main > .content-section'); 

    function updateActiveNavLink() {
        let currentSectionId = 'home'; // 預設為 home
        const headerOffset = 100; // 偏移量，觸發點提早 100px

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - headerOffset) {
                currentSectionId = section.id;
            }
        });

        // 特別處理 home 區塊 (因為它在頂部)
        if (window.scrollY < sections[0].offsetTop - headerOffset) {
            currentSectionId = 'home';
        }

        navLinks.forEach(link => {
            link.classList.remove('active');
            // 檢查 href 是否包含 ID
            if (link.getAttribute('href').includes(currentSectionId)) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink(); // 初始載入時執行一次

    // --- 3. 區塊進場動畫 (維持不變) ---
    // (*** 注意：我們排除了 hero-section ***)
    const animatedElements = document.querySelectorAll('.content-section'); 

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // 元素出現 10% 時觸發
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        observer.observe(el);
    });
});