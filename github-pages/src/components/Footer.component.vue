<template>
    <div class="flex flex-row space-y-1 border-t-2 justify-around">
        <div class="mr-4">
            <a href="https://uts.edu.au" target="_blank">
                <img src="images/logo.svg" />
            </a>
        </div>
        <div class="hidden md:block flex-grow"></div>
        <div class="flex flex-row space-x-8">
            <div class="flex flex-col md:flex-row md:space-x-8">
                <div>
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
            </div>
            <div class="flex flex-col md:flex-row md:space-x-8">
                <div>
                    <a
                        href="https://github.com/UTS-eResearch/describo"
                        class="hover:text-orange-600"
                        ><i class="fab fa-github"></i> github</a
                    >
                </div>
                <div>
                    <a
                        href="https://github.com/UTS-eResearch/describo/issues"
                        class="hover:text-orange-600"
                        >issues</a
                    >
                </div>
            </div>
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
