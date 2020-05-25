<template>
    <div
        class="flex flex-row my-1 hover:text-orange-600"
        :class="{ 'text-2xl text-orange-600': selected }"
    >
        <type-icon-component :type="type" class="mr-2 w-6 text-center" />
        <div>
            {{ type }}
        </div>
    </div>
</template>

<script>
import TypeIconComponent from "./TypeIcon.component.vue";

export default {
    components: {
        TypeIconComponent,
    },
    props: {
        type: {
            type: String,
            required: true,
        },
        selected: {
            type: Boolean,
            required: true,
        },
    },
    data() {
        return {};
    },
};
</script>
