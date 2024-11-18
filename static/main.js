// Enable button
const enableBtn = document.querySelector(".enable");
let enabled = false;
// Toggle enabled
enableBtn.addEventListener("click", () => {
  enabled = !enabled;
  if (enabled) {
    enableBtn.classList.add("on");
  } else {
    enableBtn.classList.remove("on");
  }
});

// Create inputs
createInputs(8);
// Create outputs
createOutputs(8);
// Read outputs at a set interval 50ms
setInterval(() => {
  readOutputs();
}, 500);

async function changeInput(input) {
  if (!enabled) return;
  const response = await fetch("/input", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
  const receivedData = await response.json();
  console.log(receivedData);
}

async function readOutputs() {
  if (!enabled) return;
  const response = await fetch("/outputs");
  const outputArray = await response.json(); // [false, false, false, ...]
  outputArray.forEach((value, i) => {
    // Find the corresponding output
    const lampElement = document.querySelector(`#Q${i}`);
    if (value) {
      lampElement.classList.add("on");
    } else {
      lampElement.classList.remove("on");
    }
  });
}

function createInputs(number) {
  const inputField = document.querySelector("#inputs");
  // Using special for loop ;) for creating multiple buttons
  [...Array(number)].forEach((item, i) => {
    // Create button HTML element
    const buttonElement = document.createElement("button");
    buttonElement.textContent = `I${i}`;
    buttonElement.id = `I${i}`;
    buttonElement.classList.add("btn");
    // Add event listeners to the buttons (down & up)
    buttonElement.addEventListener("mousedown", () => {
      changeInput({ address: i, value: 1 });
    });
    buttonElement.addEventListener("mouseup", () => {
      changeInput({ address: i, value: 0 });
    });
    // Add the input to the inputField HTML div element
    inputField.appendChild(buttonElement);
  });
}

function createOutputs(number) {
  const outputField = document.querySelector("#outputs");
  // Using special for loop ;) for creating multiple outputs
  [...Array(number)].forEach((item, i) => {
    const lampElement = document.createElement("div");
    lampElement.classList.add("lamp");
    lampElement.id = `Q${i}`;
    outputField.appendChild(lampElement);
  });
}
