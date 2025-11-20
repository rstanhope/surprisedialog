<template>
    <v-container>
        <h2>Thank you!</h2>
        <p class="mb-4 mt-2">Please click the button below to proceed to the final segment of this experiment.</p>
        <v-btn @click="next" color="blue-grey">Next <v-icon>chevron_right</v-icon></v-btn>
    </v-container>
</template>

<script setup>
import { useParticipantStore } from "@/stores/useParticipantStore.js";

const participantStore = useParticipantStore();

//redirect to your Qualtrics URL or Prolific completion URL here
let redirect_url = "https://www.google.com";


const next = () => {
    window.onbeforeunload = null;

    //this section is only needed if we're redirecting to Qualtrics
    redirect_url += "?pid=" + participantStore.pid
    window.location.replace(redirect_url);
}

</script>
