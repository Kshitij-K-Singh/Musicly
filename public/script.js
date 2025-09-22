const noteShowButton = document.getElementById("note-show");
const keybindShowButton = document.getElementById("keybind-show");
const drumPageButton = document.getElementById("drum-page");
const pianoPageButton = document.getElementById("piano-page");
const noteshowBtnTxt = document.getElementById("note-show-txt");
const KeyBndTxt = document.getElementById("kb-txt");

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const instrumentDest = audioCtx.createMediaStreamDestination();
let recorder,
  chunks = [];
let recordingStartTime;
let timerInterval;

let micStream = null;
let micSourceNode = null;

navigator.mediaDevices
  .getUserMedia({ audio: true })
  .then((stream) => {
    micStream = stream;
    console.log("Microphone access granted.");
  })
  .catch((err) => {
    console.warn("Microphone access denied:", err);
    document.getElementById("mic-toggle").disabled = true;
    document.querySelector('label[for="mic-toggle"]').style.color = "grey";
  });

document.addEventListener(
  "click",
  () => {
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
  },
  { once: true }
);

function fadeOut(el) {
  el.style.transition = "opacity 0.3s";
  el.style.opacity = 0;
  setTimeout(() => {
    el.style.visibility = "hidden";
  }, 300);
}

function fadeIn(el) {
  el.style.display = "block";
  el.style.visibility = "visible";
  el.style.transition = "opacity 0.3s";
  el.style.opacity = 0;
  setTimeout(() => {
    el.style.opacity = 1;
  }, 450);
}

pianoPageButton.addEventListener("mousedown", () => {
  const drumpage = document.getElementById("drums");
  fadeOut(drumpage);
  const instrumentname1 = document.getElementById("about3");
  fadeIn(instrumentname1);
  const pianopage = document.getElementById("piano");
  fadeIn(pianopage);
});

drumPageButton.addEventListener("mousedown", () => {
  const instrumentname1 = document.getElementById("about3");
  fadeOut(instrumentname1);
  const pianopage = document.getElementById("piano");
  fadeOut(pianopage);
  const drumpage = document.getElementById("drums");
  fadeIn(drumpage);
});

noteShowButton.addEventListener("mousedown", () => {
  const notes = document.querySelectorAll(".note");
  const isHidden = notes[0] && notes[0].style.visibility === "hidden";
  if (isHidden) {
    notes.forEach((note) => {
      note.style.visibility = "visible";
    });
    noteshowBtnTxt.innerText = "Hide Note";
  } else {
    notes.forEach((note) => {
      note.style.visibility = "hidden";
    });
    noteshowBtnTxt.innerText = "Show Note";
  }
});

keybindShowButton.addEventListener("mousedown", () => {
  const keys = document.querySelectorAll(".key-bind");
  const isHidden = keys[0] && keys[0].style.visibility === "hidden";
  if (isHidden) {
    keys.forEach((key) => {
      key.style.visibility = "visible";
    });
    KeyBndTxt.innerText = "Hide Keybind";
  } else {
    keys.forEach((key) => {
      key.style.visibility = "hidden";
    });
    KeyBndTxt.innerText = "Show Keybind";
  }
});

const keytodrum = {
  b: "kick",
  f: "floor",
  g: "mid",
  h: "high",
  j: "snare",
  e: "crash",
  r: "hihato",
  u: "hihatc",
  i: "ride",
};

const keyToNote = {
  a: "C4",
  w: "Cs4",
  s: "D4",
  e: "Ds4",
  d: "E4",
  f: "F4",
  t: "Fs4",
  g: "G4",
  y: "Gs4",
  h: "A4",
  u: "As4",
  j: "B4",
  0: "C5",
  1: "Cs5",
  2: "D5",
  3: "Ds5",
  4: "E5",
  5: "F5",
  6: "Fs5",
  7: "G5",
  8: "Gs5",
  9: "A5",
  q: "As5",
  z: "B5",
  x: "C6",
  c: "Cs6",
  v: "D6",
  b: "Ds6",
  n: "E6",
  m: "F6",
  ",": "Fs6",
  ".": "G6",
  k: "Gs6",
  ";": "A6",
  i: "As6",
  "[": "B6",
};

