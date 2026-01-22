import { generateStyles } from "@/functions/css-generation";

await Promise.all([
    generateStyles(false),
    generateStyles(true),
]);