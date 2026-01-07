<template>
    <v-container>
        <h1>Introduction</h1>
        <p>
            Welcome to our study. Please press the "Next" button below to proceed to the consent form and audio setup.
        </p>
        <v-data-table multi-sort="" items-per-page="50" density="compact" v-if="participantStore.list !== null" :items="participantStore.list">
            <template v-slot:[`item.t2dialog`]="{ value }">
                <p class="text-truncate" style="max-width: 100px;">{{value }}</p>
            </template>
        </v-data-table>
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

    //clear participantStore.list
    participantStore.list = null
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

    //router.push("/consent");
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

function createBlocks(list) {
    let blockedList = [];
    let groupedList = groupBy(list, 'itemType');
    
    let groupedPa = groupBy(groupedList.presentabsent, "item");
    groupedList.filler = shuffle(groupedList.filler);
    let index = 0;
    let fillerIndex = 0;
    for (index = 0; index < 4; index += 1) {

        //select presentabsent items
        let block = [];
        Object.values(groupedPa).forEach(item => {
            block.push(item[index % 4]);
        });
        //blockedList.push(selectedPas)

        //select NPAsubject items
        if (index % 4 === 0 || index % 4 === 1) {
            block.push(
                groupedList.NPAsubjobj.filter((el) => el.item == "lily")[index % 2],
                groupedList.NPAsubjobj.filter((el) => el.item == "manny")[index % 2],
            );
        } else {
            block.push(
                groupedList.NPAsubjobj.filter((el) => el.item == "mary")[index % 2],
                groupedList.NPAsubjobj.filter((el) => el.item == "molly")[index % 2],
            );
        }


        //select fillters
        block.push(
            groupedList.filler[fillerIndex],
            groupedList.filler[fillerIndex + 1],
        );
        fillerIndex += 2;

        blockedList.push(block)

    }
    
    //shuffle blocks
    for(let b=0;b<blockedList.length;b++){
        blockedList[b] = shuffle(blockedList[b]);
        console.log(blockedList[b]);
    }
    
    //check for overlapping items between blocks
    for(let b=0;b<blockedList.length - 1;b++){
        let currentBlock = blockedList[b]; 
        let nextBlock = blockedList[b + 1]; 
        while(currentBlock[currentBlock.length - 1].item == nextBlock[0].item){
            console.log("overlaps found, reshuffling...");
            blockedList[b] = shuffle(blockedList[b]);
        }
    }
    blockedList = blockedList.flat()
    return blockedList
}

function groupBy(arr, key) {
    let groupArr = arr.reduce((result, currentValue) => {
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

    Object.keys(groupArr).forEach(key => {
        groupArr[key] = shuffle(groupArr[key]);
    })

    return groupArr;
}

function shuffle(array) {
    var m = array.length, t, i;
    while (m) {
        i = Math.floor(Math.random() * m--);
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }
    return array;
}

</script>