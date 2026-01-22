import { OpenAPIRoute } from "chanfana";
import { StyleSheetBundle } from "shared/models";
import { AppContext } from "@/models/AppContext";
import { CssAssetType } from "@/models/CssAssetType";
import { getCssVariables, readStyleAssets } from "@/services/css.service";

export class Assets extends OpenAPIRoute {
    async handle(c: AppContext) {
        const variables = getCssVariables();
        const stylesheets = await readStyleAssets(c, CssAssetType.PREPARED);

        const data: StyleSheetBundle = {
            variables: variables,
            stylesheets: stylesheets
        };

        return Response.json(data);
    }
}
