// 音效管理模块

// 音效对象
const sounds = {
    success: new Audio('./sounds/success.wav'),
    error: new Audio('./sounds/error.wav')
};

// 预加载所有音效
function preloadSounds() {
    // 设置音量
    sounds.success.volume = 0.5;
    sounds.error.volume = 0.5;
    
    // 预加载
    Object.values(sounds).forEach(sound => {
        sound.load();
    });
}

// 播放成功音效
function playSuccessSound() {
    sounds.success.currentTime = 0;
    sounds.success.play().catch(error => {
        console.log('播放音效失败:', error);
    });
}

// 播放错误音效
function playErrorSound() {
    sounds.error.currentTime = 0;
    sounds.error.play().catch(error => {
        console.log('播放音效失败:', error);
    });
}

// 页面加载完成后预加载音效
document.addEventListener('DOMContentLoaded', preloadSounds);