

const API_KEY = null;


const chatInput = document.getElementById('input-field');
const sendChatBtn = document.querySelector(".chat__input span");
const chatBox = document.getElementById('chat-box');

function updateTimeTest(idTest, createTime){
    const arrCheck = JSON.parse(localStorage.getItem('messageAll')) || [];
    arrCheck.forEach(e =>{
        if(e.idMessage == idTest){
            let timeReal = new Date();
            console.log(timeReal);
            if(timeReal > createTime){
                return timeReal - createTime;
            }
        }
    })
}

setInterval(updateTimeTest, 3000);


let userMessage;

const inputInitHeight = chatInput.scrollHeight;

function createChatLi(idMessage, userMessage, createTime){
    
    createDateTime();

    const liTag = document.createElement('li');
    liTag.classList.add('chat', 'outgoing');

    let chatContent = `<p class="time__update" id="time-update">${updateTimeTest(idMessage, createTime)}</p>
                       <p class="textMessage"></p>`;
    liTag.innerHTML = chatContent;

    liTag.querySelector('p.textMessage').textContent = userMessage;

    chatBox.appendChild(liTag);
    chatBox.scrollTo(0, chatBox.scrollHeight);
}

function creatChatbotThink(userMessage, messageArr){

    setTimeout(()=>{
        let idBot, idCheck;
        let createTimeBot = new Date();


        const liTag = document.createElement('li');
        liTag.classList.add('chat', 'incoming');

        let chatContent = `<i class='bx bxs-bot robot__logo'></i>
                           <p>Thinking <i class='bx bx-dots-horizontal-rounded bx-tada' ></i> </p>`;
        liTag.innerHTML = chatContent;

        chatBox.appendChild(liTag);
        chatBox.scrollTo(0, chatBox.scrollHeight);

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

        idBot = checkID(messageArr, idCheck);

        // Send POST request to API, get the response
        fetch(API_URL, requestOptions).then(res => res.json()).then(data => {

            console.log(data);
            messageElment.textContent = data.choices[0].message.content;

            messageArr.push(new ObjMessage(idBot, messageElment.textContent, createTimeBot));
            localStorage.setItem('messageAll', JSON.stringify(messageArr));

        }).catch((error) => {
            messageElment.classList.add("error__chatbot");
            messageElment.textContent = "Oops! Something went wrong. Please try again.";

            messageArr.push(new ObjMessage(idBot, messageElment.textContent, createTimeBot));
            localStorage.setItem('messageAll', JSON.stringify(messageArr));
        }).finally(() => chatBox.scrollTo(0, chatBox.scrollHeight));

    }, 500);
}

let previousHours = null, previousMinutes = null, previousMonths = null, previousYears = null;

function createDateTime(){
    
    const d = new Date();

    // Working with Hours and Miniutes
    const hours = d.getHours();
    const minutes = d.getMinutes();
    const minutesReal = minutes < 10 ? `0${minutes}` : minutes;
    const hoursUS = hours > 12 ? hours-12 : hours;
    const amOrPm = hours >= 12 ? "PM" : "AM";

    // Working with Day
    const dayIndex = d.getDay();
    const daysOfWeek = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    const dayName = daysOfWeek[dayIndex];

    // Working with Month and Year
    const months = d.getMonth();
    const years = d.getFullYear();

    if (previousYears === null || years == previousYears){

        if (previousMonths === null || months == previousMonths){

            if (previousMinutes === null || minutes > previousMinutes + 20) {
                const liTag = document.createElement('li');
                liTag.classList.add('chat', 'timechat');
            
                let chatContent = `<p>${hoursUS} : ${minutesReal} ${amOrPm} ${dayName}</p>`;
                liTag.innerHTML = chatContent;
            
                chatBox.appendChild(liTag);
            }

        }
        else{

            if (previousMonths === null || months > previousMonths){
                const liTag = document.createElement('li');
                liTag.classList.add('chat', 'timechat');
        
                let chatContent = `<p>${hoursUS} : ${minutesReal} ${amOrPm} ${dayName} ${months}</p>`;
                liTag.innerHTML = chatContent;
        
                chatBox.appendChild(liTag);
            }

        }

    }
    else{

        if (previousYears === null || years > previousYears){
            const liTag = document.createElement('li');
            liTag.classList.add('chat', 'timechat');
        
            let chatContent = `<p>${hoursUS} : ${minutesReal} ${amOrPm} ${dayName} ${months}/${years}</p>`;
            liTag.innerHTML = chatContent;
        
            chatBox.appendChild(liTag);
        }

    }

    previousHours = hours;
    previousYears = years;
    previousMonths = months;
    previousMinutes = minutes;
}



//Funtion to check Arr
function checkArr(messageArr){

    messageArr = JSON.parse(localStorage.getItem('messageAll'));

    if(!messageArr || messageArr === null || messageArr === undefined){
        messageArr = [];
        return messageArr;
    }
    else{
        return messageArr;
    }
}


//Funtion to find id largest
function checkID(arr,idMax){
    arr = JSON.parse(localStorage.getItem('messageAll'));
    if(!arr || arr.length == 0 || arr === undefined){
        idMax=0;
        return idMax;
    }
    else{
        let maxID = 0
        arr.forEach((item)=>{
            if(item.idMessage > maxID){
                maxID = item.idMessage; 
            }
        })
        idMax = maxID;
        return idMax+1;
    }
}

// funtion add value in a Object
function ObjMessage(idMessage, contentMessage, timeCreate, timeUpdate){
    this.idMessage = idMessage,
    this.contentMessage = contentMessage,
    this.timeCreate = timeCreate;
}


function handleChat(){
    userMessage = chatInput.value.trim();
    let messageArr, messageArrCheck;
    let idMessage, idCheck;
    let createTime = new Date();

    //Call funtion to check Array
    messageArr = checkArr(messageArrCheck);

    //Call funtion to find id largest
    idMessage = checkID(messageArr, idCheck);

    if (userMessage){

        chatInput.style.height = `${inputInitHeight}px`;

        messageArr.push(new ObjMessage(idMessage, userMessage, createTime));
        localStorage.setItem('messageAll', JSON.stringify(messageArr));
        
        createChatLi(idMessage, userMessage, createTime);
        creatChatbotThink(userMessage, messageArr);
        chatInput.value = '';

    }
    else{
        return;
    }
}




if(chatInput.value === null || chatInput.value === undefined || !chatInput.value){
    chatInput.style.overflowY = "hidden";
}

chatInput.addEventListener('input', () => {
    // Adjust the height of the input textarea based on its content
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
    chatInput.style.removeProperty("overflow-y");
})


chatInput.addEventListener('keyup', (e) => {
    if(e.key === 'Enter' && !e.shiftKey && window.innerWidth > 800){
        e.preventDefault();
        handleChat();
    }
})

sendChatBtn.addEventListener('click', handleChat);