function playSoundAndRecord(soundUrl) {
  const audio = new Audio(soundUrl);
  const source = audioCtx.createMediaElementSource(audio);

  source.connect(audioCtx.destination);
  source.connect(instrumentDest);

  audio.currentTime = 0;
  audio.play();
}

function playDrumSound(drum) {
  playSoundAndRecord(`sounds/${drum}.wav`);
}

function playNote(note) {
  playSoundAndRecord(`sounds/${note}.ogg`);
}

function drumkey(drum) {
  const key = document.querySelector(`[keymap-show="${drum}"]`);
  if (key) {
    key.style.transition = "transform 0.15s";
    key.classList.add("active");
    key.style.transform = "scale(1.1)";
    setTimeout(() => {
      key.classList.remove("active");
      key.style.transform = "scale(1)";
    }, 150);
  }
}

function highlightKey(note) {
  const key = document.querySelector(`[data-note="${note}"]`);
  if (key) {
    key.classList.add("active");
    setTimeout(() => key.classList.remove("active"), 150);
  }
}

document.querySelectorAll(".white-key, .black-key").forEach((btn) => {
  btn.addEventListener("mousedown", () => {
    const note = btn.getAttribute("data-note");
    playNote(note);
    highlightKey(note);
  });
});

document.addEventListener("keydown", (e) => {
  const drumPage = document.getElementById("drums");
  const pianoPage = document.getElementById("piano");
  if (drumPage.style.opacity === "1") {
    const drum = keytodrum[e.key.toLowerCase()];
    if (drum) {
      playDrumSound(drum);
      drumkey(drum);
    }
  }
  if (pianoPage.style.opacity === "1") {
    const note = keyToNote[e.key.toLowerCase()];
    if (note) {
      playNote(note);
      highlightKey(note);
    }
  }
});

const recordBtn = document.getElementById("record-btn");
const stopBtn = document.getElementById("stop-btn");
const downloadLink = document.getElementById("download-link");
const recIndicator = document.getElementById("rec-indicator");
const timerEl = document.getElementById("timer");
const micToggle = document.getElementById("mic-toggle");

function updateTimer() {
  const elapsed = Math.floor((Date.now() - recordingStartTime) / 1000);
  const minutes = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const seconds = String(elapsed % 60).padStart(2, "0");
  timerEl.textContent = `${minutes}:${seconds}`;
}

function startRecording() {
  if (micToggle.checked && micStream) {
    if (!micSourceNode) {
      micSourceNode = audioCtx.createMediaStreamSource(micStream);
    }
    micSourceNode.connect(instrumentDest);
  }

  const stream = instrumentDest.stream;
  recorder = new MediaRecorder(stream);
  chunks = [];
  recorder.ondataavailable = (e) => chunks.push(e.data);

  recorder.onstop = () => {
    const blob = new Blob(chunks, { type: "audio/webm;codecs=opus" });
    const url = URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.classList.remove("disabled");

    if (micSourceNode) {
      micSourceNode.disconnect(instrumentDest);
    }
  };

  recorder.start();
  recordingStartTime = Date.now();
  recIndicator.style.display = "block";
  timerInterval = setInterval(updateTimer, 1000);

  recordBtn.disabled = true;
  stopBtn.disabled = false;
  micToggle.disabled = true;
  downloadLink.classList.add("disabled");
}

function stopRecording() {
  if (recorder && recorder.state === "recording") {
    recorder.stop();
  }
  clearInterval(timerInterval);
  recIndicator.style.display = "none";
  timerEl.textContent = "00:00";

  recordBtn.disabled = false;
  stopBtn.disabled = true;
  micToggle.disabled = false;
}

recordBtn.onclick = startRecording;
stopBtn.onclick = stopRecording;

downloadLink.addEventListener("click", (e) => {
  if (downloadLink.classList.contains("disabled")) {
    e.preventDefault();
  }
});
