export default {
    site: 'https://archiveofourown.org',
    port: 3000,
    pages: [
        '/',
        '/works',
        '/search',
        '/works/5191202'
    ],
    inputDir: 'src/inputs',
    outputDir: '.github/assets/previews',
    caching: {
        enabled: true,
        directory: '.cache',
        duration: 999999999
    },
    capture: {
        width: 1920,
        height: 1080,
        extension: 'png'
    },
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
}