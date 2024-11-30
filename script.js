document.getElementById('user-input').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    const userInput = document.getElementById('user-input');
    const message = userInput.value.trim();
    
    if (message) {
        const chatBox = document.getElementById('chat-box');
        
        // 创建用户消息元素
        const userMessage = document.createElement('div');
        userMessage.className = 'user-message';
        userMessage.textContent = message;
        
        // 将用户消息添加到聊天框
        chatBox.appendChild(userMessage);
        
        // 清空输入框
        userInput.value = '';
        
        // 滚动到最新消息
        chatBox.scrollTop = chatBox.scrollHeight;
        
        // 调用AI接口获取响应
        callAIAPIWithJWT(message).then(aiResponse => {
            const aiMessage = document.createElement('div');
            aiMessage.className = 'ai-message';
            aiMessage.textContent = aiResponse;
            chatBox.appendChild(aiMessage);
            chatBox.scrollTop = chatBox.scrollHeight;
        }).catch(error => {
            console.error('Error calling AI API:', error);
        });
    }
}

window.onload = function() {
    const wordCloudOptions = {
        gridSize: 8,
        weightFactor: 15,
        fontFamily: 'Comic Sans MS, cursive, sans-serif',
        color: function(word, weight) {
            const colors = [
                '#FF1493', // 深粉色
                '#FF4500', // 橙红色
                '#FFD700', // 金色
                '#FF69B4', // 粉红色
                '#00FF00', // 亮绿色
                '#1E90FF', // 道奇蓝
                '#FF00FF', // 洋红色
                '#00FFFF', // 青色
                '#FFA500', // 橙色
                '#9400D3', // 深紫色
                '#32CD32', // 酸橙绿
                '#FF6347', // 番茄色
                '#4169E1', // 皇家蓝
                '#8A2BE2', // 紫罗兰色
                '#FF8C00'  // 深橙色
            ];
            return colors[Math.floor(Math.random() * colors.length)];
        },
        backgroundColor: 'rgba(255, 255, 255, 0)',
        rotateRatio: 0.5,
        rotationSteps: 2,
        shape: 'circle',
        drawOutOfBound: false,
        click: function(item) {
            // 显示对话框并设置内容
            const dialog = document.getElementById('blessing-dialog');
            const blessingText = document.getElementById('blessing-text');
            blessingText.textContent = item[0];
            blessingText.style.color = this.color(item[0], item[1]);
            dialog.style.display = 'flex';

            // 阻止事件冒泡
            event.stopPropagation();
        }
    };

    const words1 = [
        ['我亦神明', 12],
        ['来人间一次', 10],
        ['美丽大方', 8],
        ['快乐无忧', 6],
        ['梦想起航', 5],
        ['青春飞扬', 4],
        ['心怀暖阳', 3],
        ['笑容灿烂', 2],
        ['活力无限', 1],
        ['乐观前行', 1],
        ['诗意生活', 1],
        ['美好时光', 1]
    ];

    const words2 = [
        ['来人间一次', 12],
        ['吃遍大江南北', 10],
        ['标志美丽大方', 8],
        ['追逐梦想', 6],
        ['畅享阳光', 5],
        ['拥抱自由', 4],
        ['心灵欢歌', 3],
        ['笑对风雨', 2],
        ['青春飞扬', 1],
        ['快乐领航', 1],
        ['星辰作伴', 1],
        ['花海漫步', 1]
    ];

    const words3 = [
        ['诗意栖居', 12],
        ['勇气满仓', 10],
        ['友谊之舟', 8],
        ['希望灯塔', 6],
        ['清风拂心', 5],
        ['岁月甜糖', 4],
        ['心怀暖阳', 3],
        ['笑容灿烂', 2],
        ['活力无限', 1],
        ['乐观前行', 1],
        ['诗意生活', 1],
        ['美好时光', 1]
    ];

    WordCloud(document.getElementById('wordcloud-canvas-1'), {
        ...wordCloudOptions,
        list: words1
    });

    WordCloud(document.getElementById('wordcloud-canvas-2'), {
        ...wordCloudOptions,
        list: words2
    });

    WordCloud(document.getElementById('wordcloud-canvas-3'), {
        ...wordCloudOptions,
        list: words3
    });
};

