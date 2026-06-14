import {computed, ComputedRef, Ref} from "vue";
import {createProperty, createRule} from "common/functions/css-utils";
import {SkinTemplate} from "common/models/SkinTemplate";

export function useVariableStylesheet(template: Readonly<Ref<SkinTemplate>>, variables: Readonly<Ref<Record<string, string>>>): ComputedRef<CSSStyleSheet> {
    function createStyleSheet(): CSSStyleSheet {
        const entries = Object.entries(variables.value);
        const properties = entries.map(toProperty);

        return toStylesheet(properties);
    }

    function toProperty(entry: [string, string]): string {
        const [key, value] = entry;

        const unit = getUnit(key);
        const valueWithUnit = `${value}${unit}`

        return createProperty(key, valueWithUnit);
    }

    function toStylesheet(properties: string[]): CSSStyleSheet {
        const sheet = new CSSStyleSheet();

        sheet.replaceSync(createRule('*', properties));

        return sheet;
    }

    function getUnit(key: string): string {
        const size = template.value.sizes.find(x => x.key === key);

        if(size) {
            return size.unit;
        }

        const radius = template.value.radius.find(x => x.key === key);

        if(radius) {
            return radius.unit;
        }

        return '';
    }

    return computed(createStyleSheet);
}