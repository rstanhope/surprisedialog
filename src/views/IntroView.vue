<template>
    <v-container>
        <h1>Introduction</h1>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse minima soluta porro laborum? Doloribus cum
            laborum labore quos, quasi eius repellat optio nostrum debitis suscipit officiis libero tempora, asperiores
            maxime!</p>
        <v-btn @click="next" class="mt-4" color="primary">Next <v-icon>chevron_right</v-icon></v-btn>
    </v-container>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router"
import * as Tone from 'tone';
import Papa from "papaparse";
import { useParticipantStore } from "@/stores/useParticipantStore.js";
import Swal from "sweetalert2";
//import { getDatabase, ref as dbRef, child, get } from "firebase/database";

const participantStore = useParticipantStore();
const router = useRouter();
const route = useRoute();

const nextDisabled = ref(true);

onMounted(async () => {
    window.onbeforeunload = function () {
        return "Are you sure you want to leave?";
    };

    nextDisabled.value = true;
    let errors = [];

    if (route.query.pid != null && route.query.pid != '') {
        participantStore.pid = route.query.pid;
    } else {
        errors.push("Missing Participant ID!");
    }

    //evaluate errors
    if (errors.length > 0) {
        Swal.fire({
            title: errors[0],
            icon: 'error',
            text: 'Please contact experimenter if this problem persists'
        })
        nextDisabled.value = true;
    } else {
        nextDisabled.value = false;
    }
})

const next = async () => {
    Tone.start();

    try {
        let res = await loadLists("list.txt");
        if (res.errors.length > 0) {
            console.log(res);
            throw ("Error loading list file");
        } else {
            participantStore.list = res.data;
        }
    } catch (error) {
        console.log(error);
        Swal.fire({
            title: 'Error',
            icon: 'error',
            text: 'Unable to load list file. Please contact experimenter!'
        })
        return;
    }
    router.push("/consent");
}

const loadLists = (listFile) => {
    return new Promise((resolve, reject) => {
        Papa.parse(listFile, {
            header: true,
            download: true,
            complete: (results) => {
                resolve(results);
            },
            error: () => {
                reject();
            }
        });
    })
}
</script>