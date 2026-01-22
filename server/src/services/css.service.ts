import { StyleSheetAssetInfo, CssVariableInfo, CssVariableType, StyleSheetAsset, StyleSheetImportance } from "shared/models";
import { createProperty, createRule, mergeRules } from "shared/functions";
import { join } from "node:path";
import postcss from "postcss";
import { AppContext } from "@/models/AppContext";
import { CssAssetType } from "@/models/CssAssetType";
import { readServerAsset } from "@/services/assets.service";
import { getPlugins } from "@/functions/css-plugins";

export function getCssVariables() {
    return variables;
}

export async function generateCss(c: AppContext, variables: string[][]): Promise<StyleSheetAsset[]> {
    const assetType = CssAssetType.RAW;
    const properties = variables.map(v => createProperty(v[0], v[1]));
    const plugins = getPlugins({type: assetType})

    const variableRule = createRule(':root', properties);
    const postCss = postcss(plugins);
    const assets = await readStyleAssets(c, assetType);

    return Promise.all(assets.map(async file => {
        const css = mergeRules(variableRule, file.content);
        const processedCss = await postCss.process(css, {from: undefined});

        return {
            ...file,
            content: processedCss.css
        } satisfies StyleSheetAsset;
    }));
}

export async function readStyleAssets(context: AppContext, type: CssAssetType): Promise<StyleSheetAsset[]> {
    const directory = `/${type}`;

    const stylesheets = await Promise.all(sheets.map(s => {
        return readStyleAsset(context, directory, s);
    }));

    return stylesheets.filter(s => s !== undefined);
}

async function readStyleAsset(context: AppContext, directory: string, file: StyleSheetAssetInfo): Promise<StyleSheetAsset | undefined> {
    const path = join(directory, file.filename);
    const response = await readServerAsset(context, path);

    if(!response.ok) {
        return;
    }

    return {
        ...file,
        content: await response.text()
    };
}

const variables: CssVariableInfo[] = [
    {
        key: '--color-base-100',
        type: CssVariableType.Color,
        default: '#0b0e0f',
        description: 'Base (darkest)'
    },
    {
        key: '--color-base-200',
        type: CssVariableType.Color,
        default: '#141618',
        description: 'Base (dark)'
    },
    {
        key: '--color-base-300',
        type: CssVariableType.Color,
        default: '#1d2021',
        description: 'Base (lighter)'
    },
    {
        key: '--color-base-content',
        type: CssVariableType.Color,
        default: '#d5d8db',
        description: 'Base text'
    },
    {
        key: '--color-primary',
        type: CssVariableType.Color,
        default: '#8f0000',
        description: 'Primary'
    },
    {
        key: '--color-primary-content',
        type: CssVariableType.Color,
        default: '#d5d8db',
        description: 'Primary text'
    },
    {
        key: '--color-secondary',
        type: CssVariableType.Color,
        default: '#e59b5b',
        description: 'Secondary'
    },
    {
        key: '--color-secondary-content',
        type: CssVariableType.Color,
        default: '#130600',
        description: 'Secondary text'
    },
    {
        key: '--color-accent',
        type: CssVariableType.Color,
        default: '#b88cd9',
        description: 'Accent'
    },
    {
        key: '--color-accent-content',
        type: CssVariableType.Color,
        default: '#0b0615',
        description: 'Accent text'
    },
    {
        key: '--color-neutral',
        type: CssVariableType.Color,
        default: '#22272b',
        description: 'Neutral'
    },
    {
        key: '--color-neutral-content',
        type: CssVariableType.Color,
        default: '#999fa4',
        description: 'Neutral text'
    },
    {
        key: '--color-info',
        type: CssVariableType.Color,
        default: '#87dee9',
        description: 'Info'
    },
    {
        key: '--color-info-content',
        type: CssVariableType.Color,
        default: '#061213',
        description: 'Info text'
    },
    {
        key: '--color-success',
        type: CssVariableType.Color,
        default: '#abddac',
        description: 'Success'
    },
    {
        key: '--color-success-content',
        type: CssVariableType.Color,
        default: '#0b110b',
        description: 'Success text'
    },
    {
        key: '--color-warning',
        type: CssVariableType.Color,
        default: '#efc68f',
        description: 'Warning'
    },
    {
        key: '--color-warning-content',
        type: CssVariableType.Color,
        default: '#130f08',
        description: 'Warning text'
    },
    {
        key: '--color-error',
        type: CssVariableType.Color,
        default: '#ffb8bb',
        description: 'Error'
    },
    {
        key: '--color-error-content',
        type: CssVariableType.Color,
        default: '#150d0d',
        description: 'Error text'
    },
    {
        key: '--ui-density',
        type: CssVariableType.Number,
        default: '0.125',
        unit: 'rem',
        description: 'Spacing'
    },
    {
        key: '--ui-roundness',
        type: CssVariableType.Number,
        default: '0.125',
        unit: 'rem',
        description: 'Border radius'
    },
    {
        key: '--ui-border',
        type: CssVariableType.Number,
        default: '1',
        unit: 'px',
        description: 'Border width'
    },
    {
        key: '--font-serif',
        type: CssVariableType.Text,
        default: "'Georgia', serif",
        description: 'Serif font'
    },
    {
        key: '--font-sans',
        type: CssVariableType.Text,
        default: "'Lucida Grande', 'Lucida Sans Unicode', 'Verdana', 'Helvetica', sans-serif, 'GNU Unifont'",
        description: 'Sans-serif font'
    },
    {
        key: '--font-mono',
        type: CssVariableType.Text,
        default: "'Monaco', 'Consolas', 'Courier', monospace",
        description: 'Monospace font'
    }
];

const sheets: StyleSheetAssetInfo[] = [
    {
        description: 'General',
        media: 'all',
        filename: 'media-all.css',
        importance: StyleSheetImportance.Required,
    },
    {
        description: 'Midsize',
        media: 'only screen and (max-width: 62em)',
        filename: 'media-midsize.css',
        importance: StyleSheetImportance.Recommended,
    },
    {
        description: 'Narrow',
        media: 'only screen and (max-width: 42em)',
        filename: 'media-narrow.css',
        importance: StyleSheetImportance.Required,
    },
    {
        description: 'Speech',
        media: 'speech',
        filename: 'media-aural.css',
        importance: StyleSheetImportance.Optional,
    },
    {
        description: 'Print',
        media: 'print',
        filename: 'media-print.css',
        importance: StyleSheetImportance.Optional
    }
];