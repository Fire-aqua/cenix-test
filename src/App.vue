<template>
  <v-app>
    <v-main class="app-style">
      <v-container class="app-style__main">
        <v-text-field
            v-model="filterModel"
            label="Поиск"
            clearable
            class="mb-4 app-style__form"
        />
        <div class="app-style__posts">
          <v-card 
            v-for="([key, post]) in postsFiltered" 
            :key="key" 
            class="m-4 app-style__post"
            :title="key"
            :text="post"
          >
            <template v-slot:actions>
              <v-btn 
                @click="edit(key)" 
                class="mr-4" 
                color="light-blue-darken-2"
              >
                Редактировать
              </v-btn>
              <v-btn @click="remove(key)" color="light-blue-darken-4">
                Удалить
              </v-btn>
            </template>
          </v-card>
        </div>
        <v-btn 
          @click="dialog = true" 
          class="mt-4" 
          size="large" 
          color="light-blue-darken-2" 
        >
          Добавить пост
        </v-btn>
      </v-container>
      
      <v-dialog v-model="dialog" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">Пост</span>
          </v-card-title>
          <v-card-text>
            <v-text-field label="Текст поста" required v-model="name"/>
          </v-card-text>
          <v-card-actions>
            <v-btn color="blue darken-1" flat @click="close">
              Закрыть
            </v-btn>
            <v-btn color="blue darken-1" flat @click="save" :disabled="!name">
              Сохранить
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch, onBeforeMount } from 'vue'
import json from './assets/posts.json'
import { dataStore } from '../store/dataStore';

let posts = reactive(new Map);
onBeforeMount(() => {
  if (store.data.size) {
    posts = store.data;
  } else {
    json.posts.forEach(element => {
      posts.set(element.id, element.name)
    })
  }
})
const store = dataStore();
watch(posts, () => { store.setData(posts) })

const filterModel = ref('');
const postsFiltered = computed(() => {
  return filterModel.value 
  ? reactive(new Map([...posts]
      .filter(([key]) => key.includes(filterModel.value) )
    ))
  : posts
})
watch(filterModel, () => { localStorage.setItem("filterModel", filterModel.value ) })
onMounted(() => { filterModel.value = localStorage.getItem("filterModel") ?? '' })

const dialog = ref(false)
watch(dialog, () => { localStorage.setItem("dialog", dialog.value ? '1' : '') })
onMounted(() => { dialog.value = !!localStorage.getItem("dialog") })

const name = ref('')
watch(name, () => { localStorage.setItem("name", name.value) })
onMounted(() => { name.value = localStorage.getItem("name") })

const postKey = ref('')
watch(postKey, () => { localStorage.setItem("postKey", postKey.value) })
onMounted(() => { postKey.value = localStorage.getItem("postKey") })

function close() {
  dialog.value = false
  postKey.value = ''
  name.value = ''
}

function edit(key) {
  postKey.value = key
  name.value = posts.get(key)
  dialog.value = true
}

function save() {
  if (postKey.value) {
    posts.set(postKey.value, name.value)
  } else {
    posts.set(Math.random().toString(24).slice(2), name.value)
  }
  close();
}

function remove(key) {
  posts.delete(key)
}
</script>

<style lang="less">
.app-style {
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 16px;
  background: dodgerblue;

  &__main {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 800px;
    max-height: calc(100vh - 32px);
    padding: 16px;
    background: white;
    border-radius: 4px;
  }

  &__posts {
    overflow-y: scroll;

    &::-webkit-scrollbar {
      width: 8px;
    }
    &::-webkit-scrollbar-thumb {
      background: dodgerblue; 
      border-radius: 10px;

      &:hover {
        background: deepskyblue; 
      }
    }
  }

  &__post {
    margin: 16px 16px 16px 1px;
    transition: background 0.3s ease-in-out;

    &:hover {
      background: lightskyblue;
    }
  }

  &__form {
    max-height: 56px;
  }
}
</style>