const apiKey = 'a4d395de9928afe4b28a4ed829189ca0.rH8aA2EDvAzeFHYo'; // 更新为新的API Key

function generateJWT(apikey, expSeconds) {
    const [id, secret] = apikey.split('.');
    const header = {
        "alg": "HS256",
        "sign_type": "SIGN"
    };
    const payload = {
        "api_key": id,
        "exp": Math.floor(Date.now() / 1000) + expSeconds,
        "timestamp": Math.floor(Date.now() / 1000)
    };

    return KJUR.jws.JWS.sign("HS256", JSON.stringify(header), JSON.stringify(payload), secret);
}

async function callAIAPIWithJWT(userMessage) {
    const token = generateJWT(apiKey, 3600); // 生成JWT Token，过期时间为3600秒
    const url = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
    
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    const body = JSON.stringify({
        "model": "glm-4",
        "messages": [
            {
                "role": "user",
                "content": userMessage
            }
        ]
    });

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: body
        });

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Error:', error);
        return 'AI服务暂时不可用，请稍后再试。';
    }
}

document.querySelectorAll('audio').forEach((audio, index) => {
    const progress = document.getElementById(`progress${index + 1}`);
    const currentTime = document.getElementById(`current-time${index + 1}`);
    const totalTime = document.getElementById(`total-time${index + 1}`);
    const progressBar = document.getElementById(`progress-bar${index + 1}`);

    audio.addEventListener('timeupdate', () => {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progress.style.width = `${progressPercent}%`;


        const currentMinutes = Math.floor(audio.currentTime / 60);
        const currentSeconds = Math.floor(audio.currentTime % 60);
        currentTime.textContent = `${currentMinutes}:${currentSeconds < 10 ? '0' : ''}${currentSeconds}`;


        const totalMinutes = Math.floor(audio.duration / 60);
        const totalSeconds = Math.floor(audio.duration % 60);
        totalTime.textContent = `${totalMinutes}:${totalSeconds < 10 ? '0' : ''}${totalSeconds}`;
    });


    audio.addEventListener('play', () => {
        document.querySelectorAll('audio').forEach((otherAudio) => {
            if (otherAudio !== audio) {
                otherAudio.pause();
            }
        });
    });


    progressBar.addEventListener('click', (e) => {
        const rect = progressBar.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const newTime = (offsetX / progressBar.offsetWidth) * audio.duration;
        audio.currentTime = newTime;
    });


    audio.addEventListener('loadedmetadata', () => {
        const totalMinutes = Math.floor(audio.duration / 60);
        const totalSeconds = Math.floor(audio.duration % 60);
        totalTime.textContent = `${totalMinutes}:${totalSeconds < 10 ? '0' : ''}${totalSeconds}`;
    });

    audio.loop = true;
});

document.getElementById('view-more').addEventListener('click', function(event) {
    event.preventDefault();

    const qqLink = 'mqqapi://card/show_pslcard?src_type=internal&version=1&uin=977223039';
    const qqInstallLink = 'https://im.qq.com/index/';

    // 更新确认对话框的文本
    const userConfirmed = confirm("是否打开QQ添加其好友？");

    if (userConfirmed) {
        // 检测是否为移动设备
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        if (isMobile) {
            window.location.href = qqLink;
        } else {
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = qqLink;
            document.body.appendChild(iframe);

            setTimeout(() => {
                document.body.removeChild(iframe);
                window.location.href = qqInstallLink;
            }, 2000);
        }
    }
});

