<template>
    <v-container>
        <h2>Mic Test</h2>
        <p>
            Speak naturally and adjust your microphone input levels so that the black
            bar below extends into the green area.
        </p>
        <p>
            If needed, increase the recording level in your microphone settings so the
            black bar reaches into the green region for most if not all of your
            utterance. Try lowering the recording level if the black bar stays at the
            far right end of the green region for most or all of your utterance.
        </p>
        <p>
            If you are unable to access your microphone, or if the volume meter below
            is not responding, refresh your browser and select "Allow" when prompted for permissions to use your
            microphone
        </p>
        <p>
            Click on the buttons below for instructions on adjusting your microphone
            levels to obtain an optimal signal.
        </p>
        <div class="d-flex mt-2">
            <v-btn color="red lighten-2" dark text x-large @click="dialog = true">Windows</v-btn>
            <v-btn class="ml-2" color="red lighten-2" text dark x-large @click="dialog2 = true">Mac OSX</v-btn>
        </div>
        <v-dialog v-model="dialog" width="500">
            <v-card>
                <v-card-title class="headline grey lighten-2" primary-title>Windows Microphone Settings</v-card-title>
                <v-card-text>
                    <ul class="mt-5">
                        <li>
                            Type "control panel" in the search box on the taskbar and then
                            select Control Panel option
                        </li>
                        <li>Click on the "Sound" option.</li>
                        <li>On the Hardware and Sound window, select the Sound option.</li>
                        <li>
                            Select the "Recording" tab. A list of recording devices are
                            displayed. Right click on the microphone you are using to audio
                            and then click on the Properties option.
                        </li>
                        <li>
                            Select the "Level" tab. Adjust the microphone level accordingly.
                        </li>
                    </ul>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text @click="dialog = false">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialog2" width="500">
            <v-card>
                <v-card-title class="headline grey lighten-2" primary-title>Macintosh Settings</v-card-title>
                <v-card-text>
                    <ul class="mt-5">
                        <li>Launch the "System Preferences" app.</li>
                        <li>Select "Sound", then select the "Input" tab.</li>
                        <li>Select your microphone from the device list.</li>
                        <li>Adjust the "Input Volume" slider accordingly.</li>
                    </ul>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text @click="dialog2 = false">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <div style="width: 100%; height:20px;background-color: gainsboro;margin-top:10px">
            <div class="level" :style="{ width: volume + '%' }"></div>
        </div>
        <div class="d-flex">
        <div style="width: 50%; height:6px;background-color: orange;margin-top:2px"></div>
        <div style="width: 50%; height:6px;background-color: green;margin-top:2px;margin-left:4px;"></div>
        </div>
        <v-btn class="mt-6" color="primary" @click="toTask">Next <v-icon>chevron_right</v-icon></v-btn>
    </v-container>
</template>

<script setup>
import UseMeter from '@/composables/UseMeter';
import { onMounted, onUnmounted, ref } from 'vue';
import { useParticipantStore } from "@/stores/useParticipantStore.js";
import {useRouter} from "vue-router"

const { startMeter, stopMeter, volume } = UseMeter();

const dialog = ref(false);
const dialog2 = ref(false);
const participantStore = useParticipantStore();
const router = useRouter();

onMounted(() => {
    startMeter();
})

onUnmounted(() => {
    stopMeter();
})


const toTask = () => {
    router.push("/" + participantStore.taskType)
}
</script>

<style scoped>
p {
    margin-top: 10px;
}

.level {
    height: 100%;
    background-color: black;
    transition: width 0.1s ease-out;
}
</style>