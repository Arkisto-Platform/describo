<template>
    <div
        class="flex flex-col m-6 p-6 bg-yellow-200"
        v-if="availableTypes.includes(type) && !item.name"
    >
        <el-alert
            title="oops - this isn't working right now!"
            type="error"
            effect="dark"
            v-if="error"
        >
        </el-alert>

        <div class="flex flex-col">
            <div class="text-lg text-gray-700">
                Lookup data of type {{ type }}
            </div>
            <div class="text-base text-gray-600">
                This is a lookup of the data stored internally to Describo; not
                the data within this crate.
            </div>
            <el-autocomplete
                class="w-full"
                v-model="value"
                :trigger-on-focus="false"
                :clearable="true"
                :debounce="500"
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
        this.availableTypes = await this.$store.state.database.getTypes({});
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
                limit: 20,
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
            this.$emit("done");
        },
    },
};
</script>
