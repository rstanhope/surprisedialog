import * as Tone from 'tone';
import { ref } from "vue";

export default function () {
    const volume = ref(null);

    let int = null;
    let meter = null
    const startMeter = async () => {
        meter = new Tone.Meter();
        const mic = new Tone.UserMedia();
        meter.normalRange = false;
        meter.channelCount = 1;
        meter.smoothing = 0.5;
        await mic.open();
        mic.connect(meter);
        int = setInterval(() => {
            //volume.value = meter.getValue() * 380
            const level = meter.getValue();
            
            //volume.value = level
            const normalizedLevel = (level + 50) / 50;
            volume.value = normalizedLevel * 100;
        }, 20);
    };

    const stopMeter = () => {
        clearInterval(int);
        if (meter) {
            meter.dispose();
        }
    };

    return { startMeter, stopMeter, volume };

}