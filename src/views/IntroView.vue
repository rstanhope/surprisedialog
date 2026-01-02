<template>
    <v-container>
        <h1>Introduction</h1>
        <p>
      Welcome to our study. Please press the "Next" button below to proceed to the consent form and audio setup.
        </p>
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
            participantStore.list = createBlocks(res.data);
            //participantStore.list = res.data;
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

function createBlocks(list){
    let blockedList = [];
    let groupedList = groupBy(list, 'itemType');
    groupedList.presentabsent = shuffle(groupedList.presentabsent);
    groupedList.NPAsubjobj = shuffle(groupedList.NPAsubjobj);
    groupedList.filler = shuffle(groupedList.filler);
    let index16 = 0;
    let index8 = 0
    for(index16=0;index16<16;index16+=2){
        blockedList.push(shuffle([groupedList.presentabsent[index16], groupedList.presentabsent[index16 + 1], groupedList.NPAsubjobj[index8], groupedList.filler[index8]]));
        index8 +=1;
    }
    blockedList = blockedList.flat()
    //console.log(blockedList)
    return blockedList

}

function groupBy(arr, key) {
  return arr.reduce((result, currentValue) => {
    // Get the value of the key for the current object
    const groupKey = currentValue[key];

    // If the key doesn't exist in the result object, create an empty array
    if (!result[groupKey]) {
      result[groupKey] = [];
    }

    // Push the current object to the corresponding group
    result[groupKey].push(currentValue);

    return result;
  }, {});
}

function shuffle(array) {var m = array.length,t,i;
while (m) {i = Math.floor(Math.random() * m--);
t = array[m];
array[m] = array[i];
array[i] = t;
}
return array;
}

</script>