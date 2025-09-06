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
    text: "Would you suggest the best North Indian food each month so I don’t stay hungry?", 
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
      btn.onclick = () => {
        localStorage.setItem(step.key, option);
        nextStep();
      };
      optionsEl.appendChild(btn);
    });
    nextBtn.style.display = "none";
  } else if (step.final) {
    const sendBtn = document.createElement("button");
    sendBtn.textContent = "Send";
    sendBtn.onclick = sendWhatsApp;
    const clearBtn = document.createElement("button");
    clearBtn.textContent = "Clear";
    clearBtn.onclick = () => localStorage.clear();
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
