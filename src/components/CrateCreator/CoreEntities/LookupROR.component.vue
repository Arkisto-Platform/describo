<template>
    <div>
        <el-alert
            title="oops - this isn't working right now!"
            type="error"
            effect="dark"
            v-if="error"
        >
        </el-alert>
        <el-autocomplete
            class="w-full"
            v-model="value"
            v-loading="loading"
            :clearable="true"
            :fetch-suggestions="debouncedLookup"
            placeholder="Lookup organisation by name"
            @select="handleSelect"
            v-if="!error"
        >
            <template slot-scope="{ item }">
                {{ item.name }} ({{ item.links[0] }})
            </template>
        </el-autocomplete>
    </div>
</template>

<script>
import { debounce } from "lodash";
export default {
    data() {
        return {
            error: false,
            loading: false,
            value: undefined,
            debouncedLookup: debounce(this.lookup, 300),
            api: "https://api.ror.org/organizations"
        };
    },
    methods: {
        async lookup(query, cb) {
            if (!query) return cb([]);
            this.loading = true;
            setTimeout(async () => {
                let response = await fetch(`${this.api}?query=${query}`);
                if (response.status !== 200) {
                    this.error = true;
                    // console.log(
                    //     "Looks like there was a problem. Status Code: " +
                    //         response.status
                    // );
                    return;
                }
                let results = await response.json();
                this.loading = false;
                return cb(results.items);
            }, 500);
        },
        handleSelect(selection) {
            this.$emit("selected-organisation", selection);
        }
    }
};
</script>

<style lang="scss" scoped></style>
