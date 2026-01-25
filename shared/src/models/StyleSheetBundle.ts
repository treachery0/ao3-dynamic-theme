import { StyleSheetAsset } from "./StyleSheetAsset";
import { Theme } from "../models";

export interface StyleSheetBundle {
    stylesheets: StyleSheetAsset[]
    theme: Theme
}