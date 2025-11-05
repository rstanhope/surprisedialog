<template>
    <v-container>
        <h2>Audio Test</h2>
        <p>
            You must be in a quiet space and wear headphones/earbuds. Good quality headphones/earbuds are recommended.
            Please use Firefox, Safari, or Chrome as your web browser.
        </p>
        <p>
            To test the audio, click the button below “PLAY TEST SOUND”. Please adjust the volume of your computer audio to
            the most audible and comfortable level.
        </p>

        <v-btn color="blue-grey" @click="playTestSound" class="mt-4">
            <span v-if="isPlaying == false">
                Play Test Sound <v-icon>play_circle_filled</v-icon>
            </span>
            <span v-else> Stop Test Sound <v-icon>stop</v-icon> </span>
        </v-btn>

        <p class="mt-10">
            If you hear the sound with appropriate volume, click "NEXT" and proceed.
        </p>
        <v-btn color="primary" @click="success()" class="mr-4" :disabled="played == false">
            Next <v-icon>chevron_right</v-icon>
        </v-btn>
    </v-container>
</template>
  
<script setup>
import { ref, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import UsePlaySound from "@/composables/UsePlaySound.js";
import Swal from "sweetalert2";

const router = useRouter();

onUnmounted(() => {
    try {
        stopSound();
    } catch {
        console.log("unable to stop sound");
    }

})

const { playSoundAsync, isPlaying, stopSound } = UsePlaySound();
const played = ref(false);
const playTestSound = async () => {
    if (isPlaying.value == true) {
        stopSound();
    } else {
        played.value = true;
        try {
            await playSoundAsync("/testAudio/test_audio.mp3");
        } catch (error) {
            console.log(error)
            Swal.fire({
                title: 'Could not load audio',
                icon: 'warning',
                text: 'Please contact the experimenter if this problem persists'
            })
        }
    }
}

const success = () => {
    stopSound();
    router.push("/micTest")
}

</script>


<style scoped>
p {
    margin-bottom: 16px
}
</style>