import { readonly, ref } from "vue";

export function useAbort() {
    const controller = new AbortController();
    const running = ref(false);

    async function runAbortable(callback: (c: AbortController) => Promise<any>) {
        if(running.value) {
            controller.abort();
        }

        running.value = true;

        try {
            await callback(controller);
        }
        catch(e: any) {
            if(e.name !== 'AbortError') {
                running.value = false;
                throw e;
            }
        }

        running.value = false;
    }

    return {
        isRunning: readonly(running),
        runAbortable
    };
}