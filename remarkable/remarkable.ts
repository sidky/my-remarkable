import { v4 } from "https://deno.land/std/uuid/mod.ts";

export class Remarkable {

    /**
     * Registers a new device. Generate a new code from [https://my.remarkable.com/connect/desktop],
     * 
     * @param code code generate by remarkable
     */
    public static registerNewDevice = async(code: string):Promise<string> => {
        const deviceDesc = 'browser-chrome';
        const deviceId = v4.generate();

        const request = {
            "code": code,
            "deviceDesc": deviceDesc,
            "deviceID": deviceId
        };

        const body = JSON.stringify(request);

        console.log(`Remarkable: body: ${ body }`);

        try {
            const response = await fetch("https://my.remarkable.com/token/json/2/device/new", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: body,
            });

            if (response.status != 200) {
                throw new Error(response.statusText);
            }

            console.log(`Response: ${ response.status } ${ response.statusText }`);

            return response.text();
        } catch(error) {
            console.log(`Unable to register device: ${ error }`);
            throw error;
        }
    }

    // public static refreshToken(token: string, deviceId: string): Promise<string> {
    // }
}