import { computed, ComputedRef, Ref } from "vue";
import { createProperty, createRule } from "common/functions";
import {SkinSchema} from "common/models";

export function useVariableStylesheet(schema: Readonly<Ref<SkinSchema>>, variables: Readonly<Ref<Record<string, string>>>): ComputedRef<CSSStyleSheet> {
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
        const size = schema.value.sizes.find(x => x.key === key);

        if(size) {
            return size.unit;
        }

        const radius = schema.value.radius.find(x => x.key === key);

        if(radius) {
            return radius.unit;
        }

        return '';
    }

    return computed(createStyleSheet);
}