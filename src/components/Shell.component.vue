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
        })();
    },
};
</script>

<style scoped lang="scss"></style>
