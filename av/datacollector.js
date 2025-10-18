export default class DataCollector {
    constructor(url) {
        this.url = url;
        this.data = null;
        this.token = "88432dce8cf1a1b5c01fa87a87d541f6d6a42f86fad5c4c226eddbd41854d4fb";
    }
    async fetchData() {
        try {
            const response = await fetch(this.url, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${this.token}`,
                    "Accept": "application/json"
                }
            });
            if ( ! response.ok ) throw new Error(`HTTP ${response.status}`);
            const json = await response.json();
            this.data = json;
            //console.log("Fetched data:", json);
            return json;
        } catch (err) {
            //console.error("Fetch error:", err);
            return null;
        }
    }
}