// script.js

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
    // (*** 修改 ***) 區塊選擇器現在更通用，以支援 gallery 頁面
    const sections = document.querySelectorAll('main > section[id]'); 

    function updateActiveNavLink() {
        let currentSectionId = 'home'; // 預設為 home
        const headerOffset = 100; // 偏移量，觸發點提早 100px

        if (sections.length > 0) {
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (window.scrollY >= sectionTop - headerOffset) {
                    currentSectionId = section.id;
                }
            });

            if (window.scrollY < sections[0].offsetTop - headerOffset) {
                currentSectionId = 'home';
            }
        }
        
        // (*** 修改 ***) 檢查連結的 href 是否 *包含* ID
        // 這樣 index.html#restoration 和 gallery.html 上的 .active 都能正確反白
        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkHref = link.getAttribute('href');
            
            if (document.body.classList.contains('gallery-page')) {
                // (*** 關鍵修改 ***)
                // 在 Gallery 頁面，高亮 "整理紀實"
                if (linkHref.includes('gallery.html')) {
                    link.classList.add('active');
                }
            } else {
                // 在首頁，正常高亮
                if (linkHref.includes(currentSectionId)) {
                    link.classList.add('active');
                }
            }
        });
    }

    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink(); // 初始載入時執行一次

    // --- 3. 區塊進場動畫 (維持不變) ---
    // (*** 修改 ***) 區塊選擇器現在更通用
    const animatedElements = document.querySelectorAll('.content-section, .case-selector, .case-viewer'); 

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
    
    
    // --- 5. (*** 新增 ***) Gallery 頁面互動 ---
    
    // 檢查是否在 Gallery 頁面 (透過偵測特定 ID)
    const caseViewer = document.getElementById('case-viewer-target');
    if (caseViewer) {
        
        // --- (A) 案件資料庫 (*** 關鍵修改 ***) ---
        // (我們加入 isPlaceholder 標記)
        const caseData = {
            'case-1': {
                title: '物件一：台灣檜木方桌',
                images: ['img/a1.jpg', 'img/a2.jpg', 'img/a3.jpg', 'img/a4.jpg', 'img/a5.jpg', 'img/a6.jpg', 'img/a7.jpg', 'img/a8.jpg'],
                description: '這組經典的檜木方桌，經過除漆、修補、上護木漆後，重現了溫潤的木質光澤。',
                isPlaceholder: false // 這是有內容的案件
            },
            'case-2': {
                title: '物件二：(待補充)',
                isPlaceholder: true // 這是佔位符
            },
            'case-3': {
                title: '物件三：(待補充)',
                isPlaceholder: true // 這是佔位符
            },
            'case-4': {
                title: '物件四：(待補充)',
                isPlaceholder: true // 這是佔位符
            }
        };

        // --- (B) 獲取 DOM 元素 ---
        const caseCards = document.querySelectorAll('.case-card');
        const placeholder = document.getElementById('case-viewer-placeholder');
        const contentArea = document.getElementById('case-content-area');
        
        const caseImage = document.getElementById('case-image');
        const caseTitle = document.getElementById('case-title');
        const caseDescription = document.getElementById('case-description');
        const caseCounter = document.getElementById('case-counter');
        const prevBtn = document.getElementById('case-prev');
        const nextBtn = document.getElementById('case-next');

        let currentCaseImages = [];
        let currentImageIndex = 0;

        // --- (C) 核心功能：顯示案件 (*** 關鍵修改 ***) ---
        function showCase(caseId) {
            // 1. 獲取案件資料
            const data = caseData[caseId];
            if (!data) return;

            // 2. 更新預覽卡片高亮 (*** 步驟提前 ***)
            caseCards.forEach(card => {
                card.classList.remove('active');
                if (card.dataset.case === caseId) {
                    card.classList.add('active');
                }
            });

            // 3. (*** 關鍵 ***) 檢查是否為佔位符
            if (data.isPlaceholder) {
                // 是佔位符：顯示提示訊息
                if (contentArea) contentArea.style.display = 'none'; // 隱藏輪播
                if (placeholder) {
                    placeholder.style.display = 'block'; // 顯示提示區
                    // (*** 新增 ***) 更新提示文字
                    placeholder.querySelector('h3').textContent = '案件詳情 ' + data.title;
                    placeholder.querySelector('p').textContent = '即將推出，敬請期待...';
                }
            } else {
                // 不是佔位符：顯示輪播
                if (placeholder) placeholder.style.display = 'none'; // 隱藏提示
                if (contentArea) {
                    // 顯示輪播
                    if (window.matchMedia("(min-width: 769px)").matches) {
                        contentArea.style.display = 'grid';
                    } else {
                        contentArea.style.display = 'block';
                    }
                }

                // 4. 更新輪播狀態
                currentCaseImages = data.images;
                currentImageIndex = 0;

                // 5. 填入內容
                caseTitle.textContent = data.title;
                caseDescription.textContent = data.description;
                updateCarousel();
            }

            // 6. (關鍵) 自動滾動到輪播區
            // (我們只在手機版 RWD 斷點下觸發滾動)
            if (window.matchMedia("(max-width: 768px)").matches) {
                caseViewer.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
        
        // --- (D) 核心功能：更新輪播畫面 ---
        function updateCarousel() {
            caseImage.src = currentCaseImages[currentImageIndex];
            caseCounter.textContent = `${currentImageIndex + 1} / ${currentCaseImages.length}`;
            
            // 處理按鈕禁用
            prevBtn.disabled = (currentImageIndex === 0);
            nextBtn.disabled = (currentImageIndex === currentCaseImages.length - 1);
        }

        // --- (E) 綁定事件 ---

        // 1. 綁定所有預覽卡片
        caseCards.forEach(card => {
            card.addEventListener('click', () => {
                showCase(card.dataset.case);
            });
            // 增加鍵盤可訪問性
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    showCase(card.dataset.case);
                }
            });
        });

        // 2. 綁定輪播按鈕
        prevBtn.addEventListener('click', () => {
            if (currentImageIndex > 0) {
                currentImageIndex--;
                updateCarousel();
            }
        });

        nextBtn.addEventListener('click', () => {
            if (currentImageIndex < currentCaseImages.length - 1) {
                currentImageIndex++;
                updateCarousel();
            }
        });
        
        // (*** 新增 ***) 首次載入時，預設顯示案件一
        // (因為案件一 isPlaceholder: false, 所以會正常顯示輪播)
        showCase('case-1');
    }
    
});
