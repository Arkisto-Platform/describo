<template>
    <div>
        <audio ref="mediaElement" controls class="style-audio-element">
            <source :src="path" />
            Your browser does not support the <code>audio</code> element.
        </audio>
    </div>
</template>

<script>
export default {
    props: {
        path: {
            type: String,
            required: true
        }
    },
    data() {
        return {};
    }
};
</script>

<style lang="scss" scoped>
.style-audio-element {
    width: 100%;
}
</style>
