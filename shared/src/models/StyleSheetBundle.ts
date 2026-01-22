import { StyleSheetAsset } from "./StyleSheetAsset";
import { CssVariableInfo } from "./CssVariableInfo";

export interface StyleSheetBundle {
    stylesheets: StyleSheetAsset[]
    variables: CssVariableInfo[]
}