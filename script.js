document.addEventListener("DOMContentLoaded", function() {
    
    // --- 1. 導覽列 (漢堡選單) ---
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if(navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('show');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('show');
        });
    });

    // --- 2. 滾動偵測 (Scroll Spy) & Navbar 背景 ---
    const sections = document.querySelectorAll('section[id]');
    
    function scrollActive() {
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100;
            const sectionId = current.getAttribute('id');
            const targetLink = document.querySelector('.nav-menu a[href*=' + sectionId + ']');

            if (targetLink) {
                if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight){
                    targetLink.classList.add('active-link');
                } else {
                    targetLink.classList.remove('active-link');
                }
            }
        });
    }
    window.addEventListener('scroll', scrollActive);


    // --- 3. Gallery Modal 資料庫與邏輯 ---
    const casesData = {
        'case-1': {
            title: '檜木方桌 - 溫潤重現',
            description: `<p>這組經典的檜木方桌，我們採用除漆工法，保留了老木頭經歷歲月留下的自然痕跡。</p>
                          <p><strong>修復重點：</strong></p>
                          <ul>
                            <li>手工細緻除漆，不傷木質</li>
                            <li>結構補強、桌面開縫拼接</li>
                            <li>使用護木漆塗裝</li>
                          </ul>`,
            images: ['img/a1.jpg', 'img/a2.jpg', 'img/a3.jpg', 'img/a4.jpg', 'img/a5.jpg', 'img/a6.jpg', 'img/a7.jpg', 'img/a8.jpg']
        }
    };

    const modal = document.getElementById('project-modal');
    const modalClose = document.getElementById('modal-close');
    const modalBackdrop = document.querySelector('.modal-backdrop');
    
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalMainImg = document.getElementById('modal-main-img');
    const modalThumbs = document.getElementById('modal-thumbs');

    document.querySelectorAll('.gallery-item[data-id]').forEach(item => {
        item.addEventListener('click', () => {
            const caseId = item.getAttribute('data-id');
            const data = casesData[caseId];
            
            if(data) {
                modalTitle.textContent = data.title;
                modalDesc.innerHTML = data.description;
                modalMainImg.src = data.images[0];
                modalThumbs.innerHTML = '';
                
                data.images.forEach((imgSrc, index) => {
                    const thumb = document.createElement('img');
                    thumb.src = imgSrc;
                    if(index === 0) thumb.classList.add('active');
                    
                    thumb.addEventListener('click', () => {
                        modalMainImg.src = imgSrc;
                        document.querySelectorAll('.thumb-list img').forEach(img => img.classList.remove('active'));
                        thumb.classList.add('active');
                    });
                    
                    modalThumbs.appendChild(thumb);
                });

                modal.classList.add('active');
                document.body.style.overflow = 'hidden'; 
            }
        });
    });

    function closeModal() {
        if(modal) modal.classList.remove('active');
        document.body.style.overflow = ''; 
    }

    if(modalClose) modalClose.addEventListener('click', closeModal);
    if(modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

    // --- 4. 匯款資訊摺疊功能 ---
    const bankAccordion = document.getElementById('bank-accordion');
    const bankHeader = document.querySelector('.bank-header');

    if (bankAccordion && bankHeader) {
        bankHeader.addEventListener('click', () => {
            bankAccordion.classList.toggle('active');
        });
    }

    // --- 5. 特殊物件輪播 (Spotlight Carousel) - 含觸控修正 ---
    const track = document.getElementById('spotlight-track');
    const nextButton = document.getElementById('spotlight-next');
    const prevButton = document.getElementById('spotlight-prev');
    const progressBar = document.getElementById('spotlight-bar');
    
    if(track && track.children.length > 0) {
        const cards = Array.from(track.children);
        let currentIndex = 0; 
        
        // 初始讓第二張置中 (如果有夠多張)
        if(cards.length >= 3) { currentIndex = 1; }

        function updateCarousel() {
            if(cards.length === 0) return;

            // [修正重點] 改用 offsetWidth，抓取卡片「未縮放前」的真實寬度
            // 這樣計算滑動距離才會準確，不會因為 CSS 的 scale 效果產生誤差
            const cardWidth = cards[0].offsetWidth; 
            
            const container = document.querySelector('.spotlight-track-container');
            
            // 這裡也要改用 offsetWidth 比較保險，雖然 container 通常沒縮放
            const trackWidth = container.offsetWidth; 
            
            const gap = 20; // CSS gap: 20px
            
            // 計算置中偏移：(容器寬 - 卡片寬) / 2
            const centerOffset = (trackWidth - cardWidth) / 2;
            
            // 目標位置：(卡片寬 + 間距) * 第幾張
            const targetPos = (cardWidth + gap) * currentIndex;
            
            // 最終移動距離 = -(目標位置 - 置中偏移)
            const finalTranslate = -(targetPos - centerOffset);

            track.style.transform = `translateX(${finalTranslate}px)`;

            // 更新 Active 樣式 (聚光燈效果)
            cards.forEach((card, index) => {
                if (index === currentIndex) {
                    card.classList.add('active');
                } else {
                    card.classList.remove('active');
                }
            });

            // 更新進度條 (如果有保留的話)
            if(progressBar) {
                const progress = ((currentIndex + 1) / cards.length) * 100;
                progressBar.style.width = `${progress}%`;
            }
            
            // 更新按鈕透明度
            if(prevButton) prevButton.style.opacity = currentIndex === 0 ? '0.3' : '1';
            if(nextButton) nextButton.style.opacity = currentIndex === cards.length - 1 ? '0.3' : '1';
        }

        // --- 按鈕事件 ---
        if(nextButton) {
            nextButton.addEventListener('click', () => {
                if (currentIndex < cards.length - 1) {
                    currentIndex++;
                    updateCarousel();
                }
            });
        }

        if(prevButton) {
            prevButton.addEventListener('click', () => {
                if (currentIndex > 0) {
                    currentIndex--;
                    updateCarousel();
                }
            });
        }

        // --- [新增] 手機觸控滑動支援 (Touch Swipe) ---
        let touchStartX = 0;
        let touchEndX = 0;
        const minSwipeDistance = 50; // 滑動超過 50px 才切換

        track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, {passive: true});

        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, {passive: true});

        function handleSwipe() {
            const distance = touchEndX - touchStartX;
            
            if (Math.abs(distance) > minSwipeDistance) {
                if (distance < 0) {
                    // 向左滑 (下一張)
                    if (currentIndex < cards.length - 1) {
                        currentIndex++;
                        updateCarousel();
                    }
                } else {
                    // 向右滑 (上一張)
                    if (currentIndex > 0) {
                        currentIndex--;
                        updateCarousel();
                    }
                }
            }
        }

        // --- 初始化與修正 ---
        // 1. 立即執行一次
        updateCarousel();
        
        // 2. 圖片載入完成後再執行一次 (修正寬度計算錯誤導致的切邊問題)
        window.addEventListener('load', updateCarousel);
        
        // 3. 視窗大小改變時執行
        window.addEventListener('resize', updateCarousel);
    }
});
