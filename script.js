// script.js (流暢動畫版)

document.addEventListener("DOMContentLoaded", function() {
    
    // 獲取所有圖片圖層
    const layers = document.querySelectorAll('.hero-collage .image-layer');
    const totalLayers = layers.length;
    
    // 如果圖層少於 3 個，這個動畫沒意義，停止執行
    if (totalLayers < 3) {
        if(totalLayers > 0) layers[0].classList.add('active'); // 只顯示第一張
        return;
    }

    let currentIndex = 0; // 目前顯示在最前面的圖片索引

    /**
     * 更新輪播的函數
     * 核心邏輯：為三張圖片分配 'prev', 'active', 'next' 的角色
     */
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

});