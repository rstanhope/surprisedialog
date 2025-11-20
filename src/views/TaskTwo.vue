<template>
    <v-container>
        <h1 class="text-center" v-if="state == 'fixation'">+</h1>
        <div class="d-flex flex-column align-center justify-center" v-if="state == 'listening'">
            <div class="bubble" v-if="currentItem.t2image">
                <v-img :src="'images/' + currentItem.t2image" min-width="600px" max-width="600px" class="ml-auto mr-auto"></v-img>
            </div>
            <div>
                <h3 class="mt-4 font-weight-thin text-medium-emphasis font-italic">Please listen...</h3>
            </div>
        </div>

        <div class="text-center" v-if="state == 'responding'">
            <h3>
                How surprised does the speaker sound?
            </h3>

            <div class="d-flex justify-center align-center mt-4">
                <p class="mr-2">Not Surprised (1)</p>
                <div>
                    <v-radio-group color="purple-darken-2" inline="" hide-details="" v-model="response">
                        <v-radio value="1"></v-radio>
                        <v-radio value="2"></v-radio>
                        <v-radio value="3"></v-radio>
                        <v-radio value="4"></v-radio>
                        <v-radio value="5"></v-radio>
                        <v-radio value="6"></v-radio>
                    </v-radio-group>
                </div>
                <p class="ml-2">Very Surprised (6)</p>
            </div>
            <div class="d-flex justify-center mt-4">
                <v-btn color="primary" @click="onSubmitResponseClick" :disabled="response == null">Next
                    <v-icon>chevron_right</v-icon></v-btn>
            </div>


        </div>
        <div class="d-flex flex-column align-center" v-if="state == 'followup'">
            <h3>How would you respond to this statement?</h3>
            <v-btn @click="onSubmitFollowupResponseClick(1)" min-height="48px" height="auto"
                class="mt-4 pa-2 response-btn" block="" color="purple-darken-2">{{ currentItem.t2choice1 }}</v-btn>
            <v-btn @click="onSubmitFollowupResponseClick(2)" min-height="48px" height="auto"
                class="mt-2 pa-2 response-btn" block="" color="purple-darken-2">{{ currentItem.t2choice2 }}</v-btn>
        </div>

        <div class="d-flex justify-center mt-4">
            {{ participantStore.index + 1 }} of {{ participantStore.list.length }}
        </div>
    </v-container>
    <v-dialog v-model="showCountUp" fullscreen="" persistent="" transition="none">
        <CountUpComponent v-if="showCountUp" @end-count="endCount"></CountUpComponent>
    </v-dialog>
</template>

<script setup>
import { computed, onMounted, ref, toRaw } from 'vue';
import { useParticipantStore } from "@/stores/useParticipantStore.js";
import UsePlaySound from "@/composables/UsePlaySound.js";
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router'
import UseWait from '@/composables/UseWait';
import CountUpComponent from '@/components/CountUpComponent.vue';
import { getDatabase, ref as dbRef, serverTimestamp, push } from "firebase/database";

const participantStore = useParticipantStore();
const { playSoundAsync } = UsePlaySound();
const state = ref("listening");// listening, responding, followup
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

const response = ref(null);
let dataToSave
const onSubmitResponseClick = async () => {
    dataToSave = structuredClone(toRaw(currentItem.value)) //{ ...currentItem.value };
    dataToSave.response = response.value;
    dataToSave.timestamp = serverTimestamp();
    dataToSave.pid = participantStore.pid;
    //console.log(response.value);
    if (response.value > 1 && currentItem.value.t2choice1 != '') {
        state.value = "followup";
    } else {
        response.value = null;
        nextItem();
    }
}

const onSubmitFollowupResponseClick = (followUpResponse) => {
    //TODO: save follow up response to Firebase
    dataToSave.followUpResponse = followUpResponse;
    //console.log(followUpResponse);

    //clear out radio buttons
    response.value = null;

    //get next item in the list
    nextItem();

}

const nextItem = async () => {
    participantStore.index += 1;
    if (participantStore.index >= participantStore.list.length) {
        router.push("/end")
    } else {
        showCountUp.value = true;
    }
}

const endCount = async (speechDetected) => {
    //TODO: save speechDetected boolean to Firebase
    console.log("speech detected?",speechDetected);
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

const play = async () => {
    await playSoundAsync("audio/" + currentItem.value.audio)
    state.value = "responding"
}

</script>

<style scoped>
.response-btn {
    text-transform: none;
    font-size: 1.2em;
}

.v-btn__content {
    white-space: normal;
}

.bubble {
    width: 600px;
    position: relative;
    background: gainsboro;
    text-align: center;
    width: auto;
    height: auto;
    border-radius: 10px;
    padding: 10px;
}

.bubble:after {
    content: '';
    position: absolute;
    display: block;
    width: 0;
    z-index: 1;
    border-style: solid;
    border-width: 0 20px 20px 0;
    border-color: transparent gainsboro transparent transparent;
    top: 50%;
    left: -20px;
    margin-top: -10px;
}
</style>