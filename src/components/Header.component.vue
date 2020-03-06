<template>
    <div class="flex flex-row bg-gray-200 px-4">
        <div
            class="cursor-pointer pt-3 mx-4 text-indigo-600"
            @click="$router.push({ path: '/introduction' }).catch(() => {})"
        >
            <i class="fas fa-home fa-2x"></i>
        </div>
        <div class="text-4xl text-orange-800">describo</div>
        <div class="flex-grow"></div>
        <div class="pt-4 text-lg text-indigo-700">
            The tool to describe and package data
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {};
    }
};
</script>

<style lang="scss" scoped></style>
