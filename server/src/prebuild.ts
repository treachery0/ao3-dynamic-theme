import { generateStyles } from "@/functions/generate-styles";
import { generatePages } from "@/functions/generate-pages";
import { getAvailableUrls } from "ao3-tg-shared";

await Promise.all([
    generatePages(getAvailableUrls()),
    generateStyles(false),
    generateStyles(true),
]);