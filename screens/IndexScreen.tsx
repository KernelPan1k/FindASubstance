import React, {useState, useEffect} from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    TextInput,
} from "react-native";
import * as SplashScreen from "expo-splash-screen";
import {useNavigation} from "@react-navigation/native";
import {getSubstancesCache} from "../services/getSubstance";

SplashScreen.preventAutoHideAsync();

export default function IndexScreen() {
    const navigation = useNavigation();
    const [query, setQuery] = useState("");
    const [allSubstances, setAllSubstances] = useState<any[]>([]);
    const [filtered, setFiltered] = useState<any[]>([]);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        async function prepare() {
            try {
                const substances = await getSubstancesCache();
                setAllSubstances(substances);
                setFiltered(substances);
            } catch (e) {
                console.warn(e);
            } finally {
                await new Promise((resolve) => setTimeout(resolve, 2000));
                setIsReady(true);
                SplashScreen.hideAsync();
            }
        }

        prepare();
    }, []);

    useEffect(() => {
        if (query === "") {
            setFiltered(allSubstances);
        } else {
            const lower = query.toLowerCase();
            setFiltered(
                allSubstances.filter(
                    (s) =>
                        s.name.toLowerCase().includes(lower) ||
                        (s.commonNames || []).some((cn: string) =>
                            cn.toLowerCase().includes(lower)
                        )
                )
            );
        }
    }, [query, allSubstances]);

    const renderItem = ({item}: { item: any }) => (
        <TouchableOpacity
            style={{
                padding: 12,
                borderBottomWidth: 1,
                borderBottomColor: "#333",
            }}
            // @ts-ignore
            onPress={() => navigation.navigate("Detail", {substance: item})}
        >
            <Text style={{color: "#fff", fontSize: 16, fontWeight: "bold"}}>
                {item.name}
            </Text>
            <View style={{flexDirection: "row", flexWrap: "wrap", marginTop: 5}}>
                {item.commonNames?.map((cn: string, i: number) => (
                    <Text
                        key={i}
                        style={{
                            backgroundColor: "#333",
                            color: "#aaa",
                            paddingHorizontal: 8,
                            paddingVertical: 4,
                            borderRadius: 12,
                            fontSize: 12,
                            marginRight: 5,
                            marginBottom: 5,
                        }}
                    >
                        {cn}
                    </Text>
                ))}
            </View>
        </TouchableOpacity>
    );

    if (!isReady) {
        return null;
    }

    return (
        <View style={{flex: 1, backgroundColor: "#000", padding: 10}}>
            <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="🔍 Find a substance..."
                placeholderTextColor="#666"
                style={{
                    backgroundColor: "#111",
                    color: "#fff",
                    padding: 12,
                    borderRadius: 8,
                    marginBottom: 10,
                }}
            />
            {query !== "" && filtered.length === 0 ? (
                <Text style={{color: "#888", marginTop: 20}}>❌ No results</Text>
            ) : (
                <FlatList
                    data={filtered}
                    keyExtractor={(item, index) => item.id || index.toString()}
                    renderItem={renderItem}
                    initialNumToRender={20}
                    maxToRenderPerBatch={30}
                    windowSize={10}
                />
            )}
        </View>
    );
}
