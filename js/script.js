// 叶子飘落效果
function createLeaves() {
    const leavesContainer = document.getElementById('leaves-container');
    const leafTypes = ['🍂', '🌿', '🍁', '🥬'];
    
    for (let i = 0; i < 15; i++) {
        const leaf = document.createElement('div');
        leaf.className = 'leaf';
        leaf.textContent = leafTypes[Math.floor(Math.random() * leafTypes.length)];
        
        // 随机位置
        const leftPos = Math.random() * 100;
        leaf.style.left = `${leftPos}vw`;
        
        // 随机动画参数
        const duration = 10 + Math.random() * 20;
        const delay = Math.random() * 20;
        const size = 0.5 + Math.random() * 1;
        
        leaf.style.animation = `fall ${duration}s linear ${delay}s infinite`;
        leaf.style.fontSize = `${size}rem`;
        leaf.style.opacity = 0.5 + Math.random() * 0.5;
        
        leavesContainer.appendChild(leaf);
    }
}

// 表单提交处理
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('感谢您的消息！我会尽快回复您。');
    this.reset();
});

// 滚动动画
function setupScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    fadeElements.forEach(el => {
        el.style.opacity = 0;
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.8s, transform 0.8s';
        observer.observe(el);
    });
}

// 平滑滚动导航
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    createLeaves();
    setupScrollAnimations();
    setupSmoothScrolling();
});
