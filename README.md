# surprisedialog

Surprise Dialog Experiment

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) 
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup (first time only or when new packages have been installed)

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

Launch browser and visit https://localhost:5173?pid=test

The "pid" URL parameter represents the participant's unique identifier

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

### Deployment
```sh
npm run build
firebase login
firebase deploy
```

### Switching between task one and task two
- Edit /src/stores/userParticipantStore.js
  - Task one: Question answer congruence task
  - Task two: Surprise task

``` js
const taskType = ref("t1"); //t1 = task one, t2 = task two
```

- Follow the above steps to compile/minify and deploy to Firebase hosting

### List text file
- The public/list.txt file should be a tab-separated file with 9 columns

| item | sentence | itemType | audio | t1choice1 | t1choice2 | t2image | t2choice1 | t2choice2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| novel | He wrote a novel | critical | novel_absent.mp3 | What did John do? | What did John write? | placeholderimage.png | Oh, you're surprised that he wrote a novel, instead of doing something else? | Oh, you're surprised that he wrote a novel, instead of writing something else? |
| melanie | It's Melanie | filler | ss_melanie2_1_1.mp3 | Who is it? | Is it Madelyn? |  |  | 

- Each row should have a total of 9 columns.
- Values in the "t2" columns can be empty but must have the correct number of spaced tabs to maintain a consistent 9 columns throughout the whole text file.

### EndView.vue
- At the end of the task, participants should be redirected to either a Qualtrics survey (post task survey) or the Prolific completion URL
- Replace the redirect_url variable to point to the approriate URL
``` js
//replace this with Qualtrics survey URL or Prolific completion URL
let redirect_url = "https://www.google.com";
```
