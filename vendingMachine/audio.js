import { handleMessage } from "./messages.js";
const sounds = ["ambient", "coin-insert", "item-drop", "peep", "refund"];

function getAudioSrc(name) {
  return import.meta.resolve(`./audio/${name}.mp3`);
}

async function initialize() {
  const audioPromises = sounds.map((name) => {
    const audio = new Audio();
    audio.src = getAudioSrc(name);
    /** @type {Promise<[string, HTMLAudioElement]>}*/
    const promise = new Promise((resolve) => {
      console.log("loaded audio: ", name);
      audio.oncanplay = () => resolve([name, audio]);
      audio.volume=0.3
    });
    return promise;
  });
  const audioFiles = await Promise.all(audioPromises);

  return Object.fromEntries(audioFiles);
}

const audioMap = await initialize();
handleMessage("audio", (trackName) => {
  console.log(`Playing ${trackName}`);
  new Audio(audioMap[trackName].src).play();
  
});
// console.log(ambient)
