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

function showPopupMessage(message, duration) {
    let popup = document.getElementById("popupMessage");
    if (!popup) {
        popup = document.createElement("div");
        popup.id = "popupMessage";
        popup.style.position = "fixed";
        popup.style.top = "50%";
        popup.style.left = "50%";
        popup.style.transform = "translate(-50%, -50%)";
        popup.style.backgroundColor = "rgba(0,0,0,0.8)";
        popup.style.color = "white";
        popup.style.padding = "15px 25px";
        popup.style.borderRadius = "15px";
        popup.style.zIndex = "10000";
        popup.style.fontSize = "1.2rem";
        popup.style.textAlign = "center";
        popup.style.opacity = "0";
        popup.style.transition = "opacity 0.5s ease";
        document.body.appendChild(popup);
    }
    popup.textContent = message;
    popup.style.opacity = "1";

    setTimeout(() => {
        popup.style.opacity = "0";
    }, duration);
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
                        let popupDuration = 2000;

                        if (currentStep === 3) {  // Q1
                            if (noClickCounts[currentStep] === 1) {
                                message = "I know you press \"No\" 😏";
                            } else if (noClickCounts[currentStep] === 2) {
                                message = "Ok your Life Your chois & I really miss your voice-aaaa 😉";
                                popupDuration = 4000;
                            }
                        } else if (currentStep === 4) { // Q2
                            if (noClickCounts[currentStep] === 1) {
                                message = "Really you want I remain hungry all-Day 🥲";
                            } else if (noClickCounts[currentStep] === 2) {
                                message = "OK, next time If we meet, offer something good & you pay 😎";
                                popupDuration = 4000;
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
                showPopupMessage("Clear 🤣🤣 Think aaaaaaaaaa .... & Refresh the pg again", 2000);
            } else {
                localStorage.clear();
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


