<template>
    <div class="flex flex-col items-center">
        <div class="w-4/5 flex flex-col mx-8">
            <div class="flex flex-row border-b py-6">
                <el-button
                    @click="previous"
                    type="primary"
                    :disabled="page === 0"
                >
                    <i class="fas fa-long-arrow-alt-left"></i>
                </el-button>
                <div class="flex-grow">
                    <div class="justify-center flex flex-row pt-2 space-x-1">
                        <div v-for="(entry, idx) of content" :key="idx">
                            <div
                                :class="{ 'text-orange-500': page === idx }"
                                class="text-gray-400 cursor-pointer"
                                @click="page = idx"
                            >
                                <i class="fas fa-circle"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <el-button
                    @click="next"
                    type="primary"
                    :disabled="page === content.length - 1"
                >
                    <i class="fas fa-long-arrow-alt-right"></i>
                </el-button>
            </div>
            <div class="mt-10">
                <div class="flex flex-row items-center">
                    <div class="w-1/2 border-r px-1">
                        <img
                            :src="content[page].image"
                            class="object-contain"
                        />
                    </div>
                    <div
                        class="w-1/2 flex flex-col justify-center text-2xl px-4 space-y-8"
                    >
                        <div
                            v-for="(section, idx) of content[page].text"
                            :key="idx"
                        >
                            <div v-html="section"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-10 border-t flex flex-col items-end">
                <div class="mt-4">
                    <el-button type="primary" @click="exitOnboarding">
                        Get started describing your data!
                    </el-button>
                </div>
                <div class="text-right">
                    <el-checkbox v-model="disableOnboarding"
                        >Don't show again</el-checkbox
                    >
                    <p class="text-gray-600">
                        You can access this help again by selecting the "View
                        Help" button on the settings page.
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Store from "electron-store";
const store = new Store({ name: "describo-state" });

