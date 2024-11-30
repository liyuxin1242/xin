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
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                observer.unobserve(img);
            }
        });
    });

    // 延迟加载视频
    const videoObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const video = entry.target;
                video.src = video.dataset.src;
                observer.unobserve(video);
            }
        });
    });

    // 优化词云加载
    setTimeout(() => {
        // 词云初始化代码
    }, 1000);
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

// 访问统计和点赞功能
function initializeStats() {
    // 获取当前日期
    const today = new Date().toLocaleDateString();
    const lastVisitDate = localStorage.getItem('lastVisitDate');
    
    // 获取存储的访问次数，初始值设为20
    let visitCount = parseInt(localStorage.getItem('visitCount')) || 20;
    
    // 获取存储的点赞数，初始值设为10
    let likeCount = parseInt(localStorage.getItem('likeCount')) || 10;
    
    // 检查是否是今天第一次访问
    if (lastVisitDate !== today) {
        // 增加访问次数
        visitCount += 1;
        localStorage.setItem('visitCount', visitCount);
        
        // 每天第一次访问时增加点赞次数
        likeCount += 1;
        localStorage.setItem('likeCount', likeCount);
        
        // 重置点赞状态，允许今天点赞
        localStorage.removeItem('hasLiked');
        localStorage.removeItem('lastLikeDate');
        
        // 更新最后访问日期
        localStorage.setItem('lastVisitDate', today);
    }
    
    // 更新显示
    document.getElementById('visit-number').textContent = visitCount;
    document.getElementById('like-number').textContent = likeCount;
    
    // 检查是否已经点赞
    const lastLikeDate = localStorage.getItem('lastLikeDate');
    const hasLiked = lastLikeDate === today;
    const likeButton = document.getElementById('like-button');
    
    if (hasLiked) {
        likeButton.classList.add('liked');
    }
    
    // 点赞按钮事件
    likeButton.addEventListener('click', function() {
        const currentDate = new Date().toLocaleDateString();
        if (!hasLiked && lastLikeDate !== currentDate) {
            // 点赞动画效果
            this.classList.add('liking');
            
            // 更新点赞数
            likeCount += 1;
            localStorage.setItem('likeCount', likeCount);
            document.getElementById('like-number').textContent = likeCount;
            
            // 记录点赞日期
            localStorage.setItem('lastLikeDate', currentDate);
            
            // 添加点赞后的样式
            setTimeout(() => {
                this.classList.remove('liking');
                this.classList.add('liked');
            }, 500);
            
            // 显示点赞成功提示
            const heart = document.createElement('div');
            heart.className = 'heart-animation';
            heart.innerHTML = '❤️';
            this.appendChild(heart);
            
            setTimeout(() => {
                heart.remove();
            }, 1000);
        } else {
            // 提示已经点赞
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

// 在页面加载完成后初始化统计功能
window.addEventListener('load', function() {
    document.getElementById('loading-indicator').style.display = 'none';
    initializeStats();
});

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
  