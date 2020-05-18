<template>
    <div class="flex flex-row space-x-8">
        <a href="https://uts.edu.au" target="_blank">
            <img src="images/logo.svg" />
        </a>
        <div class="flex-grow"></div>
        <div class="hidden md:block">
            <a
                href="https://github.com/UTS-eResearch/describo/wiki"
                class="hover:text-orange-600"
                >docs</a
            >
        </div>
        <div>
            <a
                href="https://github.com/UTS-eResearch/describo/wiki/About"
                class="hover:text-orange-600"
                >about</a
            >
        </div>
        <div>
            <a
                href="https://github.com/UTS-eResearch/describo"
                class="hover:text-orange-600"
                ><i class="fab fa-github"></i> github</a
            >
        </div>
        <div class="hidden md:block">
            <a
                href="https://github.com/UTS-eResearch/describo/issues"
                class="hover:text-orange-600"
                >issues</a
            >
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {};
    },
};
</script>
