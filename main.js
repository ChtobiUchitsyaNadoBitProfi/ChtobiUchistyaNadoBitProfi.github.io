class Morse {
    audioContext;
    soundVolume = 1.0;
    oscillator;
    gain;
    rate = 15;
    dot;
    lang = 'eng';
    stopTime;
    paused = 0;

    ENG_MORSE = {
        'A': '.-',
        'B': '-...',
        'C': '-.-.',
        'D': '-..',
        'E': '.',
        'F': '..-.',
        'G': '--.',
        'H': '....',
        'I': '..',
        'J': '.---',
        'K': '-.-',
        'L': '.-..',
        'M': '--',
        'N': '-.',
        'O': '---',
        'P': '.--.',
        'Q': '--.-',
        'R': '.-.',
        'S': '...',
        'T': '-',
        'U': '..-',
        'V': '...-',
        'W': '.--',
        'X': '-..-',
        'Y': '-.--',
        'Z': '--..',
        '1': '.----',
        '2': '..---',
        '3': '...--',
        '4': '....-',
        '5': '.....',
        '6': '-....',
        '7': '--...',
        '8': '---..',
        '9': '----.',
        '0': '-----'
    };
    RU_MORSE = {
        'А': '.-',
        'Б': '-...',
        'В': '.--',
        'Г': '--.',
        'Д': '-..',
        'Е': '.',
        'Ж': '...-',
        'З': '--..',
        'И': '..',
        'Й': '.---',
        'К': '-.-',
        'Л': '.-..',
        'М': '--',
        'Н': '-.',
        'О': '---',
        'П': '.--.',
        'Р': '.-.',
        'С': '...',
        'Т': '-',
        'У': '..-',
        'Ф': '..-.',
        'Х': '....',
        'Ц': '-.-.',
        'Ч': '---.',
        'Ш': '----',
        'Щ': '--.-',
        'Ы': '-.--',
        'Ь': '-..-',
        'Э': '..-..',
        'Ю': '..--',
        'Я': '.-.-',
        '1': '.----',
        '2': '..---',
        '3': '...--',
        '4': '....-',
        '5': '.....',
        '6': '-....',
        '7': '--...',
        '8': '---..',
        '9': '----.',
        '0': '-----'
    };
    emptyp = {'_': '__'};
    radiogram = [];
    letters = [];

    constructor() { }

    printKeyboard() {
        document.getElementById("main").appendChild(document.createElement("br"));
        document.getElementById("main").appendChild(document.createElement("br"));
        if (this.lang == 'ru') {
            let counter = 0;
            for (var prop in this.RU_MORSE) {
                if (counter == 10 || counter == 21 || counter == 31) {
                    document.getElementById("main").appendChild(document.createElement("br"));
                    document.getElementById("main").appendChild(document.createElement("br"));
                    document.getElementById("main").appendChild(document.createElement("br"));
                }
                var newDiv = document.createElement("div");
                newDiv.innerHTML = prop;
                newDiv.classList.add("letter");
                newDiv.style.display = "inline";
                newDiv.style.onclick = "soundClick()";
                document.getElementById("main").appendChild(newDiv);

                counter ++;
            }
        } else {
            let counter = 0;
            for (var prop in this.ENG_MORSE) {
                if (counter == 10 || counter == 19 || counter == 28) {
                    document.getElementById("main").appendChild(document.createElement("br"));
                    document.getElementById("main").appendChild(document.createElement("br"));
                    document.getElementById("main").appendChild(document.createElement("br"));
                }
                var newDiv = document.createElement("div");
                newDiv.innerHTML = prop;
                newDiv.classList.add("letter");
                newDiv.style.display = "inline";
                newDiv.style.onclick = "soundClick()";
                document.getElementById("main").appendChild(newDiv);

                counter ++;
            }
        }
        document.getElementById("main").appendChild(document.createElement("br"));
        document.getElementById("main").appendChild(document.createElement("br"));
    }

    createContext() {
        this.audioContext = new AudioContext();
        this.oscillator = this.audioContext.createOscillator();
        this.gain = this.audioContext.createGain();
        this.gain.gain.value = 0;
        this.oscillator.frequency.value = 750;
        this.oscillator.connect(this.gain);
        this.gain.connect(this.audioContext.destination);
        this.dot = 1.2 / this.rate;
        this.oscillator.start(0);
    }

    updateDote() {
        this.dot = 1.2 / this.rate;
    }

    createSound(time, char) {
        for (const c of char) {
            switch (c) {
            case '.':
                this.gain.gain.setValueAtTime(this.soundVolume, time);
                time += this.dot;
                this.gain.gain.setValueAtTime(0.0, time);
                break;
            case '-':
                this.gain.gain.setValueAtTime(this.soundVolume, time);
                time += 3 * this.dot;
                this.gain.gain.setValueAtTime(0.0, time);
                break;
            }
            time += this.dot;
        }
      
        return time;
    }

    generateMorse(time, p) {
        let blok = document.querySelector('.showMorse');
        if (this.lang == 'eng') {
            if (this.ENG_MORSE[p] !== undefined) {
                blok.innerHTML = p + ' ' + this.ENG_MORSE[p];
                time = this.createSound(time, this.ENG_MORSE[p]);
                time += 2 * this.dot;
            }
        } else if (this.lang == 'ru') {
            if (this.RU_MORSE[p] !== undefined) {
                blok.innerHTML = p + ' ' + this.RU_MORSE[p];
                time = this.createSound(time, this.RU_MORSE[p]);
                time += 2 * this.dot;
            }
        }

        return time;
    }

    updateMainButtons() {
        document.getElementById("mainButtons").innerHTML = '';

        let myLi = document.createElement('li');
        myLi.setAttribute('id', 'firstLi');
        document.getElementById("mainButtons").appendChild(myLi);
        let myButton = document.createElement('button');
        myButton = document.createElement('button');
        myButton.textContent = 'Eng';
        myButton.setAttribute('type', 'button');
        myButton.classList.add("myButton");
        myButton.setAttribute('data-target', '#language');
        document.getElementById("firstLi").appendChild(myButton);

        myLi = document.createElement('li');
        myLi.setAttribute('id', 'secondLi');
        document.getElementById("mainButtons").appendChild(myLi);
        myButton = document.createElement('button');
        myButton.textContent = 'Сгенерировать радиограмму';
        myButton.setAttribute('type', 'button');
        myButton.classList.add("myButton");
        myButton.setAttribute('onclick', 'createRadiogram()');
        document.getElementById("secondLi").appendChild(myButton);
    }

    touchStarted() {
        if (this.audioContext === undefined) {
            this.createContext();

            this.printKeyboard();
            this.updateMainButtons()

            //Смена языка клавиатуры
            const button = document.body.querySelector('[data-target="#language"]');
            button.addEventListener('click', function() {
                document.getElementById("radiogramButtons").innerHTML = '';
                if(button.innerText.toLowerCase() === 'ru') {
                    document.getElementById('main').innerHTML = '';

                    button.innerText = 'Eng';
                    morse.lang = 'eng';

                    morse.printKeyboard();
                } else {
                    document.getElementById('main').innerHTML = '';

                    button.innerText = 'Ru';
                    morse.lang = 'ru';

                    morse.printKeyboard();
                }
            });
        }
      
        this.generateMorse(this.audioContext.currentTime, this.morseText);
    }

    createRandomRadiogram(length) {
        this.radiogram = [];
        this.letters = [];
        let randomKey;
        document.getElementById('showMorse').innerHTML = '';
        document.getElementById('main').innerHTML = '';
        if (this.lang == 'eng') {
            for (let i = 0; i < length; i++) {
                randomKey = 10 + Math.floor(26 * Math.random());
                let counter = 0;
                for (var prop in this.ENG_MORSE) {
                    if (counter == randomKey) {
                        this.radiogram[i] = this.ENG_MORSE[prop];
                        this.letters[i] = prop;
                    }
                    counter ++;
                }
            }
            this.printRandomRadiogram();
        } else if (this.lang == 'ru') {
            for (let i = 0; i < length; i++) {
                randomKey = 10 + Math.floor(31 * Math.random());
                let counter = 0;
                for (var prop in this.RU_MORSE) {
                    if (counter == randomKey) {
                        this.radiogram[i] = this.RU_MORSE[prop];
                        this.letters[i] = prop;
                    }
                    counter ++;
                }
            }
            this.printRandomRadiogram();
        }
    }

    printRandomRadiogram() {
        for (let i = 0; i < this.radiogram.length; i++) {
            var newDiv = document.createElement("div");
            if ((i % 5) == 0) {
                newDiv.innerHTML = '';
                newDiv.classList.add("radiogram_letter");
                newDiv.style.display = "inline";
                document.getElementById("main").appendChild(newDiv);
            }
            if ((i % 15) == 0) {
                document.getElementById("main").appendChild(document.createElement("br"));
            }
            var newDiv = document.createElement("div");
            newDiv.innerHTML = this.letters[i];
            newDiv.classList.add("radiogram_letter");
            newDiv.style.display = "inline";
            document.getElementById("main").appendChild(newDiv);
        }

        document.getElementById("radiogramButtons").innerHTML = '';

        let myButton = document.createElement('button');
        myButton.textContent = 'Воспроизвести';
        myButton.setAttribute('type', 'button');
        myButton.setAttribute('data-target', '#stopPlay');
        myButton.classList.add("myButton");
        document.getElementById("radiogramButtons").appendChild(myButton);

        //Старт.Стоп
        const button = document.body.querySelector('[data-target="#stopPlay"]');
        button.addEventListener('click', function() {
            if(button.innerText.toLowerCase() === 'остановить') {
                button.innerText = 'Воспроизвести';
                morse.stopRandomRadiogram();
            } else {
                button.innerText = 'Остановить';
                morse.playRandomRadiogram();
            }
        });
    }

    playRandomRadiogram() {
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        let time = this.audioContext.currentTime;
        
        let counter = 0;
        for (var prop in this.radiogram) {
            if (document.body.querySelector('[data-target="#stopPlay"]').innerHTML == 'Play') {
                console.log("Stop")
                break;
            }

            if ((counter / 5) == 0) {
                this.gain.gain.setValueAtTime(0.0, time);
                time += 5 * this.dot;
            }
            if (this.radiogram[prop] !== undefined) {
                time = this.createSound(time, this.radiogram[prop]);
                time += 2 * this.dot;
            }
            counter ++;
        }

        return time;
    }

    stopRandomRadiogram() {
        this.audioContext.suspend();
    }
}

//Инициализация
let morse = new Morse();

//Управление громкостью
document.getElementById("sound-volume").innerHTML = morse.soundVolume * 100 + '%';
var volumeRange = document.getElementById('volume-range');
volumeRange.onchange = function() {
    morse.soundVolume = this.value / 100;
    document.getElementById("sound-volume").innerHTML = morse.soundVolume * 100 + '%';
}

//Управление скоростью
document.getElementById("sound-rate").innerHTML = morse.rate;
var rateRange = document.getElementById('rate-range');
rateRange.onchange = function(){
    morse.rate = this.value;
    morse.updateDote();
    document.getElementById("sound-rate").innerHTML = morse.rate;
}

function createRadiogram() {
    morse.createRandomRadiogram(5 * 9);
}

//Запуск контекста по кнопке и проигрывание звуков
function startMorse() {
    morse.touchStarted();

    document.querySelector('.main').addEventListener('click', e => {
        let content = e.target.innerHTML;

        morse.generateMorse(morse.audioContext.currentTime, content);
    });
}
