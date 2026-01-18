import { CssFileInfo, CssVariableInfo } from "ao3-tg-shared";

export const variables: CssVariableInfo[] = [
    {
        key: '--color-base-100',
        type: 'color',
        default: '#0b0e0f',
        description: 'Base (darkest)'
    },
    {
        key: '--color-base-200',
        type: 'color',
        default: '#141618',
        description: 'Base (dark)'
    },
    {
        key: '--color-base-300',
        type: 'color',
        default: '#1d2021',
        description: 'Base (lighter)'
    },
    {
        key: '--color-base-content',
        type: 'color',
        default: '#d5d8db',
        description: 'Base text'
    },
    {
        key: '--color-primary',
        type: 'color',
        default: '#8f0000',
        description: 'Primary'
    },
    {
        key: '--color-primary-content',
        type: 'color',
        default: '#d5d8db',
        description: 'Primary text'
    },
    {
        key: '--color-secondary',
        type: 'color',
        default: '#e59b5b',
        description: 'Secondary'
    },
    {
        key: '--color-secondary-content',
        type: 'color',
        default: '#130600',
        description: 'Secondary text'
    },
    {
        key: '--color-accent',
        type: 'color',
        default: '#b88cd9',
        description: 'Accent'
    },
    {
        key: '--color-accent-content',
        type: 'color',
        default: '#0b0615',
        description: 'Accent text'
    },
    {
        key: '--color-neutral',
        type: 'color',
        default: '#22272b',
        description: 'Neutral'
    },
    {
        key: '--color-neutral-content',
        type: 'color',
        default: '#999fa4',
        description: 'Neutral text'
    },
    {
        key: '--color-info',
        type: 'color',
        default: '#87dee9',
        description: 'Info'
    },
    {
        key: '--color-info-content',
        type: 'color',
        default: '#061213',
        description: 'Info text'
    },
    {
        key: '--color-success',
        type: 'color',
        default: '#abddac',
        description: 'Success'
    },
    {
        key: '--color-success-content',
        type: 'color',
        default: '#0b110b',
        description: 'Success text'
    },
    {
        key: '--color-warning',
        type: 'color',
        default: '#efc68f',
        description: 'Warning'
    },
    {
        key: '--color-warning-content',
        type: 'color',
        default: '#130f08',
        description: 'Warning text'
    },
    {
        key: '--color-error',
        type: 'color',
        default: '#ffb8bb',
        description: 'Error'
    },
    {
        key: '--color-error-content',
        type: 'color',
        default: '#150d0d',
        description: 'Error text'
    },
    {
        key: '--ui-density',
        type: 'number',
        default: '0.125',
        unit: 'rem',
        description: 'Spacing'
    },
    {
        key: '--ui-roundness',
        type: 'number',
        default: '0.125',
        unit: 'rem',
        description: 'Border radius'
    },
    {
        key: '--ui-border',
        type: 'number',
        default: '1',
        unit: 'px',
        description: 'Border width'
    },
    {
        key: '--font-serif',
        type: 'text',
        default: "'Georgia', serif",
        description: 'Serif font'
    },
    {
        key: '--font-sans',
        type: 'text',
        default: "'Lucida Grande', 'Lucida Sans Unicode', 'Verdana', 'Helvetica', sans-serif, 'GNU Unifont'",
        description: 'Sans-serif font'
    },
    {
        key: '--font-mono',
        type: 'text',
        default: "'Monaco', 'Consolas', 'Courier', monospace",
        description: 'Monospace font'
    }
];

export const sheets: CssFileInfo[] = [
    {
        description: 'General',
        media: 'all',
        filename: 'media-all.css',
        importance: 'required'
    },
    {
        description: 'Midsize',
        media: 'only screen and (max-width: 62em)',
        filename: 'media-midsize.css',
        importance: 'recommended'
    },
    {
        description: 'Narrow',
        media: 'only screen and (max-width: 42em)',
        filename: 'media-narrow.css',
        importance: 'recommended'
    },
    {
        description: 'Speech',
        media: 'speech',
        filename: 'media-aural.css',
        importance: 'optional'
    },
    {
        description: 'Print',
        media: 'print',
        filename: 'media-print.css',
        importance: 'optional'
    }
];