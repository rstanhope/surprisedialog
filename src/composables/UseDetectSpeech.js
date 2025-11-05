import { MicVAD } from "@ricky0123/vad-web"
import { ref } from "vue";

export default function UseDetectSpeech() {

    let myvad;
    let speechDetected = ref(false);
    const detectSpeech = async () => {
        speechDetected.value = false
        if (!myvad) {
            myvad = await MicVAD.new({
                model: "v5",
                redemptionFrames: 4,
                onnxWASMBasePath: "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.22.0/dist/",
                baseAssetPath: "https://cdn.jsdelivr.net/npm/@ricky0123/vad-web@0.0.29/dist/",
                onSpeechRealStart: ()=>{
                    speechDetected.value = true;
                    console.log("speech start");
                },
                onSpeechEnd: ()=>{
                    console.log("speech stop");
                    myvad.pause();
                    outerResolve({status:"speech end"})
                }
            })
        }

        myvad.start();
        let outerResolve;
        const prm = new Promise((resolve) => {
            outerResolve = resolve
        });

        return prm
    }

    const stopDetectSpeech = () => {
        if(myvad){
            myvad.pause();
        }
    }

    return { detectSpeech, stopDetectSpeech, speechDetected }
}