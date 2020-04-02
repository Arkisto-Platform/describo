<template>
    <div>
        <!-- show person list -->
        <!-- <pre>{{ people }}</pre> -->
        <el-table :data="people" class="w-full">
            <el-table-column
                prop="uuid"
                label="Identifier"
                width="320"
            ></el-table-column>
            <el-table-column prop="name" label="Name"></el-table-column>
            <el-table-column prop="name" label="Actions" width="180">
                <template slot-scope="scope">
                    <el-button type="success" @click="editPerson(scope.row)">
                        <i class="fas fa-edit"></i>
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- add person -->
        <div class="mt-4">
            <person-component
                :input="person"
                :mode="mode"
                v-if="person"
                @save="person = undefined"
            />
        </div>
    </div>
</template>

<script>
export default {
    components: {
        PersonComponent: () =>
            import(
                "components/CrateCreator/CoreEntities/person/Person.component.vue"
            )
    },
    data() {
        return {
            person: undefined,
            mode: {}
        };
    },
    computed: {
        people: function() {
            try {
                return this.$store.state.itemsByType.Person;
            } catch (error) {
                return [];
            }
        }
    },
    methods: {
        editPerson(person) {
            this.person = person;
            this.mode = {
                disableDelete: true,
                visible: true,
                edit: true
            };
        }
    }
};
</script>

<style lang="scss" scoped></style>
