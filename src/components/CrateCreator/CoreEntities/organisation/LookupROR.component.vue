<template>
    <div class="flex flex-col my-4">
        <div class="text-sm text-gray-500">
            Lookup an organisation by name or acronym
        </div>
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
            :trigger-on-focus="false"
            :clearable="true"
            :fetch-suggestions="debouncedLookup"
            placeholder=""
            @select="handleSelect"
            v-if="!error"
        >
            <template slot-scope="{ item }">
                <div class="flex flex-row">
                    <div>{{ item.name }}, {{ item.country.country_name }}</div>
                    <div class="mx-2 text-xs">({{ item.links[0] }})</div>
                </div>
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
            debouncedLookup: debounce(this.lookup, 800),
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
            this.$emit("selected-organisation", {
                uuid: selection.id,
                ...selection
            });
        }
    }
};
</script>

<style lang="scss" scoped></style>
