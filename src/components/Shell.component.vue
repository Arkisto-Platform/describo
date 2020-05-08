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

export default {
    components: {
        HeaderComponent,
    },
    data() {
        return {};
    },
    mounted() {
        this.$router.push({ path: "/introduction" }).catch(() => {});
    },
};
</script>

<style scoped lang="scss"></style>
