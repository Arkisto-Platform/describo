<template>
    <div class="flex flex-col space-y-1">
        <div class="text-gray-600 text-sm flex flex-row text-orange-600">
            <type-icon-component :type="item['@type']" class="mr-2" />
            {{ item["@type"] }}
        </div>
        <div class="text-gray-800">
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
