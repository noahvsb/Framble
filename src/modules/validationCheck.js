import shortUrl from "./shortUrl.js";

function validationCheck(url) {
    console.log(`validation check on: ${shortUrl(url)}`);
    try {
        const parsed = new URL(url);

        // only http(s) allowed
        if (!["http:", "https:"].includes(parsed.protocol)) {
            console.log("validation failed: not a http(s) protocol");
            return false;
        }

        // check if hostname includes a dot (.)
        if (!parsed.hostname.includes('.')) {
            console.log("validation failed: hostname missing dot (.)");
            return false;
        }
        
        console.log("validation success");
        return true;
    } catch {
        console.log("validation failed: url parsing error");
        return false;
    }
}

export default validationCheck;