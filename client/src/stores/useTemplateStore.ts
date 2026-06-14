import {computed} from "vue";
import {useSingleton} from "@/composables/useSingleton";
import {useStorageRef} from "@/composables/useStorageRef";
import {SkinTemplate} from "common/models/SkinTemplate";

const {initializeComposable, useComposable} = useSingleton(useTemplateStore);

export {
    initializeComposable as initializeTemplateStore,
    useComposable as useTemplateStore
}

function useTemplateStore(getTemplate: () => SkinTemplate) {
    const template = computed<SkinTemplate>(getTemplate);
    const variables = useStorageRef('sb-editor-variables', () => getDefaultVariables(template.value));

    function getDefaultVariables(template: SkinTemplate): Record<string, string> {
        const results: Record<string, string> = {};

        template.colors.forEach(group => {
            group.items.forEach(p => {
                results[p.key] = p.value;
            });
        });

        template.sizes.forEach(p => {
            results[p.key] = String(p.value);
        });

        template.radius.forEach(p => {
            results[p.key] = String(p.value);
        });

        template.fonts.forEach(p => {
            results[p.key] = String(p.value);
        });

        return results;
    }

    return {
        template,
        variables,
        getDefaultVariables
    };
}