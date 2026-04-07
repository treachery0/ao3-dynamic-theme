import { ref, Ref, watch } from "vue";
import { useStorage } from "@/composables/useStorage";

export function useStorageRef<T>(key: string): Ref<T | null>;
export function useStorageRef<T>(key: string, initializer: () => T): Ref<T>;

export function useStorageRef<T>(key: string, initializer?: () => T): Ref<T | null> {
    const storage = useStorage<T>(localStorage, key);
    const result = ref<T | null>(getInitialValue()) as Ref<T | null>;

    watch(result, value => {
        if(value !== null) {
            storage.setItem(value);
        }
    }, {deep: true});

    function getInitialValue(): T | null {
        const oldValue: T | null = storage.getItem();

        if(!initializer || oldValue !== null) {
            return oldValue;
        }

        return initializer();
    }

    return result;
}