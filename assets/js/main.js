
const API_KEY = "Your API Key";

const chatInput = document.getElementById('input-field');
const sendChatBtn = document.querySelector(".chat__input span");
const chatBox = document.getElementById('chat-box');

let userMessage;

const inputInitHeight = chatInput.scrollHeight;

function generateResponse(userMessage, liTag) {
    const API_URL = "https://api.openai.com/v1/chat/completions";

    const messageElment = liTag.querySelector('p');

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-4o",
            messages: [
                {
                  "role": "system",
                  "content": "You are a helpful assistant."
                },
                {
                  "role": "user",
                  "content": userMessage
                }
              ],
            temperature: 0.7,
        }),

    }

    // Send POST request to API, get the response
    fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
        console.log(data);
        messageElment.textContent = data.choices[0].message.content;
    }).catch((error) => {
        messageElment.classList.add("error__chatbot");
        messageElment.textContent = "Oops! Something went wrong. Please try again.";
    }).finally(() => chatBox.scrollTo(0, chatBox.scrollHeight));
}


function createChatLi(userMessage){
    const liTag = document.createElement('li');
    liTag.classList.add('chat', 'outgoing');

    let chatContent = `<p></p>`;
    liTag.innerHTML = chatContent;
    liTag.querySelector('p').textContent = userMessage;

    chatBox.appendChild(liTag);
    chatBox.scrollTo(0, chatBox.scrollHeight);
}

function creatChatbotThink(userMessage){

    setTimeout(()=>{
        const liTag = document.createElement('li');
        liTag.classList.add('chat', 'incoming');

        let chatContent = `<i class='bx bxs-bot robot__logo'></i>
                           <p>Thinking <i class='bx bx-dots-horizontal-rounded bx-tada' ></i> </p>`;
        liTag.innerHTML = chatContent;

        chatBox.appendChild(liTag);
        chatBox.scrollTo(0, chatBox.scrollHeight);

        generateResponse(userMessage, liTag);
    }, 500);
    
}

function handleChat(){
    userMessage = chatInput.value.trim();
    if (userMessage){
        chatInput.style.height = `${inputInitHeight}px`;
        createChatLi(userMessage);
        creatChatbotThink(userMessage);
        chatInput.value = '';
    }
    else{
        return;
    }
}

chatInput.addEventListener('input', () => {
    // Adjust the height of the input textarea based on its content
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
})


chatInput.addEventListener('keyup', (e) => {
    if(e.key === 'Enter' && !e.shiftKey && window.innerWidth > 800){
        e.preventDefault();
        handleChat();
    }
})

sendChatBtn.addEventListener('click', handleChat);