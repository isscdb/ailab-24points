// 祝贺动效实现

// 显示祝贺动效
function showCongratulationEffect() {
    // 创建祝贺动效容器
    const congratsContainer = document.createElement('div');
    congratsContainer.className = 'congrats-container';
    document.body.appendChild(congratsContainer);
    
    // 创建烟花效果
    createFireworks(congratsContainer);
    
    // 创建彩带效果
    createConfetti(congratsContainer);
    
    // 创建祝贺文字
    const congratsText = document.createElement('div');
    congratsText.className = 'congrats-text animate-pulse';
    congratsText.innerHTML = '<i>太棒了👍</i>';
    congratsContainer.appendChild(congratsText);
    
    // 3秒后移除动效
    setTimeout(() => {
        document.body.removeChild(congratsContainer);
    }, 3000);
}

// 创建烟花效果
function createFireworks(container) {
    const colors = ['#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff', '#ff9900', '#9900ff'];
    
    // 创建多个烟花
    for (let i = 0; i < 40; i++) {
        setTimeout(() => {
            const firework = document.createElement('div');
            firework.className = 'firework';
            
            // 随机位置
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            
            // 随机颜色
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            // 随机大小
            const size = 5 + Math.random() * 15;
            
            // 设置样式
            firework.style.left = `${left}%`;
            firework.style.top = `${top}%`;
            firework.style.backgroundColor = color;
            firework.style.width = `${size}px`;
            firework.style.height = `${size}px`;
            firework.style.boxShadow = `0 0 ${size/2}px ${color}`;
            
            // 添加到容器
            container.appendChild(firework);
            
            // 动画结束后移除
            firework.addEventListener('animationend', () => {
                container.removeChild(firework);
            });
        }, i * 40); // 错开时间，产生连续效果
    }
}

// 创建彩带效果
function createConfetti(container) {
    const colors = ['#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff', '#ff9900'];
    
    // 创建多个彩带
    for (let i = 0; i < 60; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            
            // 随机位置（从顶部开始）
            const left = Math.random() * 100;
            
            // 随机颜色
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            // 随机旋转
            const rotation = Math.random() * 360;
            
            // 随机大小
            const size = 5 + Math.random() * 10;
            
            // 设置样式
            confetti.style.left = `${left}%`;
            confetti.style.top = '-5%';
            confetti.style.backgroundColor = color;
            confetti.style.width = `${size}px`;
            confetti.style.height = `${size * 0.4}px`;
            confetti.style.transform = `rotate(${rotation}deg)`;
            
            // 添加到容器
            container.appendChild(confetti);
            
            // 动画结束后移除
            confetti.addEventListener('animationend', () => {
                container.removeChild(confetti);
            });
        }, i * 30); // 错开时间，产生连续效果
    }
}