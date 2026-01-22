import { CssVariableType } from "./CssVariableType";

export interface CssVariableInfo {
    key: string
    description: string
    default: string
    unit?: string
    type: CssVariableType
}