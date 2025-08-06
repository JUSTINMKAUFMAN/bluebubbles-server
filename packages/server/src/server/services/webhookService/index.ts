import axios from "axios";
import { Server } from "@server";
import { Loggable } from "@server/lib/logging/Loggable";

export type WebhookEvent = {
    type: string;
    data: any;
};

/**
 * Handles dispatching webhooks
 */
export class WebhookService extends Loggable {
    tag = "WebhookService";

    async dispatch(event: WebhookEvent) {
        const companyId = `${Server().repo.getConfig("companyId") ?? "HEYOH"}`;
        const apiKey = Server().repo.getConfig("apiKey") as string | null;
        const webhooks = await Server().repo.getWebhooks();
        for (const i of webhooks) {
            const eventTypes = JSON.parse(i.events) as Array<string>;
            if (!eventTypes.includes("*") && !eventTypes.includes(event.type)) continue;
            this.log.debug(`Dispatching event to webhook: ${i.url}`);

            // We don't need to await this
            this.sendPost(i.url, event, companyId, (apiKey && apiKey.length > 0) ? apiKey : undefined).catch(ex => {
                this.log.debug(`Failed to dispatch "${event.type}" event to webhook: ${i.url}`);
                this.log.debug(`  -> Error: ${ex?.message ?? String(ex)}`);
                this.log.debug(`  -> Status Text: ${ex?.response?.statusText}`);
            });
        }
    }

    private async sendPost(url: string, event: WebhookEvent, companyId: string, apiKey?: string) {
        return await axios.post(url, event, { headers: { 
            "Content-Type": "application/json",
            "x-company-id": companyId,
            "x-api-key": apiKey
        } });
    }
}