import page0 from "src/assets/onboarding/page0.png";
import page1 from "src/assets/onboarding/page1.png";
import page2 from "src/assets/onboarding/page2.png";
import page3 from "src/assets/onboarding/page3.png";
import page4 from "src/assets/onboarding/page4.png";
import page5 from "src/assets/onboarding/page5.png";
import page6 from "src/assets/onboarding/page6.png";
import page7 from "src/assets/onboarding/page7.png";
import page8 from "src/assets/onboarding/page8.png";
import page9 from "src/assets/onboarding/page9.png";
import page10 from "src/assets/onboarding/page10.png";
import page11 from "src/assets/onboarding/page11.png";
import page12 from "src/assets/onboarding/page12.png";
import page13 from "src/assets/onboarding/page13.png";
import page14 from "src/assets/onboarding/page14.png";
import page15 from "src/assets/onboarding/page15.png";
import page16 from "src/assets/onboarding/page16.png";
import page17 from "src/assets/onboarding/page17.png";
import page18 from "src/assets/onboarding/page18.png";
import page19 from "src/assets/onboarding/page19.png";
import page28 from "src/assets/onboarding/page28.png";
import page29 from "src/assets/onboarding/page29.png";
import page30 from "src/assets/onboarding/page30.png";
export default {
    data() {
        return {
            page: 0,
            disableOnboarding: store.get("disableOnboarding"),
            content: [
                {
                    text: [
                        "Welcome to Describo!",
                        "Describo is a tool to help you create Research Object Crates (RO-Crate).",
                    ],
                    image: page0,
                },
                {
                    text: [
                        "To get started with Describo, first select a folder of content to describe.",
                    ],
                    image: page1,
                },
                {
                    text: [
                        "When you've selected a folder you can browse the content to make sure it's what you're expecting.",
                        "Then, when you're ready you can select 'describe this target'.",
                    ],
                    image: page2,
                },
                {
                    text: [
                        "After selecting a folder to describe, you then select a profile to use. A profile is simply a set of instructions defining what you can describe.",
                        "Describo comes with a default profile. Use this if you're just getting started.",
                        "Alternately, you may have been pointed at a domain specific - or custom - profile. If so, load that in to get started.",
                        "Finally, you can also select any existing profiles you've loaded in. Or refresh them to get any updates that might exist!",
                    ],
                    image: page3,
                },
                {
                    text: [
                        "Profiles can reference data packs. These are just predefined bits of configuration you can use in your crate.",
                        "If your profile references any just wait a few moments for them to load.",
                    ],
                    image: page4,
                },
                {
                    text: [
                        "If your profile defines more than one type of item to describe you can select which one you want on this page.",
                    ],
                    image: page5,
                },
                {
                    text: [
                        "There are 3 main sections to the Describo User Interface: controls, types and content area.",
                        `The controls sections shows the folder being described and the profile in the first row with controls to add items, inspect the data and export the crate in the second row.`,
                        `The types section is a list of the types of content that have been described in the crate.`,
                        `The content area is where you start adding things to the crate. The content area shows you the Root Dataset in the crate. This is the entry point to the configuration.`,
                    ],
                    image: page6,
                },
                {
                    text: [
                        "When a profile defines a property as required you will see an asterisk next to the property name and the background will be red when there is no data attached.",
                        "To describe an item and it to a property, select which type you wish to add.",
                        "In this example the property accepts a Person or Organization instance but other properties might accept Text or Date data.",
                    ],
                    image: page7,
                },
                {
                    text: [
                        "Describo continually saves the items you create to a personal store. So, when you add a new item to the crate you can select one you've already described.",
                        "Or you can start from scratch and define what you need.",
                    ],
                    image: page8,
                },
                {
                    text: [
                        "Describo autosaves as you type. Wait a moment and the field will flash green to indicate that this has happened.",
                    ],
                    image: page9,
                },
                {
                    text: [
                        "When you've added an item to your crate you will see it next to the property you've attached it to.",
                    ],
                    image: page10,
                },
                {
                    text: [
                        "And when you edit that item you can also see all the places it's attached.",
                    ],
                    image: page11,
                },
                {
                    text: [
                        "Items can be linked to multiple properties. In fact, you should not create the same item twice!",
                    ],
                    image: page12,
                },
                {
                    text: [
                        "In this example this person is defined as an author and a publisher of this crate.",
                    ],
                    image: page13,
                },
                {
                    text: [
                        "In this example this person is defined as an author and a publisher of this crate.",
                    ],
                    image: page14,
                },
                {
                    text: [
                        "We can see that this Person is only defined in the crate once even though they are linked to two properties.",
                    ],
                    image: page15,
                },
                {
                    text: [
                        "A key feature of RO-Crate is the ability to describe the content within your crate.",
                    ],
                    image: page16,
                },
                {
                    text: [
                        "In this example we've specifically added an mp3, an mp4 and an XML file to the description.",
                        "Don't be confused: if you package up your crate the whole folder subtree will be included. This is about explicitly describing some items.",
                    ],
                    image: page17,
                },
                {
                    text: [
                        "The items we want to describe. A folder is described as a 'Dataset' and a file is described as a 'File'.",
                        "File and folder identifiers are paths relative to the root of the crate.",
                    ],
                    image: page18,
                },
                {
                    text: [
                        "RO-Crate allows you to define metadata for the crate and individual items within the crate.",
                        "In this example we can see a preview of the file and the properties we can define which provide the user more information about this piece of data.",
                    ],
                    image: page19,
                },

                {
                    text: [
                        "Describo gives you tools to inspect the data you're creating.",
                        "The 'inspect crate' button will show you exactly what will be written out.",
                    ],
                    image: page28,
                },
                {
                    text: [
                        "And when you're done you can export the crate as a zip file or even a BagIT Bag!",
                    ],
                    image: page29,
                },
                {
                    text: [
                        "Finally, the settings page of Describo. This is where you can see the items that have been saved to your datastore and also access this help again.",
                    ],
                    image: page30,
                },
            ],
        };
    },
    methods: {
        previous() {
            this.page = this.page === 0 ? 0 : (this.page -= 1);
        },
        next() {
            this.page =
                this.page === this.content.length - 1
                    ? this.content.length - 1
                    : (this.page += 1);
        },
        exitOnboarding() {
            store.set("disableOnboarding", this.disableOnboarding);
            this.$router.push({ path: "/describe" });
        },
    },
};
</script>

<style lang="scss" scoped>
.set-container-height {
    height: 500px;
    min-height: 500px;
}
</style>
