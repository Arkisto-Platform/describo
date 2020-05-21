<template>
    <div class="flex flex-row bg-gray-200 px-4">
        <router-link to="/describe">
            <div
                class="text-4xl text-gray-800 font-light hover:text-orange-600 flex flex-row"
            >
                <div class="text-2xl pt-3 mr-2">
                    <i class="fas fa-home"></i>
                </div>
                describo
            </div>
        </router-link>
        <div class="flex-grow"></div>
        <div class="pt-4 text-lg text-indigo-700">
            The tool to describe and package data
        </div>
        <div class="text-gray-700 text-xl hover:text-orange-600 pt-4 ml-4">
            <router-link to="settings">
                <i class="fas fa-cog"></i>
            </router-link>
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

<style lang="scss" scoped></style>
