import { MSGraphClientV3 } from "@microsoft/sp-http";

class GraphService {
    private static _instance: MSGraphClientV3 | null = null;

    public static setGraphClient(graphClient: MSGraphClientV3): void {
        this._instance = graphClient;
    }

    public static getGraphClient(): MSGraphClientV3 {
        if (!this._instance) {
            throw new Error(
                "Graph client is not initialized. Call setGraphClient first."
            );
        }
        return this._instance;
    }
}

export default GraphService;
