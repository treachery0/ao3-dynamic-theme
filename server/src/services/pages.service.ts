export async function fetchPage(url: URL) {
    return fetch(url, {
        cf: {
            cacheTtl: 86400,
            cacheTtlByStatus: {
                "200-": 86400,
                "400-499": 1,
                "500-599": 0
            },
            cacheEverything: true
        },
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
            'Accept': 'text/html'
        }
    });
}

