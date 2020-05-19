<template>
    <div class="mb-10">
        <header-component class="mt-4" />
        <features-link-component class="block md:hidden" />
        <header-images-component />
        <features-link-component class="hidden md:block" />
        <about-component class="mt-6" />
        <releases-component class="mt-6 md:mt-10 hidden lg:block" />
    </div>
</template>

<script>
import HeaderComponent from "./Header.component.vue";
import HeaderImagesComponent from "./HeaderImages.component.vue";
import AboutComponent from "./About.component.vue";
import ReleasesComponent from "./Releases.component.vue";
import FeaturesLinkComponent from "./FeaturesLink.component.vue";
export default {
    components: {
        HeaderComponent,
        HeaderImagesComponent,
        AboutComponent,
        ReleasesComponent,
        FeaturesLinkComponent,
    },
    data() {
        return {};
    },
};
</script>
