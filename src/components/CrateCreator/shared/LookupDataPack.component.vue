<template>
    <div class="flex flex-col" v-if="availableTypes.includes(type)">
        <el-alert
            title="oops - this isn't working right now!"
            type="error"
            effect="dark"
            v-if="error"
        >
        </el-alert>

        <div v-if="!item.name">
            <div class="text-sm text-gray-500">
                Lookup data of type {{ type }}
            </div>
            <el-autocomplete
                class="w-full"
                v-model="value"
                :trigger-on-focus="false"
                :clearable="true"
                :debounce="1000"
                :fetch-suggestions="lookup"
                placeholder=""
                @select="handleSelect"
                v-if="!error"
            >
                <template slot-scope="{ item }">
                    <div class="flex flex-row">
                        <div>{{ item.name }}</div>
                    </div>
                </template>
            </el-autocomplete>
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
    data() {
        return {
            error: false,
            value: undefined,
            availableTypes: [],
        };
    },
    computed: {
        type: function() {
            const container = this.$store.getters.getItemById(this.uuid);
            return container["@type"];
        },
        item: function() {
            return this.$store.getters.getItemById(this.uuid);
        },
    },
    async mounted() {
        this.availableTypes = await this.$store.state.database.getTypes();
    },
    methods: {
        async lookup(query, cb) {
            if (!query) return cb([]);
            this.loading = true;

            const database = this.$store.state.database;
            const results = await database.query({
                "@type": this.type,
                "@id": query,
                name: query,
                description: query,
            });
            return cb(results);
        },
        async handleSelect(selection) {
            const database = this.$store.state.database;
            const itemData = await database.get({ "@id": selection["@id"] });
            const item = this.$store.getters.getItemById(this.uuid);
            this.$store.commit("saveToGraph", {
                ...item,
                ...itemData,
            });
        },
    },
};
</script>
