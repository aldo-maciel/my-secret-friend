<template>
  <v-form v-model="valid">
    <v-container>
      <v-row>
        <v-col
            cols="12"
            md="4"
        >
          <v-text-field
              v-model="member.name"
              type="text"
              :rules="rules"
              label="Name"
              required
          ></v-text-field>
        </v-col>

        <v-col
            cols="12"
            md="4"
        >
          <v-text-field
              v-model="member.phone"
              :rules="rules"
              type="text"
              label="Phone"
          ></v-text-field>
        </v-col>

        <v-col
            cols="12"
            md="4"
        >
          <v-file-input
              accept="image/*"
              v-model="image"
              label="Avatar"
          ></v-file-input>
        </v-col>
      </v-row>

      <v-row>
        <v-col
            cols="12"
            class="flex justify-end"
        >
          <v-btn variant="elevated" color="primary" class="mx-2" @click="$emit('created', {...member, image: image[0]})">
            Add
          </v-btn>
          <v-btn class="mx-2" variant="text">
            cancel
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script setup lang="ts">
import {reactive} from "vue";
import {Member} from "../interfaces/member";

const valid = false;

const member: Member = reactive({} as Member);
let image = reactive([]);
const rules = [
  (v: string) => !!v || 'Field is required'
]
</script>

<style scoped>

</style>
