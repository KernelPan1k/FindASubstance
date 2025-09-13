import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getSubstancesCache(): Promise<any[]> {
    try {
        const cached = await AsyncStorage.getItem("substances_cache");
        const timestamp = await AsyncStorage.getItem("substances_cache_time");

        if (cached && timestamp) {
            const age = Date.now() - parseInt(timestamp, 10);
            if (age < 24 * 60 * 60 * 1000) {
                return JSON.parse(cached);
            }
        }

        const res = await fetch("https://tripbot.tripsit.me/api/tripsit/getAllDrugs");
        const json = await res.json();

        const substances = json.data.flatMap((item: any) =>
            Object.entries(item).map(([key, drug]: [string, any]) => ({
                id: key,
                name: drug.pretty_name || drug.name || key,
                commonNames: drug.aliases || [],
                formatted_effects: drug.formatted_effects || [],
                categories: drug.categories || [],
                properties: drug.properties || {},
                links: drug.links || {},
                formatted_aftereffects: drug.formatted_aftereffects || {},
                formatted_dose: drug.formatted_dose || {},
                formatted_duration: drug.formatted_duration || {},
                formatted_onset: drug.formatted_onset || {},
                dose_note: drug.dose_note || "",
            }))
        );

        await AsyncStorage.setItem("substances_cache", JSON.stringify(substances));
        await AsyncStorage.setItem("substances_cache_time", Date.now().toString());

        return substances;
    } catch (err) {
        alert("Error fetching substances: " + err);
        return [];
    }
}