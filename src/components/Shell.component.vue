<template>
    <div class="flex flex-col">
        <header-component />
        <div class="m-1">
            <router-view />
        </div>
    </div>
</template>

<script>
import HeaderComponent from "./Header.component.vue";
import { Database } from "describo-data-service";

import Store from "electron-store";
const store = new Store({ name: "describo-state" });

export default {
    components: {
        HeaderComponent,
    },
    data() {
        return {};
    },
    mounted() {
        this.$router.push({ path: "/describe" }).catch(() => {});

        (async () => {
            const database = new Database({
                databaseFile: this.$store.state.databaseFile,
            });
            await database.connect();
            this.$store.commit("saveDatabaseHandle", { database });
            const disableOnboarding = store.get("disableOnboarding");
            if (!disableOnboarding) {
                this.$router.push({ path: "/onboarding" });
            }
        })();
    },
};
</script>

<style scoped lang="scss"></style>
