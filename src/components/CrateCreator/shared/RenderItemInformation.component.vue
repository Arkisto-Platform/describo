<template>
    <div class="flex flex-col space-y-1">
        <div class="text-gray-600 text-xs">
            {{ item["@type"] }}
        </div>
        <div class="text-gray-800">
            {{ item.name }}
        </div>
    </div>
</template>

<script>
export default {
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
