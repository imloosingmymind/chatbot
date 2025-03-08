const messagesDiv = document.getElementById("messages");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const voiceSelect = document.getElementById("voiceSelect");

// Web Speech API for speech recognition and synthesis
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = "en-US";
recognition.interimResults = false;
recognition.continuous = false;

const synth = window.speechSynthesis;
let selectedVoice = null;
let isListening = false;

// Populate voice options
const populateVoiceList = () => {
  const voices = synth.getVoices();
  voiceSelect.innerHTML = ""; // Clear existing options
  voices.forEach((voice, index) => {
    const option = document.createElement("option");
    option.textContent = `${voice.name} (${voice.lang})`;
    option.value = index;
    if (voice.default) option.selected = true;
    voiceSelect.appendChild(option);
  });
  selectedVoice = voices.find((voice) => voice.default) || voices[0];
};

// Call populateVoiceList when voices are loaded
if (synth.onvoiceschanged !== undefined) {
  synth.onvoiceschanged = populateVoiceList;
}

// Display messages
const displayMessage = (text, sender) => {
  const messageDiv = document.createElement("div");
  messageDiv.textContent = text;
  messageDiv.className = sender;
  messagesDiv.appendChild(messageDiv);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
};

// Speak using the selected voice
const speak = (text) => {
  const utterance = new SpeechSynthesisUtterance(text);
  if (selectedVoice) {
    utterance.voice = synth.getVoices()[voiceSelect.value];
  }
  utterance.onend = () => {
    if (isListening) recognition.start();
  };
  synth.speak(utterance);
};

// Send message to backend
const sendMessageToBackend = async (message) => {
  try {
    const response = await fetch("http://localhost:3000/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, sessionId: "unique-session-id" }),
    });
    const data = await response.json();
    const botMessage = data.fulfillmentText || "I didn't understand that.";
    displayMessage(botMessage, "bot");
    speak(botMessage);
  } catch (error) {
    console.error("Error communicating with backend:", error);
    displayMessage("Error communicating with chatbot.", "bot");
    if (isListening) recognition.start();
  }
};

// Speech recognition event handlers
recognition.onresult = (event) => {
  const userMessage = event.results[0][0].transcript;
  displayMessage(userMessage, "user");
  sendMessageToBackend(userMessage);
};

recognition.onerror = (event) => {
  console.error("Speech recognition error:", event.error);
  if (isListening) recognition.start();
};

// Start/Stop button event listeners
startButton.addEventListener("click", () => {
  isListening = true;
  startButton.style.display = "none";
  stopButton.style.display = "inline-block";
  recognition.start();
  displayMessage("Listening...", "bot");
});

stopButton.addEventListener("click", () => {
  isListening = false;
  startButton.style.display = "inline-block";
  stopButton.style.display = "none";
  recognition.stop();
  displayMessage("Stopped listening.", "bot");
});

