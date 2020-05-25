<template>
    <div
        class="flex"
        :class="{
            'flex-row space-x-2': compact,
            'flex-col space-y-1': !compact,
        }"
    >
        <div
            class="flex flex-row text-sm font-light text-gray-600"
            :class="{
                'pt-1': !compact,
            }"
        >
            <type-icon-component :type="item['@type']" class="mr-1" />
            {{ item["@type"] }}
        </div>
        <div class="text-gray-800 text-xl">
            <span v-if="['File', 'Dataset'].includes(item['@type'])">{{
                item.uuid
            }}</span>
            <span v-else-if="item['@type'] === 'PropertyValue'">
                {{ item.name }}: {{ item.value }}
            </span>
            <span v-else>
                <span v-if="item.name">{{ item.name }}</span>
                <span v-else>{{ item["@id"] }}</span>
            </span>
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
        compact: {
            type: Boolean,
            default: false,
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
