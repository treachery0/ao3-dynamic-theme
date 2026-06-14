import { OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { AppContext } from "@/models/AppContext";

export class Pages extends OpenAPIRoute {
    schema = {
        request: {
            query: z.object({
                url: z.string()
            })
        }
    };

    async handle(c: AppContext) {
        const {query} = await this.getValidatedData<typeof this.schema>();

        const url = new URL(query.url, 'https://archiveofourown.org');

        const response = await this.fetchPage(url);

        if(!response.ok) {
            c.status(response.status as any);

            return c.json(response.headers);
        }

        const html = await response.text();

        return c.text(html);
    }

    async fetchPage(url: URL) {
        return fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
                'Accept': 'text/html'
            }
        });
    }
}