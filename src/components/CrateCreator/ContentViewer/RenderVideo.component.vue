<template>
    <div>
        <video ref="mediaElement" controls class="style-video-element">
            <source :src="path" />
            Your browser does not support the <code>video</code> element.
        </video>
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
.style-video-element {
    width: 100%;
}
</style>
