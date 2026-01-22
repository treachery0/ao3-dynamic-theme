import { StyleSheetImportance } from "./StyleSheetImportance";

export type StyleSheetAsset = {
    filename: string
    description: string
    media: string
    importance: StyleSheetImportance
    content: string
}