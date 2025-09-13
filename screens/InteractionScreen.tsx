import React, {useState, useEffect} from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
} from "react-native";
import {FontAwesome5} from "@expo/vector-icons";
import {getSubstancesCache} from "../services/getSubstance";

export default function InteractionScreen() {
    const [allSubstances, setAllSubstances] = useState<any[]>([]);
    const [query1, setQuery1] = useState("");
    const [query2, setQuery2] = useState("");
    const [selected1, setSelected1] = useState<any>(null);
    const [selected2, setSelected2] = useState<any>(null);
    const [interaction, setInteraction] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            const substances = await getSubstancesCache();
            setAllSubstances(substances);
        })();
    }, []);

    useEffect(() => {
        if (selected1 && selected2) {
            fetchInteraction(selected1.id, selected2.id);
        }
    }, [selected1, selected2]);

    const fetchInteraction = async (s1: string, s2: string) => {
        try {
            setLoading(true);
            setInteraction(null);
            const url = `https://tripbot.tripsit.me/api/tripsit/getInteraction/${s1}/${s2}`;
            const res = await fetch(url);
            const json = await res.json();
            setInteraction(json.data[0] || null);
        } catch (err) {
            console.error("Error fetching interaction:", err);
            setInteraction(null);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({item, onSelect}: { item: any; onSelect: (s: any) => void }) => (
        <TouchableOpacity
            style={{
                padding: 10,
                borderBottomColor: "#333",
                borderBottomWidth: 1,
            }}
            onPress={() => onSelect(item)}
        >
            <Text style={{color: "#fff", fontSize: 16}}>{item.name}</Text>
        </TouchableOpacity>
    );

    const renderSearchBox = (
        placeholder: string,
        query: string,
        setQuery: (s: string) => void,
        selected: any,
        setSelected: (s: any) => void
    ) => {
        const filtered = query
            ? allSubstances.filter(
                (s) =>
                    s.name.toLowerCase().includes(query.toLowerCase()) ||
                    s.commonNames.some((cn: string) =>
                        cn.toLowerCase().includes(query.toLowerCase())
                    )
            )
            : [];

        return (
            <View style={{flex: 1, marginBottom: 20}}>
                <TextInput
                    value={query}
                    onChangeText={setQuery}
                    placeholder={placeholder}
                    placeholderTextColor="#666"
                    style={{
                        backgroundColor: "#111",
                        color: "#fff",
                        padding: 12,
                        borderRadius: 8,
                        marginBottom: 10,
                    }}
                />

                {selected && (
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginBottom: 10,
                        }}
                    >
                        <FontAwesome5
                            name="check-circle"
                            size={16}
                            color="#0f0"
                            style={{marginRight: 8}}
                        />
                        <Text style={{color: "#0f0", fontSize: 16}}>{selected.name}</Text>
                    </View>
                )}

                {query.length > 0 && !selected && (
                    <FlatList
                        data={filtered.slice(0, 100)}
                        keyExtractor={(item, index) => item.id || index.toString()}
                        renderItem={({item}) => renderItem({item, onSelect: setSelected})}
                        style={{maxHeight: 200}}
                        nestedScrollEnabled={true}
                    />
                )}
            </View>
        );
    };

    const renderInteraction = () => {
        if (loading) return <ActivityIndicator size="large" color="#0f0"/>;
        if (!interaction) return null;

        let color = "#aaa";
        if (interaction.result === "Safe") color = "#2ecc71";
        if (interaction.result === "Caution") color = "#f1c40f";
        if (interaction.result === "Unsafe") color = "#e67e22";
        if (interaction.result === "Dangerous") color = "#e74c3c";

        return (
            <View
                style={{
                    backgroundColor: "#222",
                    padding: 15,
                    borderRadius: 10,
                    marginTop: 20,
                    flexDirection: "row",
                    alignItems: "center",
                }}
            >
                {interaction.emoji && (
                    <Text style={{fontSize: 30, marginRight: 10}}>{interaction.emoji}</Text>
                )}
                <View>
                    <Text
                        style={{
                            color,
                            fontSize: 20,
                            fontWeight: "bold",
                            marginBottom: 10,
                        }}
                    >
                        {interaction.result || "No information"}
                    </Text>
                    <Text style={{color: "#fff", fontSize: 16}}>
                        {interaction.note || "No information"}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <FlatList
            style={{flex: 1, backgroundColor: "#000", padding: 20, paddingTop: 50}}
            ListHeaderComponent={
                <>
                    <Text
                        style={{
                            color: "#fff",
                            fontSize: 22,
                            fontWeight: "bold",
                            marginBottom: 20,
                        }}
                    >
                        Substance Interaction Checker
                    </Text>

                    {(selected1 || selected2) && (
                        <TouchableOpacity
                            onPress={() => {
                                setSelected1(null);
                                setSelected2(null);
                                setQuery1("");
                                setQuery2("");
                                setInteraction(null);
                            }}
                            style={{
                                marginBottom: 20,
                                padding: 10,
                                backgroundColor: "#555",
                                borderRadius: 8,
                            }}
                        >
                            <Text style={{color: "#fff", textAlign: "center"}}>New Search</Text>
                        </TouchableOpacity>
                    )}

                    {renderSearchBox("First substance...", query1, setQuery1, selected1, setSelected1)}
                    {renderSearchBox("Second substance...", query2, setQuery2, selected2, setSelected2)}

                    {renderInteraction()}
                </>
            }
            data={[]}
            renderItem={null}
        />
    );
}
