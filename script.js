// script.js (混合版)

document.addEventListener("DOMContentLoaded", function() {
    
    // --- 1. 英雄輪播 (*** 使用您原版的 3D 邏輯 ***) ---
    const layers = document.querySelectorAll('.hero-collage .image-layer');
    const totalLayers = layers.length;
    
    if (totalLayers >= 3) {
        let currentIndex = 0; // 目前顯示在最前面的圖片索引

        function updateCarousel() {
            // 1. 計算 '上一個' 和 '下一個' 的索引
            const prevIndex = (currentIndex - 1 + totalLayers) % totalLayers;
            const nextIndex = (currentIndex + 1) % totalLayers;

            // 2. 移除所有圖層上的所有角色
            layers.forEach(layer => {
                layer.classList.remove('active', 'prev', 'next');
            });

            // 3. 根據計算好的索引，重新賦予角色
            layers[prevIndex].classList.add('prev');
            layers[currentIndex].classList.add('active');
            layers[nextIndex].classList.add('next');

            // 4. 更新下一次的索引 (準備下一次輪播)
            currentIndex = (currentIndex + 1) % totalLayers;
        }

        // 1. 立即執行一次，設定初始狀態
        updateCarousel();

        // 2. 設定計時器，每 5 秒 (5000 毫秒) 執行一次
        setInterval(updateCarousel, 5000);
    
    } else if (totalLayers > 0) {
        // 如果圖層少於 3 個，這個動畫沒意義，只顯示第一張
        layers[0].classList.add('active');
    }

    // --- 2. 導覽列滾動高亮 (保留我的邏輯) ---
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

    // --- 3. 區塊進場動畫 (保留我的邏輯) ---
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
