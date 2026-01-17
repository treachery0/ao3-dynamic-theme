import { OpenAPIRoute } from "chanfana";
import { AppContext, fetchAsset, sheets, variables } from "@/types";
import { corsHeaders } from "@/middleware/cors.ts";
import { AssetsResponse } from "ao3-tg-shared";

export class Assets extends OpenAPIRoute {
    async handle(c: AppContext) {
        const stylesheets = await Promise.all(sheets.map(async s => fetchAsset(c, s)));

        const result: AssetsResponse = {
            variables: variables,
            stylesheets: stylesheets.filter(x => x !== undefined)
        };

        return Response.json(result, {
            headers: corsHeaders
        });
    }
}
