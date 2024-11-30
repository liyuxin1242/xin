document.getElementById('user-input').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

async function sendMessage() {
    const userInput = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');
    
    if (userInput.value.trim() !== '') {
        const userMessage = document.createElement('div');
        userMessage.className = 'user-message';
        userMessage.textContent = `我: ${userInput.value}`;
        chatBox.appendChild(userMessage);

        const response = await callAIAPI(userInput.value);
        
        const aiMessage = document.createElement('div');
        aiMessage.className = 'ai-message';
        aiMessage.textContent = `小昕: ${response}`;
        chatBox.appendChild(aiMessage);

        userInput.value = '';
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}

async function callAIAPI(userMessage) {
    const apiKey = '837bab95a78ef547954fc78bdefb4cac.YnCclkZBZdiKJxlI';
    const useJWT = false;
    const url = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
    
    let headers = {
        'Content-Type': 'application/json'
    };

    if (useJWT) {
        const token = generateJWT(apiKey, 3600);
        headers['Authorization'] = `Bearer ${token}`;
    } else {
        headers['Authorization'] = `Bearer ${apiKey}`;
    }

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

window.onload = function() {
    const words = [
        ['全塞嘴里了', 12],
        ['七分烟火三分诗意', 10],
        ['神明亦是我', 8],
        ['来人间一趟', 6],
        ['朴实清淡', 5],
        ['吃遍山珍海味', 4]
    ];

    WordCloud(document.getElementById('wordcloud-canvas'), {
        list: words,
        gridSize: 8,
        weightFactor: 15,
        fontFamily: 'Times, serif',
        color: function() {
            const colors = ['#ff0000', '#ff69b4', '#ff4500', '#ff6347', '#ff7f50'];
            return colors[Math.floor(Math.random() * colors.length)];
        },
        backgroundColor: 'rgba(255, 255, 255, 0)',
        rotateRatio: 0.5,
        rotationSteps: 2,
        shape: 'circle'
    });

    const chatBox = document.getElementById('chat-box');
    const fullscreenButton = document.getElementById('toggle-fullscreen');

    fullscreenButton.addEventListener('click', function() {
        if (chatBox.style.height === '150px') {
            chatBox.style.height = '300px';
        } else {
            chatBox.style.height = '150px';
        }
    });
};

// 初始化时显示第一个对话框
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('chat-box').style.display = 'flex';
    document.getElementById('doubao-chat-box').style.display = 'none';
});