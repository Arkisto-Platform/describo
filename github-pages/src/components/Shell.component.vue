<template>
    <div>
        <div class="flex flex-col justify-center md:flex-row mt-10">
            <div class="text-3xl lg:text-6xl mr-2">
                Describo
            </div>
            <div class="text-lg lg:text-3xl md: pt-4 lg:pt-10">
                The tool to describe and package data.
            </div>
        </div>

        <div class="my-8 text-base md:text-2xl text-center text-orange-600">
            Describo is a tool to create and update
            <a href="https://researchobject.github.io/ro-crate/"
                >Research Object Crates (RO-CRATE)</a
            >.
        </div>

        <div class="flex flex-col lg:flex-row">
            <div class="flex-col">
                <div><img src="images/select-folder.png" /></div>
                <div class="text-center">Select a folder to describe.</div>
            </div>
            <div class="flex-col">
                <div><img src="images/select-profile.png" /></div>
                <div class="text-center">Select a profile.</div>
            </div>
            <div class="flex-col">
                <div><img src="images/describe-item.png" /></div>
                <div class="text-center">Describe your data.</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    components: {},
};
</script>
