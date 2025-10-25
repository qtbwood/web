// script.js (修正版：移除所有 .style 操作)

document.addEventListener("DOMContentLoaded", function() {
    
    // --- 1. 英雄輪播 (淡入淡出 + 分段指示器) ---
    const slides = document.querySelectorAll('.hero-carousel .slide');
    const dots = document.querySelectorAll('.carousel-pagination .dot'); 
    const totalSlides = slides.length;
    let currentSlideIndex = 0;
    const slideInterval = 5000; // 統一管理時間 (5秒)
    
    let slideTimer; // 用於儲存 setInterval，以便清除

    if (totalSlides > 1 && dots.length === totalSlides) {
        
        /**
         * 核心函數：跳轉到指定的幻灯片
         * @param {number} newIndex 要跳轉到的索引
         */
        function goToSlide(newIndex) {
            // 1. 清除舊的計時器
            clearInterval(slideTimer);

            // 2. 獲取舊的索引
            const oldIndex = currentSlideIndex;

            // --- 3. RESET OLD DOT & SLIDE ---
            // 我們只移除 CSS 類別。
            // style.css 會自動處理：移除 .is-filling 會導致 .dot-fill 瞬間變回 width: 0%
            if (dots[oldIndex]) {
                dots[oldIndex].classList.remove('active', 'is-filling');
            }
            if (slides[oldIndex]) {
                slides[oldIndex].classList.remove('active');
            }

            // 5. 設定新的索引
            currentSlideIndex = newIndex;

            // 6. 啟用新的 slide
            if (slides[currentSlideIndex]) {
                slides[currentSlideIndex].classList.add('active');
            }

            // --- 7. START NEW DOT ---
            if (dots[currentSlideIndex]) {
                // (A) 加上 .active 顯示白底
                dots[currentSlideIndex].classList.add('active');

                // (B) *** 關鍵修正 ***
                // 我們必須強制瀏覽器「重繪」(reflow)
                // 讓它先"看到" width: 0% 的狀態
                void dots[currentSlideIndex].offsetWidth; 

                // (C) 然後才加上 .is-filling 類別
                // 瀏覽器才會偵測到 0% -> 100% 的變化，並播放 CSS 中定義的動畫
                dots[currentSlideIndex].classList.add('is-filling');
            }
            
            // 8. 重啟自動播放計時器
            slideTimer = setInterval(showNextSlide, slideInterval);
        }

        /**
         * 自動播放下一張
         */
        function showNextSlide() {
            const nextIndex = (currentSlideIndex + 1) % totalSlides;
            goToSlide(nextIndex);
        }

        // --- 為 .dot 加上點擊事件 ---
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                // 如果點擊的不是當前這張，才執行
                if (index !== currentSlideIndex) {
                    goToSlide(index);
                }
            });
        });
        
        // --- 啟動輪播 ---
        // 1. 首次啟動計時器
        slideTimer = setInterval(showNextSlide, slideInterval);
        // 2. 首次啟動第一個點的動畫 (也需要 reflow 技巧)
        void dots[0].offsetWidth;
        dots[0].classList.add('is-filling');
    }
    

    // --- 2. 導覽列滾動高亮 (維持不變) ---
    const navLinks = document.querySelectorAll('.site-navigation a');
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

        if (window.scrollY < sections[0].offsetTop - headerOffset) {
            currentSectionId = 'home';
        }

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(currentSectionId)) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink(); // 初始載入時執行一次

    // --- 3. 區塊進場動畫 (維持不變) ---
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

    // --- 4. (*** 新增 ***) 漢堡選單功能 ---
    const navMenu = document.getElementById('mobile-nav');
    const openBtn = document.getElementById('nav-open-btn');
    const closeBtn = document.getElementById('nav-close-btn');
    const overlay = document.getElementById('menu-overlay');
    const navLinksInMenu = document.querySelectorAll('#mobile-nav ul a');

    if (navMenu && openBtn && closeBtn && overlay) {
        
        // (A) 功能：開啟選單
        function openMenu() {
            navMenu.classList.add('is-open');
            overlay.classList.add('is-open');
        }

        // (B) 功能：關閉選單
        function closeMenu() {
            navMenu.classList.remove('is-open');
            overlay.classList.remove('is-open');
        }

        // (C) 綁定事件
        openBtn.addEventListener('click', openMenu);  // 點漢堡圖示，開啟
        closeBtn.addEventListener('click', closeMenu); // 點 "X"，關閉
        overlay.addEventListener('click', closeMenu);  // 點遮罩，關閉

        // (D) (關鍵！) 點擊選單中的連結時，也要關閉選單
        navLinksInMenu.forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }
});
