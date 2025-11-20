<template>
    <v-container>
        <h1 class="text-center" v-if="state == 'fixation'">+</h1>
        <div class="text-center" v-if="state == 'listening'">
            <h3 class="font-weight-light font-italic">Please listen...</h3>
        </div>
        <div class="text-center" v-if="state == 'responding'">
            <h3>
                Based on the way the speaker said the sentence, which question do you think they were responding to?
            </h3>
            <div class="d-flex justify-center mt-4">
                <v-btn class="mr-4" color="purple-darken-2" @click="onResponseClick(1)">{{ currentItem.t1choice1
                }}</v-btn>
                <v-btn color="purple-darken-2" @click="onResponseClick(2)">{{ currentItem.t1choice2 }}</v-btn>
            </div>
        </div>
        <div class="d-flex justify-center mt-4">
            {{ participantStore.index + 1 }} of {{ participantStore.list.length }}
        </div>
        <v-dialog v-model="showCountUp" fullscreen="" persistent="" transition="none">
            <CountUpComponent v-if="showCountUp" @end-count="endCount"></CountUpComponent>
        </v-dialog>
    </v-container>
</template>

<script setup>
import { computed, onMounted, ref, toRaw } from 'vue';
import { useParticipantStore } from "@/stores/useParticipantStore.js";
import UsePlaySound from "@/composables/UsePlaySound.js";
import UseWait from '@/composables/UseWait';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router'
import CountUpComponent from '@/components/CountUpComponent.vue';
import { getDatabase, ref as dbRef, serverTimestamp, push } from "firebase/database";

const participantStore = useParticipantStore();
const { playSoundAsync } = UsePlaySound();
const state = ref("listening");// listening, responding
const showCountUp = ref(false);
const router = useRouter();
const { wait } = UseWait();


const currentItem = computed(() => participantStore.list[participantStore.index])

onMounted(() => {
    Swal.fire({
        title: "Click 'Next' to begin"
    }).then(() => {
        play()
    })
})

const play = async () => {
    state.value = "listening";
    await playSoundAsync("audio/" + currentItem.value.audio)
    state.value = "responding";
}

let dataToSave
const onResponseClick = (response) => {
    //hold data in dataToSave variable to be stored in Firebase
    dataToSave = structuredClone(toRaw(currentItem.value)) //{ ...currentItem.value };
    dataToSave.response = response;
    dataToSave.timestamp = serverTimestamp();
    dataToSave.pid = participantStore.pid;
    //console.log(dataToSave);
    //console.log(response);

    //incremenet item index
    participantStore.index += 1;
    if (participantStore.index >= participantStore.list.length) {
        router.push("/end")
    }

    //display count up component
    showCountUp.value = true;
}

//when count up mini-task is completed, play nexttrial
const endCount = async (speechDetected) => {
    //save dataToSave and speechDetected boolean to Firebase
    console.log("speech detected?", speechDetected);
    dataToSave.speechDetected = speechDetected;
    push(dbRef(getDatabase(), "data/" + participantStore.pid), dataToSave);

    //hide count up component
    await wait(500);
    showCountUp.value = false;

    //show fixation cross for 1000ms
    state.value = "fixation"
    await wait(1000);
    state.value = "listening"

    //play next sound
    play();
}
</script>

<style scoped>
.v-btn {
    text-transform: none;
    font-size: 1.2em;
}
</style>