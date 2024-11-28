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
            const colors = ['#ff69b4', '#ff4500', '#ffd700', '#ff6347', '#ffa07a'];
            return colors[Math.floor(Math.random() * colors.length)];
        },
        backgroundColor: 'rgba(255, 255, 255, 0)',
        rotateRatio: 0.5,
        rotationSteps: 2,
        shape: 'circle',
        drawOutOfBound: false,
        click: function(item) {
            alert(item[0] + ': ' + item[1]);
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
});

document.getElementById('view-more').addEventListener('click', function(event) {
    event.preventDefault();

    const qqLink = 'mqqapi://card/show_pslcard?src_type=internal&version=1&uin=977223039'; // 使用正确的QQ协议链接
    const qqInstallLink = 'https://im.qq.com/index/';

    // 提示用户是否打开QQ
    const userConfirmed = confirm("是否打开QQ软件并展示QQ号为977223039的名片？");

    if (userConfirmed) {
        // 检测是否为移动设备
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        if (isMobile) {
            // 在移动设备上，尝试打开QQ客户端
            window.location.href = qqLink;
        } else {
            // 在非移动设备上，使用iframe尝试打开QQ客户端
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = qqLink;
            document.body.appendChild(iframe);

            // 设置一个定时器，如果在一定时间内没有成功打开QQ，则跳��装页面
            setTimeout(() => {
                document.body.removeChild(iframe);
                window.location.href = qqInstallLink;
            }, 2000); // 2秒后跳转到安装页面
        }
    }
});

document.querySelectorAll('.video-layer').forEach(video => {
    video.addEventListener('click', () => {
        if (video.requestFullscreen) {
            video.requestFullscreen();
        } else if (video.mozRequestFullScreen) { // Firefox
            video.mozRequestFullScreen();
        } else if (video.webkitRequestFullscreen) { // Chrome, Safari and Opera
            video.webkitRequestFullscreen();
        } else if (video.msRequestFullscreen) { // IE/Edge
            video.msRequestFullscreen();
        }
    });
});

document.querySelectorAll('.fullscreen-button').forEach((button, index) => {
    const video = document.querySelectorAll('.video-layer')[index];
    button.addEventListener('click', async () => {
        try {
            if (video.requestFullscreen) {
                await video.requestFullscreen();
            } else if (video.mozRequestFullScreen) { // Firefox
                await video.mozRequestFullScreen();
            } else if (video.webkitRequestFullscreen) { // Chrome, Safari and Opera
                await video.webkitRequestFullscreen();
            } else if (video.msRequestFullscreen) { // IE/Edge
                await video.msRequestFullscreen();
            }

            // 只在支持屏幕方向锁定的设备上尝试锁定
            if (screen.orientation && screen.orientation.lock && screen.orientation.type) {
                try {
                    await screen.orientation.lock('landscape');
                } catch (orientationError) {
                    // 静默处理方向锁定错误
                    console.debug('Orientation lock not supported on this device');
                }
            }
        } catch (error) {
            console.debug('Fullscreen or orientation lock not supported');
        }
    });
});
  