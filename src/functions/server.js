import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import previewConfig from "../../preview.config.js";

function handleProxy() {
    return createProxyMiddleware({
        target: previewConfig.site,
        changeOrigin: true,
        selfHandleResponse: false,
        pathFilter: (path, req) => {
            return path.match('^/images') && req.method === 'GET';
        }
    });
}

function handleRequest(pages) {
    return (req, res) => {
        const path = req.path;
        const page = pages.get(path);

        res.setHeader('Content-Type', 'text/html')

        if(page) {
            res.send(page.serialize());
            return;
        }

        const urls = Array.from(pages.keys());
        const links = urls.map(url => `<a href="${url}">${previewConfig.site}${url}</a>`);
        const list = links.join('<br>');

        res.status(404);
        res.send(`
            <body>
                <h2>Couldn't preview path "${req.path}"</h2>
                <h3>Available pages:</h3>
                <p>${list}</p>
            </body>
        `);
    };
}

export function startServer(pages) {
    const app = express();

    app.use(
        handleProxy(),
        handleRequest(pages)
    );

    return app.listen(previewConfig.port);
}