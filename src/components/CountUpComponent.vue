<template>
    <v-card>
        <v-progress-linear color="primary" height="8" striped :model-value="progress"></v-progress-linear>
        <v-card-text>
            <div class="text-center">
                Count up by 2s from:
            </div>
            <div class="text-center">
                {{ countUp }}
            </div>
            
        </v-card-text>
    </v-card>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import UseDetectSpeech from "@/composables/UseDetectSpeech.js";
import UseWait from "@/composables/UseWait";

const { detectSpeech, stopDetectSpeech, speechDetected } = UseDetectSpeech();
const { wait } = UseWait();

const emit = defineEmits(['endCount'])

const countUp = ref(0);

const progress = ref(0);

let int;
onMounted(() => {
    countUp.value = randomNumberGenerator(2, 80, true);
    detectSpeech().then(()=>{
        //if speech stops before time runs out, this will trigger
        //technically not really using this code to do anything since speech can phase in and out
        console.log("speech stop");
    })
     
    let countUpDuration = randomNumberGenerator(3000, 5000, false)
    wait(countUpDuration).then(()=>{
        //when time runs outs
        stopDetectSpeech();
        emit("endCount", speechDetected.value);
    })

    
    int = setInterval(()=>{
        progress.value += Math.ceil(1000/countUpDuration * 100);
        if(progress.value >= 100){
            clearInterval(int);
        }
    }, 1000)

})

onUnmounted(()=>{
    if(int){
        clearInterval(int);
    }
})

//generate random between min and max, will return even number only is isEven == true
function randomNumberGenerator(min, max, isEven = false) {
    // min and max included
    let rand = Math.floor(Math.random() * (max - min + 1) + min);
    if (isEven == true) {
        if (rand % 2 != 0) {
            rand += 1;
        }
    }

    return rand;
}    
</script>