import { Remarkable } from "../remarkable/remarkable.ts";
import { Client } from "https://deno.land/x/postgres/mod.ts";
import "https://deno.land/x/dotenv/load.ts";

export class DeviceManager {

    private readonly pgClient = new Client(Deno.env.get("DATABASE_URL"));

    public init = async() => {
        await this.pgClient.connect();

        const result = await this.pgClient.queryObject("SELECT device_id, token FROM device_token LIMIT 1");
        console.log(result.rows);
    }
}