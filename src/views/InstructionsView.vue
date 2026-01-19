<template>
    <v-container>
        <h1>Instructions</h1>  <!-- t2 instructions -->
        <div class="d-flex flex-column">
            <!--
            <p style="padding-bottom:10px"> In this experiment, you will listen to sentences and make judgments about whether
            or not the speaker is surprised, and if so, what they are surprised about, based on the way they said a sentence. </p>

            <p style="padding-bottom:10px"> On each trial, you will read 2-3 sentences describing a situation. Then, you will 
            listen to a recorded utterance telling you what happened in that situation. After listening to the recording,
            you will be asked to rate how surprised the speaker sounds by clicking a button on the screen. On some trials, you will
            also be asked to choose a response to the sentence you just heard. We want to know which response you think fits best, 
            based on the way the speaker said the sentence. For each part of this task, we want to know your first impression,
            so you should respond quickly. </p>
            -->

            <!-- t1 instructions -->
            <p style="padding-bottom:10px"> In this experiment, you will listen to sentences and choose the question you think
            the speaker was responding to, based on the way they said the sentence. </p>

            <p style="padding-bottom:10px"> On each trial, you hear a recorded sentence. After you listen to the recording,
            you will see two questions written on the screen. You will click a button to indicate which question you think the
            speaker was answering. We want to know your first impression, so you should respond quickly. </p>

            <p style="padding-bottom:10px"> After each trial, you will see a number on the screen. You will count up aloud by 2s starting
            from the number on the screen until the number disappears. For example, if you see 18, you would say "20, 22, 24..." </p>
            
            <p>Click 'NEXT' when you are ready to proceed. </p>
        </div>
        <v-btn class="mt-4" color="primary" @click="toTask">next <v-icon>chevron_right</v-icon></v-btn>
        
    </v-container>
</template>

<script setup>
    import { useParticipantStore } from "@/stores/useParticipantStore.js";
    import { useRouter } from "vue-router";
    
    const participantStore = useParticipantStore();
    const router = useRouter();
    const toTask = () => {
    router.push("/" + participantStore.taskType)
}
</script>