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
          <v-btn variant="elevated" color="primary" class="mx-2"
                 @click="save">
            Add
          </v-btn>
          <v-btn class="mx-2" variant="text" @click="$emit('cancel')">
            cancel
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script setup lang="ts">
import {PropType, reactive, ref} from "vue";
import {Member} from "../interfaces/member";

const valid = ref(false);
const emit = defineEmits(['created', 'cancel']);
const props = defineProps({
  member: {
    type: Object as PropType<Member>,
  }
})

const member: Member = reactive({...props.member} as Member);
const image = ref<any[]>([]);
const rules = [
  (v: string) => !!v || 'Field is required'
]

const save = () => {
  const selectedImage = image.value && image.value.length ? image.value[0] : member.image
  emit('created', {...member, image: selectedImage})
}
</script>

<style scoped>

</style>
