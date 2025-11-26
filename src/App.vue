<template>
  <div class="container mx-auto min-h-screen">
    <div class="flex flex-col flex-1 shadow-xl rounded p-4 min-h-full">
      <div class="flex align-center relative">
        <h1 class="text-2xl font-semibold text-center flex-1">My Secret Friend</h1>
        <span class="gg-add-r scale-150 m-2 cursor-pointer absolute right-0" title="Add new" @click="addNew"></span>
      </div>

      <create v-if="attrs.isAdding" @created="addMember($event)" :member="attrs.edition" @cancel="cancel"/>

      <v-divider class="my-2"/>

      <section class="my-2 py-2">
        <v-icon aria-hidden="false">
          mdi-account
        </v-icon>
        <div class="grid grid-cols-4 gap-8" v-if="members.length">
          <v-card v-for="(it, index) in members" :key="it.name">
            <v-img
                height="200"
                :src="`${url}/${it.image}`"
                cover
                class="text-white"
                crossorigin="anonymous"
            >
              <v-toolbar
                  color="rgba(0, 0, 0, 0)"
                  theme="dark"
                  class="bg-indigo-600 bg-opacity-30"
              >
                <template v-slot:prepend>
                  <span
                      class="gg-trash-empty scale-150 mx-3 cursor-pointer"
                      title="Remove from list"
                      @click="remove(index)"
                  ></span>
                  <span
                    class="gg-pen mx-3 cursor-pointer"
                    title="Edit"
                    @click="edit(it)"
                  ></span>
                </template>

                <template v-slot:append>
                  <span class="gg-mail-forward scale-150 mx-3 cursor-pointer" title="Send Friend"
                        @click="send(it)"></span>
                </template>
              </v-toolbar>
            </v-img>
            <v-card-title class="text-center">{{ it.name }}</v-card-title>
          </v-card>
        </div>
        <div v-else class="text-center">
          No Items
        </div>
      </section>
    </div>
    <div
        class="absolute shadow-2xl rounded-full bg-black bottom-32 right-4 w-12 h-12 flex justify-center items-center"
        @click="sort">
      <span class="gg-sort-az scale-150 cursor-pointer"></span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue'
import {Member} from "./interfaces/member";
import Create from "./components/create.vue";

// attrs
let members: Member[] = reactive(JSON.parse(localStorage.getItem('members') || '[]'));

let attrs = reactive({
  isAdding: false,
  edition: {} as Member
})

const url = ref(window.location.origin)

// funcs
const addNew = () => attrs.isAdding = true;
const edit = (member: Member) => {
  attrs.edition = member;
  attrs.isAdding = true;
}

const cancel = () => {
  attrs.edition = {} as Member;
  attrs.isAdding = false;
}

const addMember = async (member: Member) => {
  attrs.isAdding = false;

  if (member.image && member.image !== attrs.edition.image) {
    const data = new FormData();
    data.append('file', member.image);

    const res = await fetch(`${ location.origin }/friend/upload`, {
      body: data,
      method: "POST"
    })
    member.image = await res.text();
    attrs.edition.image = member.image;
  }

  if (attrs.edition.name) {
    const find = members.find(it => it.name === attrs.edition.name);
    if (find) {
      find.name = attrs.edition.name;
      find.image = attrs.edition.image;
      find.phone = attrs.edition.phone;
    }
  } else {
    members.push(member);
  }
  localStorage.setItem('members', JSON.stringify(members));
  attrs.edition = {} as Member;
}

const remove = (index: number) => {
  members.splice(index, 1);
  localStorage.setItem('members', JSON.stringify(members));
}

const send = async (member: Member) => {
  const sortedList = JSON.parse(localStorage.getItem('sortedList') || '{}');
  console.log(sortedList[member.name])
  const res = await fetch(`${location.origin}/friend`, {
    body: JSON.stringify(sortedList[member.name]),
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const link = await res.text();
  console.log(`${location.origin}/friend/${link}`)

  window.open(`https://whatsa.me/${member.phone}/?t=Abra o link para ver seu amigo: ${location.origin}/friend/${link}`, 'blank')
}

const getRandom = (current: Member): Member => {
  const list = members.filter(it => !it.isFriend && current.name !== it.name);
  const index = Math.round(Math.random() * list.length)
  const member = list.at(index);

  if (!member) {
    return getRandom(current);
  }

  return member;
}

const sort = () => {
  members.forEach(it => it.isFriend = false);
  localStorage.setItem('sortedList', JSON.stringify(members.reduce((sorted, member, currentIndex) => {
    if (!sorted[member.name]) {
      const random = getRandom(member);
      if (random) {
        random.isFriend = true
      }
      sorted[member.name] = random;
    }

    return sorted;
  }, {} as Record<string, any>)));
}
</script>

<style scoped>
</style>
