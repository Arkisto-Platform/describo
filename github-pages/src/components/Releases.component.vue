<template>
    <div class="flex flex-col">
        <div class="flex flex-col" v-if="release">
            <div class="md:text-3xl text-center">
                Download Describo for your platform and start describing your
                data.
                <div class="text-sm">
                    Describo is an application designed for your desktop so it
                    won't work on your phone or tablet.
                </div>
            </div>
            <div class="mt-10 flex flex-row justify-around">
                <div class="hover:text-orange-600">
                    <a :href="releaseUrl('windows')">
                        <i class="fab fa-windows fa-6x"></i>
                    </a>
                </div>
                <div class="hover:text-orange-600">
                    <a :href="releaseUrl('mac')">
                        <i class="fab fa-apple fa-6x"></i>
                    </a>
                </div>
                <div class="hover:text-orange-600">
                    <a :href="releaseUrl('linux')">
                        <i class="fab fa-linux fa-6x"></i>
                    </a>
                </div>
            </div>
            <div>Latest release: {{ release.name }}</div>
        </div>
        <div class="mt-6 text-base text-center">
            <div>
                Check out available releases @
                <a
                    href="https://github.com/UTS-eResearch/describo/releases"
                    target="_blank"
                    class="text-orange-600"
                    >https://github.com/UTS-eResearch/describo/releases</a
                >
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            release: {},
            latestReleaseURL:
                "https://api.github.com/repos/uts-eresearch/describo/releases/latest",
        };
    },
    async mounted() {
        try {
            let response = await fetch(this.latestReleaseURL);
            if (response.status !== 200) {
                return;
            }
            this.release = await response.json();
        } catch (error) {
            this.release = undefined;
        }
    },
    methods: {
        releaseUrl: function(platform) {
            switch (platform) {
                case "windows":
                    return `https://github.com/UTS-eResearch/describo/releases/download/${this.release.tag_name}/Describo-Setup-${this.release.name}.exe`;
                    break;
                case "mac":
                    return `https://github.com/UTS-eResearch/describo/releases/download/${this.release.tag_name}/Describo-${this.release.name}.dmg`;
                    break;
                case "linux":
                    return `https://github.com/UTS-eResearch/describo/releases/download/${this.release.tag_name}/Describo-${this.release.name}.tar.bz2`;
                    break;
            }
        },
    },
};
</script>
