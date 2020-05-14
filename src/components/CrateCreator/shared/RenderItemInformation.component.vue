<template>
    <div class="flex flex-col space-y-1">
        <div class="flex flex-row text-sm font-light text-gray-600 pt-1">
            <type-icon-component :type="item['@type']" class="mr-1" />
            {{ item["@type"] }}
        </div>
        <div class="text-gray-800 text-xl">
            {{ item.name }}
        </div>
    </div>
</template>

<script>
import TypeIconComponent from "components/CrateCreator/TypeIcon.component.vue";

export default {
    components: {
        TypeIconComponent,
    },
    props: {
        uuid: {
            type: String,
            required: true,
        },
    },
    computed: {
        item: function() {
            return this.$store.getters.getItemById(this.uuid);
        },
    },
    data() {
        return {};
    },
};
</script>