document.querySelectorAll('.video-layer').forEach(video => {
    // 确保循环播放
    video.loop = true;
    
    video.addEventListener('click', () => {
        if (video.requestFullscreen) {
            video.requestFullscreen();
        } else if (video.mozRequestFullScreen) {
            video.mozRequestFullScreen();
        } else if (video.webkitRequestFullscreen) {
            video.webkitRequestFullscreen();
        } else if (video.msRequestFullscreen) {
            video.msRequestFullscreen();
        }
    });
});

// 全屏按钮点击事件
document.querySelectorAll('.fullscreen-button').forEach((button, index) => {
    const video = document.querySelectorAll('.video-layer')[index];
    button.addEventListener('click', async () => {
        try {
            // 确保循环播放
            video.loop = true;
            
            // 请求全屏
            if (video.requestFullscreen) {
                await video.requestFullscreen();
            } else if (video.mozRequestFullScreen) {
                await video.mozRequestFullScreen();
            } else if (video.webkitRequestFullscreen) {
                await video.webkitRequestFullscreen();
            } else if (video.msRequestFullscreen) {
                await video.msRequestFullscreen();
            }

            // 开始播放
            try {
                await video.play();
            } catch (playError) {
                console.debug('Autoplay prevented');
            }
        } catch (error) {
            console.debug('Fullscreen or orientation lock not supported');
        }
    });

    // 监听退出全屏事件
    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) {
            video.loop = true; // 保持循环状态
        }
    });
});

// 使用 Intersection Observer 延迟加载资源
document.addEventListener('DOMContentLoaded', function() {
    // 延迟加载图片
    const images = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                }
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // 延迟加载视频
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        video.preload = 'none';
        video.setAttribute('poster', ''); // 设置视频封面
    });
});

// 优化媒体播放
document.querySelectorAll('audio, video').forEach(media => {
    media.preload = 'none';
    media.addEventListener('loadstart', () => {
        media.volume = 1.0;
    });
});

// 使用 requestAnimationFrame 优化动画性能
function optimizeAnimation() {
    requestAnimationFrame(() => {
        // 处理动画相关的代码
        optimizeAnimation();
    });
}
optimizeAnimation();

// 用户系统类
class UserSystem {
    constructor() {
        this.userId = this.generateUserId();
        this.lastVisitDate = null;
        this.lastLikeDate = null;
        this.initializeUser();
    }

