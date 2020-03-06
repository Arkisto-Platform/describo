<template>
    <div class="flex flex-col justify-around style-introduction text-xl">
        <p class="text-3xl">Welcome to describo!</p>
        <p>
            Describo is a tool to create and update Research Object Crates
            (RO-Crate).
        </p>
        <p>
            You have some data and you wish to describe it in a standard way
            such that others can discover and use it. Describo is the tool for
            the job!
        </p>
        <p>
            Get started by creating a new Research Object crate or loading an
            existing one.
        </p>
        <div class="flex flex-row justify-around mt-6">
            <div class="flex flex-col w-64 text-center">
                <div
                    @click="$router.push({ path: '/describe' })"
                    class="cursor-pointer bg-gray-200 px-8 py-12 rounded-lg text-3xl hover:bg-orange-400"
                >
                    Get Started!
                </div>
            </div>
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

<style lang="scss" scoped>
.style-introduction {
    height: 400px;
}
</style>
