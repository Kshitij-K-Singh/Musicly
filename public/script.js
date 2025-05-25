const noteShowButton = document.getElementById("note-show");
      const keybindShowButton = document.getElementById("keybind-show");
      const drumPageButton = document.getElementById("drum-page");
      const pianoPageButton = document.getElementById("piano-page");
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
          noteShowButton.innerText = "Hide Note";
        } else {
          notes.forEach((note) => {
            note.style.visibility = "hidden";
          });
          noteShowButton.innerText = "Show Note";
        }
      });
      keybindShowButton.addEventListener("mousedown", () => {
        const keys = document.querySelectorAll(".key-bind");
        const isHidden = keys[0] && keys[0].style.visibility === "hidden";
        if (isHidden) {
          keys.forEach((key) => {
            key.style.visibility = "visible";
          });
          keybindShowButton.innerText = "Hide Keybind";
        } else {
          keys.forEach((key) => {
            key.style.visibility = "hidden";
          });
          keybindShowButton.innerText = "Show Keybind";
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
      function playSound(drum) {
        const audio = new Audio(`./sounds/${drum}.wav`);
        audio.currentTime = 0;
        audio.play();
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
      function playNote(note) {
        const audio = new Audio(`./sounds/${note}.ogg`);
        audio.currentTime = 0;
        audio.play();
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
            playSound(drum);
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