import Rx from 'rxjs';

const audio = new (window.AudioContext || window.webkitAudioContext)(),
      BeepSubject = new Rx.Subject();

const signal$ = BeepSubject
  .subscribe((freq) => {
    const oscillator = audio.createOscillator();

    oscillator.connect(audio.destination);
    oscillator.type = 'square';

    // https://en.wikipedia.org/wiki/Piano_key_frequencies
    oscillator.frequency.value = Math.pow(2, (freq - 49) / 12) * 440;

    oscillator.start();
    oscillator.stop(audio.currentTime + 0.100);
  });

export default BeepSubject;
