import * as Tone from 'tone';
import { ref } from "vue";

export default function UsePlaySound() {
    const isPlaying = ref(false);
    const isLoading = ref(false);
    let player;

    /**
     * Plays a sound file asynchronousely
     * @param {string} sound Path to sound file 
     * @param {number} repetitions Number of times to repeat the sound file (default 1)
     * @param {number} delay Duration in ms for delay between repeats (default 500)
     * @returns null
     */
    const playSound = (sound, repetitions = 1, delay=500) => {
        isLoading.value = true;
        isPlaying.value = true;
        let reps = 0
        player = new Tone.Player(
            {
                url: sound,
                onload: () => {
                    reps = 0;
                    isLoading.value = false;
                    player.start();
                },
                onerror: () => {
                    reps = 0;
                    isLoading.value = false;
                    isPlaying.value = false;
                    throw "Error playing sound file";
                },
                onstop: () => {
                    reps += 1
                    if (reps >= repetitions) {
                        isPlaying.value = false;
                    } else {
                        setTimeout(()=>{
                            player.start();
                        }, delay)
                    }
                }
            }
        ).toDestination();
        //console.log(player.value)
    }

    /**
     * Plays a sound file asynchronousely
     * @param {string} sound Path to sound file 
     * @param {number} repetitions Number of times to repeat the sound file (default 1)
     * @param {number} delay Duration in ms for delay between repeats (default 500)
     * @returns null
     */
    const playSoundAsync = async (sound, repetitions = 1, delay=500) => {
        isLoading.value = true;
        let reps = 0;
        await Tone.start();
        isPlaying.value = true;
        let prm = new Promise((resolve, reject) => {
            player = new Tone.Player(
                {
                    url: sound,
                    onload: () => {
                        reps = 0;
                        isLoading.value = false;
                        player.start();
                    },
                    onerror: () => {
                        reps = 0;
                        isLoading.value = false;
                        isPlaying.value = false;
                        reject("Error playing sound file");
                    },
                    onstop: () => {
                        reps += 1
                        if (reps >= repetitions) {
                            isPlaying.value = false;
                            resolve();
                        } else {
                            setTimeout(()=>{
                                player.start();
                            }, delay)
                        }

                    }
                }
            ).toDestination();
        })
        return prm;
    }

    const stopSound = () => {
        player.stop();
    }

    return { playSound, playSoundAsync, stopSound, isPlaying, isLoading }
}