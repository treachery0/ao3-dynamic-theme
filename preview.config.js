export default {
    inputDir: 'src/inputs',
    outputDir: '.github/assets/previews',
    baseUrl: 'https://archiveofourown.org',
    port: 3000,
    pages: [
        '/',
        '/works',
        '/search',
        '/works/5191202'
    ],
    stylesheets: [
        {
            path: 'media-all.css',
            media: 'all'
        },
        {
            path: 'media-midsize.css',
            media: 'only screen and (max-width: 62em)'
        },
        {
            path: 'media-narrow.css',
            media: 'only screen and (max-width: 42em)'
        },
    ],
    capture: {
        width: 1920,
        height: 1080,
        extension: 'png'
    }
}