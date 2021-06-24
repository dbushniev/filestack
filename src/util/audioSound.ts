const audioSound = () => {
  const audioElement: HTMLAudioElement = document.querySelector('audio');
  if (audioElement) {
    audioElement.currentTime=0;
    audioElement.play();
  }
};

export default audioSound;