    // 初始化用户信息
    initializeUser() {
        // 获取或生成设备指纹
        const deviceInfo = {
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            screenResolution: `${window.screen.width}x${window.screen.height}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            colorDepth: window.screen.colorDepth,
            deviceMemory: navigator.deviceMemory,
            hardwareConcurrency: navigator.hardwareConcurrency
        };

        // 使用设备信息生成唯一标识
        this.deviceFingerprint = this.hashCode(JSON.stringify(deviceInfo));
        
        // 获取IP地址（实际项目中应该由服务器提供）
        this.getIPAddress();
    }

    // 生成用户唯一标识
    generateUserId() {
        let storedId = localStorage.getItem('userId');
        if (!storedId) {
            storedId = 'user_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('userId', storedId);
        }
        return storedId;
    }

    // 获取IP地址
    async getIPAddress() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            this.ipAddress = data.ip;
        } catch (error) {
            console.error('获取IP地址失败:', error);
            this.ipAddress = 'unknown';
        }
    }

    // 生成哈希码
    hashCode(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(36);
    }

    // 获取用户标识信息
    getUserIdentifier() {
        return {
            userId: this.userId,
            deviceFingerprint: this.deviceFingerprint,
            ipAddress: this.ipAddress
        };
    }
}

// 统计系统类
class StatisticsSystem {
    constructor() {
        this.user = new UserSystem();
        this.antiCheat = new AntiCheatSystem();
        this.initializeCounters();
    }

    // 初始化计数器
    initializeCounters() {
        this.totalViews = parseInt(localStorage.getItem('totalViews')) || 20;
        this.totalLikes = parseInt(localStorage.getItem('totalLikes')) || 10;
        
        const userIdentifier = this.user.getUserIdentifier();
        const today = new Date().toISOString().split('T')[0];
        
        this.lastVisitDate = localStorage.getItem(`lastVisit_${userIdentifier.userId}`);
        this.lastLikeDate = localStorage.getItem(`lastLike_${userIdentifier.userId}`);
        
        // 记录访问历史
        this.visitHistory = JSON.parse(localStorage.getItem('visitHistory')) || [];
        this.likeHistory = JSON.parse(localStorage.getItem('likeHistory')) || [];
    }

    // 记录访问
    async recordVisit() {
        const userIdentifier = this.user.getUserIdentifier();
        const today = new Date().toISOString().split('T')[0];
        
        // 检查是否是今天第一次访问
        if (this.lastVisitDate !== today) {
            // 检查防作弊系统
            if (this.antiCheat.checkRequestRate(userIdentifier.userId, 'visit')) {
                this.totalViews++;
                localStorage.setItem('totalViews', this.totalViews.toString());
                localStorage.setItem(`lastVisit_${userIdentifier.userId}`, today);
                this.lastVisitDate = today;
                
                // 记录访问历史
                this.visitHistory.push({
                    userId: userIdentifier.userId,
                    deviceFingerprint: userIdentifier.deviceFingerprint,
                    ipAddress: userIdentifier.ipAddress,
                    timestamp: new Date().toISOString()
                });
                localStorage.setItem('visitHistory', JSON.stringify(this.visitHistory));
            }
        }
        
        return this.totalViews;
    }

    // 处理点赞
    async handleLike() {
        const userIdentifier = this.user.getUserIdentifier();
        const today = new Date().toISOString().split('T')[0];
        
        // 检查是否今天已经点赞
        if (this.lastLikeDate !== today) {
            // 检查防作弊系统
            if (this.antiCheat.checkRequestRate(userIdentifier.userId, 'like')) {
                this.totalLikes++;
                localStorage.setItem('totalLikes', this.totalLikes.toString());
                localStorage.setItem(`lastLike_${userIdentifier.userId}`, today);
                this.lastLikeDate = today;
                
                // 记录点赞历史
                this.likeHistory.push({
                    userId: userIdentifier.userId,
                    deviceFingerprint: userIdentifier.deviceFingerprint,
                    ipAddress: userIdentifier.ipAddress,
                    timestamp: new Date().toISOString()
                });
                localStorage.setItem('likeHistory', JSON.stringify(this.likeHistory));
                
                return true;
            }
        }
        return false;
    }

    // 获取当前统计数据
    getStatistics() {
        const today = new Date().toISOString().split('T')[0];
        return {
            views: this.totalViews,
            likes: this.totalLikes,
            canLikeToday: this.lastLikeDate !== today,
            todayVisited: this.lastVisitDate === today
        };
    }
}

// 防作弊系统类
class AntiCheatSystem {
    constructor() {
        this.requestLog = new Map();
        this.maxRequestsPerMinute = 10;
        this.suspiciousActivities = [];
    }

    // 检查请求频率
    checkRequestRate(userId, actionType) {
        const now = Date.now();
        const key = `${userId}_${actionType}`;
        const userLog = this.requestLog.get(key) || [];
        
        // 清理超过1分钟的旧记录
        const recentLog = userLog.filter(time => now - time < 60000);
        
        // 检查是否超过频率限制
        if (recentLog.length >= this.maxRequestsPerMinute) {
            this.recordSuspiciousActivity(userId, actionType, 'High frequency requests');
            return false;
        }
        
        // 记录新的请求时间
        recentLog.push(now);
        this.requestLog.set(key, recentLog);
        return true;
    }

    // 记录可疑活动
    recordSuspiciousActivity(userId, actionType, reason) {
        const activity = {
            userId,
            actionType,
            reason,
            timestamp: new Date().toISOString()
        };
        this.suspiciousActivities.push(activity);
        
        // 将可疑活动保存到localStorage
        const savedActivities = JSON.parse(localStorage.getItem('suspiciousActivities')) || [];
        savedActivities.push(activity);
        localStorage.setItem('suspiciousActivities', JSON.stringify(savedActivities));
        
        console.warn('Suspicious activity detected:', activity);
    }
}

// 初始化统计功能
function initializeStats() {
    const stats = new StatisticsSystem();
    
    // 记录访问
    stats.recordVisit().then(viewCount => {
        document.getElementById('visit-number').textContent = viewCount;
    });
    
    // 获取当前统计数据
    const currentStats = stats.getStatistics();
    document.getElementById('like-number').textContent = currentStats.likes;
    
    // 点赞按钮事件处理
    const likeButton = document.getElementById('like-button');
    
    // 如果今天已经点赞，添加已点赞样式
    if (!currentStats.canLikeToday) {
        likeButton.classList.add('liked');
    }
    
    likeButton.addEventListener('click', function() {
        if (currentStats.canLikeToday) {
            stats.handleLike().then(success => {
                if (success) {
                    // 点赞成功动画
                    this.classList.add('liking');
                    const newStats = stats.getStatistics();
                    document.getElementById('like-number').textContent = newStats.likes;
                    
                    setTimeout(() => {
                        this.classList.remove('liking');
                        this.classList.add('liked');
                    }, 500);
                    
                    // 显示点赞成功动画
                    const heart = document.createElement('div');
                    heart.className = 'heart-animation';
                    heart.innerHTML = '❤️';
                    this.appendChild(heart);
                    
                    setTimeout(() => {
                        heart.remove();
                    }, 1000);
                    
                    currentStats.canLikeToday = false;
                }
            });
        } else {
            // 显示已点赞提示
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = '您今天已经点赞过啦~';
            this.appendChild(tooltip);
            
            setTimeout(() => {
                tooltip.remove();
            }, 2000);
        }
    });
}

// 页面加载完成后初始化
window.addEventListener('load', initializeStats);

// 更新点击任意处关闭对话框的代码
document.addEventListener('click', function(event) {
    const dialog = document.getElementById('blessing-dialog');
    const dialogContent = document.querySelector('.dialog-content');
    
    // 如果点击的是对话框背景（不是对话框内容）
    if (event.target === dialog) {
        dialog.style.display = 'none';
    }
});

// 词云图点击事件
const wordCloudElements = document.querySelectorAll('.wordcloud canvas');

wordCloudElements.forEach((canvas, index) => {
    canvas.addEventListener('click', function() {
        const words = [
            ['我亦神明', 12],
            ['来人间一次', 10],
            ['美丽大方', 8],
            ['快乐无忧', 6],
            ['梦想起航', 5],
            ['青春飞扬', 4],
            ['心怀暖阳', 3],
            ['笑容灿烂', 2],
            ['活力无限', 1],
            ['乐观前行', 1],
            ['诗意生活', 1],
            ['美好时光', 1]
        ];

        // 获取对应的词云文本
        const blessingText = words[index][0];

        // 随机颜色数组
        const colors = [
            '#FF1493', // 深粉色
            '#FF4500', // 橙红色
            '#FFD700', // 金色
            '#FF69B4', // 粉红色
            '#00FF00', // 亮绿色
            '#1E90FF', // 道奇蓝
            '#FF00FF', // 洋红色
            '#00FFFF', // 青色
            '#FFA500', // 橙色
            '#9400D3', // 深紫色
            '#32CD32', // 酸橙绿
            '#FF6347'  // 番茄色
        ];

        // 随机选择一个颜色
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        // 显示对话框并设置内容
        document.getElementById('blessing-text').textContent = blessingText;
        document.getElementById('blessing-text').style.color = randomColor;
        document.getElementById('blessing-dialog').style.display = 'flex';
    });
});

// 点击任意处关闭对话框
document.addEventListener('click', function(event) {
    const dialog = document.getElementById('blessing-dialog');
    if (dialog.style.display === 'flex' && !event.target.closest('.dialog-content')) {
        dialog.style.display = 'none';
    }
});

// 为每个音频元素添加播放状态监听
document.querySelectorAll('audio').forEach((audio, index) => {
    const musicPlayer = audio.closest('.music-player');
    
    // 播放状态改变时
    audio.addEventListener('play', () => {
        musicPlayer.classList.add('playing');
    });
    
    audio.addEventListener('pause', () => {
        musicPlayer.classList.remove('playing');
    });
    
    audio.addEventListener('ended', () => {
        musicPlayer.classList.remove('playing');
    });
});

// 创建一个函数来停止所有媒体播放
function stopAllMedia(exceptElement = null) {
    // 停止所有音频（除了当前播放的）
    document.querySelectorAll('audio').forEach(audio => {
        if (audio !== exceptElement) {
            audio.pause();
            audio.currentTime = 0; // 重置进度
        }
    });

    // 停止所有视频（除了当前播放的）
    document.querySelectorAll('video').forEach(video => {
        if (video !== exceptElement) {
            video.pause();
            video.currentTime = 0; // 重置进度
        }
    });
}

// 为所有音频添加播放事件监听
document.querySelectorAll('audio').forEach(audio => {
    audio.addEventListener('play', () => {
        stopAllMedia(audio); // 停止其他媒体播放
    });
});

// 为所有视频添加播放事件监听
document.querySelectorAll('video').forEach(video => {
    video.addEventListener('play', () => {
        stopAllMedia(video); // 停止其他媒体播放
    });
});

// 禁止右键菜单
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

// 禁止键盘快捷键
document.addEventListener('keydown', function(e) {
    // 禁止 Ctrl + S
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
    }
    // 禁止 Ctrl + U (查看源代码)
    if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
    }
    // 禁止 F12
    if (e.key === 'F12') {
        e.preventDefault();
    }
});

// 禁止拖拽图片
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('dragstart', function(e) {
        e.preventDefault();
    });
});

// 禁止选择文本
document.addEventListener('selectstart', function(e) {
    e.preventDefault();
});

// 优化音频加载
document.querySelectorAll('audio').forEach(audio => {
    audio.preload = 'none';
    audio.load(); // 仅在需要时加载
});

// 减少动画效果
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reducedMotion) {
    document.body.classList.add('reduce-motion');
}

// 延迟加载词云
let wordCloudLoaded = false;
const loadWordCloud = () => {
    if (!wordCloudLoaded && 'WordCloud' in window) {
        // 词云初始化代码
        wordCloudLoaded = true;
    }
};

// 使用 Intersection Observer 监听词云容器
const wordcloudObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            loadWordCloud();
            wordcloudObserver.disconnect();
        }
    });
});

document.querySelectorAll('.wordcloud').forEach(el => {
    wordcloudObserver.observe(el);
});

// 优化加载提示
window.addEventListener('load', function() {
    const loadingIndicator = document.getElementById('loading-indicator');
    if (loadingIndicator) {
        loadingIndicator.style.opacity = '0';
        setTimeout(() => {
            loadingIndicator.style.display = 'none';
        }, 300);
    }
});

// 检查缓存状态
if ('caches' in window) {
    caches.open('site-static').then(cache => {
        // 缓存静态资源
        const resources = [
            '/images/',
            '/music/',
            '/videos/'
        ];
        cache.addAll(resources);
    });
}

// 使用事件委托
document.addEventListener('click', function(e) {
    // 处理点击事件
    if (e.target.matches('.like-button')) {
        // 处理点赞
    } else if (e.target.matches('.fullscreen-button')) {
        // 处理全屏
    }
});
  