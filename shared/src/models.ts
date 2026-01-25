export * from "./models/StyleSheetBundle";
export * from "./models/StyleSheetAssetInfo";
export * from "./models/CssVariableInfo";
export * from "./models/CssVariableType";
export * from "./models/HtmlAsset";
export * from "./models/StyleSheetAsset";
export * from "./models/StyleSheetImportance";
export * from "./models/StyleSheetVariables";
export * from "./models/ThemeInfo";

export type Theme = {
    name?: string
    colors: ColorGroup[]
    radius: RadiusVar[]
    fonts: FontVar[]
    sizes: SizesVar[]
    options?: ThemeOptions
}

export type FontVar = {
    key: string
    value: string
    name: string
}


export type ThemeOptions = {

}

export type ColorGroup = {
    name: string
    items: ColorVar[]
}

export type ColorVar = {
    key: string
    value: string
    isContent?: boolean
    label?: string
}

export type RadiusVar = NumberVar & {
    possibleValues: number[]
}

export type NumberVar = {
    key: string
    value: number
    name: string
    description: string
    unit: string
}

export type SizesVar = NumberVar & {
    min: number
    max: number
    step: number
}