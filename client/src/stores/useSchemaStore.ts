import {computed} from "vue";
import {useSingleton} from "@/composables/useSingleton";
import {useStorageRef} from "@/composables/useStorageRef";
import {getDefaultSchema} from "@/functions/theme";
import {SkinSchema} from "common/models";

const {initializeComposable, useComposable} = useSingleton(useSchemaStore);

export {
    initializeComposable as initializeSchemaStore,
    useComposable as useSchemaStore
}

function useSchemaStore() {
    const schema = computed<SkinSchema>(getDefaultSchema);
    const variables = useStorageRef('sb-editor-variables', () => getDefaultVariables(schema.value));

    function getDefaultVariables(schema: SkinSchema): Record<string, string> {
        const results: Record<string, string> = {};

        schema.colors.forEach(group => {
            group.items.forEach(p => {
                results[p.key] = p.value;
            });
        });

        schema.sizes.forEach(p => {
            results[p.key] = String(p.value);
        });

        schema.radius.forEach(p => {
            results[p.key] = String(p.value);
        });

        schema.fonts.forEach(p => {
            results[p.key] = String(p.value);
        });

        return results;
    }

    return {
        schema,
        variables,
        getDefaultVariables
    };
}