let clearClickCount = 0;
const noClickCounts = {
    3: 0,
    4: 0
};

// Playlist of audio files
const audioFiles = [
    "assets/song1.mp3",
    "assets/song2.mp3"
];

let currentTrack = 0;

// Create audio element dynamically
const audio = document.createElement("audio");
audio.id = "bgMusic";
audio.src = audioFiles[currentTrack];
audio.style.display = "none"; // Hide audio player
document.body.appendChild(audio);

// Play the next song automatically on ended
audio.addEventListener("ended", function () {
    currentTrack = (currentTrack + 1) % audioFiles.length;
    audio.src = audioFiles[currentTrack];
    audio.play();
});

// Popup automatically hide after some sec

// function showPopupMessage(message, duration) {
//     let popup = document.getElementById("popupMessage");
//     if (!popup) {
//         popup = document.createElement("div");
//         popup.id = "popupMessage";
//         popup.style.position = "fixed";
//         popup.style.top = "50%";
//         popup.style.left = "50%";
//         popup.style.transform = "translate(-50%, -50%)";
//         popup.style.backgroundColor = "rgba(0,0,0,0.8)";
//         popup.style.color = "white";
//         popup.style.padding = "15px 25px";
//         popup.style.borderRadius = "15px";
//         popup.style.zIndex = "10000";
//         popup.style.fontSize = "1.2rem";
//         popup.style.textAlign = "center";
//         popup.style.opacity = "0";
//         popup.style.transition = "opacity 0.5s ease";
//         document.body.appendChild(popup);
//     }
//     popup.textContent = message;
//     popup.style.opacity = "1";

//     setTimeout(() => {
//         popup.style.opacity = "0";
//     }, duration);
// }

// Increse time and add "X"

function showPopupMessage(message, duration = 8000, isClearMessage = false) {
    let popup = document.getElementById("popupMessage");
    if (!popup) {
        popup = document.createElement("div");
        popup.id = "popupMessage";
        popup.style.position = "fixed";  
        popup.style.left = "50%";
        popup.style.transform = "translate(-50%, -50%)";
        popup.style.backgroundColor = "rgba(0,0,0,0.8)";
        popup.style.color = "white";
        popup.style.padding = "15px 25px";
        popup.style.borderRadius = "15px";
        popup.style.zIndex = "10001";   
        popup.style.fontSize = "1.2rem";
        popup.style.textAlign = "center";
        popup.style.opacity = "0";
        popup.style.transition = "opacity 0.5s ease";
        popup.style.minWidth = "250px";
        popup.style.maxWidth = "90vw";  
        document.body.appendChild(popup);
    }

    // Adjust only for Clear button messages
    popup.style.top = isClearMessage ? "40%" : "20%";

    // Set message with close button
    popup.innerHTML = `
        <div style="position: relative; padding-top: 10px;">
            <button id="popupCloseBtn" style="
                position: absolute;
                top: -30px;
                right: -5px;
                background: #ff4444;
                color: white;
                border: none;
                border-radius: 50%;
                width: 25px;
                height: 25px;
                font-size: 14px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                z-index: 1;
            ">×</button>
            <div>${message}</div>
        </div>
    `;

    popup.style.opacity = "1";

    document.getElementById("popupCloseBtn").onclick = () => popup.style.opacity = "0";
    popup.hideTimeout = setTimeout(() => popup.style.opacity = "0", duration);
}

const steps = [
    { text: "New city, new faces, yet some person voices leave a mark." },
    { text: "I enjoyed talking with you — It isn't about replacing anyone, but because your presence feels light." },
    { text: "Even food became part of our talks — me joking about only Omelette until suggestions arrive 🤣" },
    {
        text: "Would you like to walk with me at the end of the day?",
        options: ["Yes", "No"],
        key: "walkTogether"
    },
    {
        text: "Would you suggest the best South Indian food each month so I don’t stay hungry?",
        options: ["Yes", "No"],
        key: "foodSuggestion"
    },
    { text: "That’s it 🌿 Thank you for being part of this small story.", final: true }
];

let currentStep = 0;
const storyEl = document.getElementById("story");
const optionsEl = document.getElementById("options");
const nextBtn = document.getElementById("nextBtn");

