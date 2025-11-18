// 叶子飘落效果
function createLeaves() {
    const leavesContainer = document.getElementById('leaves-container');
    // 更多样式的叶子图标
    const leafTypes = ['🍂', '🌿', '🍁', '🍃', '🌾', '🌱']; 
    
    // 清除旧的叶子，防止重复添加
    leavesContainer.innerHTML = '';

    for (let i = 0; i < 20; i++) { // 增加叶子数量
        const leaf = document.createElement('div');
        leaf.className = 'leaf';
        leaf.textContent = leafTypes[Math.floor(Math.random() * leafTypes.length)];
        
        // 随机位置 (0-100vw)
        const leftPos = Math.random() * 100;
        leaf.style.left = `${leftPos}vw`;
        
        // 随机动画参数
        const duration = 15 + Math.random() * 20; // 动画时长更长，飘落更慢
        const delay = Math.random() * 10; // 初始延迟更短
        const size = 0.8 + Math.random() * 1.5; // 叶子尺寸范围
        const rotationStart = Math.random() * 360; // 初始旋转
        const rotationEnd = rotationStart + (Math.random() > 0.5 ? 720 : -720); // 随机方向旋转
        const swayX = (Math.random() - 0.5) * 50; // 水平摆动幅度

        // 绑定 CSS 变量到动画中
        leaf.style.setProperty('--sway-x', `${swayX}px`);
        leaf.style.setProperty('--sway-rotate', `${rotationEnd}deg`);
        leaf.style.setProperty('--scale', `${0.7 + Math.random() * 0.6}`); // 随机缩放

        leaf.style.animation = `fall ${duration}s ease-in-out ${delay}s infinite`; // 使用 ease-in-out 更自然
        leaf.style.fontSize = `${size}rem`;
        leaf.style.opacity = 0.5 + Math.random() * 0.5;
        
        leavesContainer.appendChild(leaf);
    }
}

// 表单提交处理 - 真实场景通常会发送 AJAX 请求
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const form = this;
    const submitButton = form.querySelector('.btn');
    
    submitButton.disabled = true; // 禁用按钮防止重复提交
    submitButton.textContent = '发送中...';

    // 模拟网络请求
    setTimeout(() => {
        alert('感谢您的消息！我会尽快回复您。');
        form.reset(); // 重置表单
        submitButton.disabled = false; // 启用按钮
        submitButton.textContent = '发送消息';
    }, 1500); // 模拟1.5秒延迟
});

// Intersection Observer 实现滚动动画和懒加载
function setupScrollAnimationsAndLazyLoad() {
    const observerOptions = {
        root: null, // 视口作为根
        rootMargin: '0px',
        threshold: 0.1 // 元素10%进入视口即触发
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 处理滚动动画
                if (entry.target.classList.contains('fade-in')) {
                    entry.target.style.opacity = 1;
                    entry.target.style.transform = 'translateY(0)';
                }

                // 处理图片懒加载（avatar）
                if (entry.target.classList.contains('avatar-image') && entry.target.dataset.src) {
                    entry.target.src = entry.target.dataset.src;
                    entry.target.removeAttribute('data-src'); // 加载后移除data-src
                }

                // 处理技能进度条动画
                if (entry.target.classList.contains('skill') && !entry.target.dataset.animated) {
                    const skillLevel = entry.target.querySelector('.skill-level');
                    if (skillLevel) {
                        const width = skillLevel.style.width; // 获取CSS中设置的宽度
                        skillLevel.style.width = '0%'; // 先设置为0
                        // 强制浏览器重绘以确保过渡生效
                        void skillLevel.offsetWidth; 
                        skillLevel.style.width = width; // 再设置回原宽度触发动画
                        entry.target.dataset.animated = 'true'; // 标记已动画
                    }
                }

                // 一旦动画完成或元素加载，可以停止观察
                // observer.unobserve(entry.target); // 如果只需一次动画，则取消观察
            } else {
                // 如果需要重复动画（例如用户来回滚动），可以在这里重置状态
                // if (entry.target.classList.contains('fade-in')) {
                //     entry.target.style.opacity = 0;
                //     entry.target.style.transform = 'translateY(20px)';
                // }
            }
        });
    }, observerOptions);
    
    // 观察所有 fade-in 元素
    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
    
    // 观察头像图片进行懒加载
    const avatarImg = document.querySelector('.avatar-image');
    if (avatarImg && avatarImg.getAttribute('src')) {
        avatarImg.dataset.src = avatarImg.getAttribute('src'); // 将实际src移到data-src
        avatarImg.src = ''; // 清空src，防止立即加载
        observer.observe(avatarImg);
    }
    // 处理头像加载失败
    if (avatarImg) {
        avatarImg.addEventListener('error', () => {
            avatarImg.closest('.profile-img').classList.add('error');
        });
    }

    // 观察技能进度条
    document.querySelectorAll('.skill').forEach(skill => observer.observe(skill));
}


// 平滑滚动导航 & 导航栏活跃状态
function setupSmoothScrollingAndActiveNav() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    navLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // 考虑导航栏高度
                    behavior: 'smooth'
                });

                // 移除所有活跃状态
                navLinks.forEach(link => link.classList.remove('active'));
                // 添加当前点击的活跃状态
                this.classList.add('active');
            }
        });
    });

    // 滚动时更新导航栏活跃状态
    const updateActiveNav = () => {
        let currentActive = null;
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            // 如果 section 顶部进入视口或部分可见
            if (rect.top <= 100 && rect.bottom >= 100) { // 调整100px为导航栏高度+一点偏移
                currentActive = section.id;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentActive}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav(); // 页面加载时也执行一次
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    createLeaves();
    setupScrollAnimationsAndLazyLoad();
    setupSmoothScrollingAndActiveNav();
});

// 可选：如果用户长时间停留页面，刷新叶子位置
// setInterval(createLeaves, 60 * 60 * 1000); // 每小时重新生成一次叶子
