import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useParticipantStore = defineStore('participantStore', () => {
  const list = ref(null)
  const pid = ref(null)
  const index = ref(0)
  const taskType = ref("t2"); //t1 = Question-answer congruence task, t2 = Surprise task

  return { list, pid, index, taskType}
}, {
  persist: true
})
