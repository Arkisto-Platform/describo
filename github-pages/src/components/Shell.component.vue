<template>
    <div class="mb-10">
        <navigation-component class="mt-6" />
        <header-component class="mt-4" />
        <about-component class="mt-6" />
        <releases-component class="mt-6 md:mt-10 hidden lg:block" />
        <footer-component class="mt-6" />
    </div>
</template>

<script>
import NavigationComponent from "./Navigation.component.vue";
import HeaderComponent from "./Header.component.vue";
import AboutComponent from "./About.component.vue";
import ReleasesComponent from "./Releases.component.vue";
import FooterComponent from "./Footer.component.vue";
export default {
    components: {
        NavigationComponent,
        HeaderComponent,
        AboutComponent,
        ReleasesComponent,
        FooterComponent,
    },
    data() {
        return {};
    },
};
</script>