function renderStep() {
    const step = steps[currentStep];
    storyEl.textContent = step.text;
    optionsEl.innerHTML = "";

    if (step.options) {
        step.options.forEach(option => {
            const btn = document.createElement("button");
            btn.textContent = option;

            if (option === "No" && (currentStep === 3 || currentStep === 4)) {
                btn.style.position = "relative"; // For transform effect

                btn.onclick = () => {
                    if (noClickCounts[currentStep] < 2) {
                        noClickCounts[currentStep]++;

                        // Random move ±100px
                        const maxShift = 100;
                        const randomX = (Math.random() * 2 - 1) * maxShift;
                        const randomY = (Math.random() * 2 - 1) * maxShift;
                        btn.style.transform = `translate(${randomX}px, ${randomY}px)`;

                        let message = "";
                        let popupDuration = 8000;

                        if (currentStep === 3) {  // Q1
                            if (noClickCounts[currentStep] === 1) {
                                message = "I know you press \"No\" 😏";
                            } else if (noClickCounts[currentStep] === 2) {
                                message = "Ok your Life Your chois & I really miss your voice-aaaa 😉";
                                popupDuration = 8000;
                            }
                        } else if (currentStep === 4) { // Q2
                            if (noClickCounts[currentStep] === 1) {
                                message = "Really you want I remain hungry all-Day 🥲";
                            } else if (noClickCounts[currentStep] === 2) {
                                message = "OK, next time If we meet, offer something good & you pay 😎";
                                popupDuration = 15000;
                            }
                        }

                        showPopupMessage(message, popupDuration);
                    } else {
                        // After 2 evasions, allow normal click
                        localStorage.setItem(step.key, option);
                        nextStep();
                    }
                };
            } else {
                // Normal click behavior for other buttons
                btn.onclick = () => {
                    localStorage.setItem(step.key, option);
                    nextStep();
                };
            }

            optionsEl.appendChild(btn);
        });

        nextBtn.style.display = "none";
    } else if (step.final) {
        const sendBtn = document.createElement("button");
        sendBtn.textContent = "Send";
        sendBtn.onclick = sendWhatsApp;
        const clearBtn = document.createElement("button");
        clearBtn.textContent = "Clear";
        clearBtn.onclick = () => {
            if (clearClickCount === 0) {
                clearClickCount++;
                showPopupMessage("Yes you are right ?? 🙃 <br> I just need a good friend not gf<br><br> that's why I first day tell you I already have a gf, I like your voice that's not mean ... <br><br>I also like my dad and mom's voice, same like your's<br><br>Click \"Clear\" button to Start again", 30000, true);
            } else {
                // Clear storage and reset counters
                localStorage.clear();
                clearClickCount = 0;
                noClickCounts[3] = 0;
                noClickCounts[4] = 0;

                // Change Send button into Start Again
                sendBtn.textContent = "";
                sendBtn.classList.add("Action-button", "btn-4");
                sendBtn.innerHTML = `<span>Start Again</span>`;
                sendBtn.onclick = () => {
                    currentStep = 0;
                    renderStep();
                };

                showPopupMessage("I had a friend like you in class 11, we always laughed and joked, nothing bad ever came to my mind. I may not talk to her now but I still respect her as a friend.<br>Actually if someone listens to me carefully, remembers, laughs, I really like it. That's why I went to talk at the end of the day. but I understand, these days, not everyone sees anything in a normal way<br><br>", 50000, true);
            }
        };

        optionsEl.appendChild(sendBtn);
        optionsEl.appendChild(clearBtn);
        nextBtn.style.display = "none";
    } else {
        nextBtn.style.display = "inline-block";
    }
}

function nextStep() {
    if (currentStep < steps.length - 1) {
        currentStep++;
        renderStep();
    }
}

function sendWhatsApp() {
    const walk = localStorage.getItem("walkTogether") || "Not answered";
    const food = localStorage.getItem("foodSuggestion") || "Not answered";
    const message = `Here are your answers:\nWalk together: ${walk}\nFood suggestion: ${food}`;
    const url = `https://wa.me/917076033011?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
}

// start
renderStep();
nextBtn.addEventListener("click", nextStep);

// add floating leaves
for (let i = 0; i < 3; i++) {
    const leaf = document.createElement("div");
    leaf.classList.add("leaf");
    document.body.appendChild(leaf);
}

// last leaf - play/pause button
const leaves = document.querySelectorAll('.leaf');
const appleLeaf = leaves[leaves.length - 1];  // last leaf (apple)

appleLeaf.style.cursor = "pointer";
appleLeaf.title = "Click to play/pause music";

appleLeaf.addEventListener('click', function () {
    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }
});

// Create hint elements (arrow + text)
const hintContainer = document.createElement('div');
hintContainer.id = 'musicHint';

const clickText = document.createElement('div');
clickText.id = 'clickText';
clickText.textContent = 'Click to Play';

const arrowUp = document.createElement('div');
arrowUp.id = 'arrowUp';
arrowUp.textContent = '⬇️';

hintContainer.appendChild(clickText);
hintContainer.appendChild(arrowUp);
document.body.appendChild(hintContainer);

// Remove hint when apple is clicked
appleLeaf.addEventListener('click', function () {
    hintContainer.remove();
}, { once: true });
