import React from "react";
import { View, Text, ScrollView, Linking } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

export default function DetailScreen({ route }: any) {
    const { substance } = route.params;

    const Section = ({ title, icon, children, color = "#0af" }: any) => (
        <View style={{ marginVertical: 12 }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}>
                {icon && <FontAwesome5 name={icon} size={18} color={color} style={{ marginRight: 8 }} />}
                <Text style={{ fontSize: 18, fontWeight: "bold", color }}>{title}</Text>
            </View>
            {children}
        </View>
    );

    const renderBadges = (items: string[], bgColor = "#222") => (
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 5 }}>
            {items.map((i, idx) => (
                <Text
                    key={idx}
                    style={{
                        backgroundColor: bgColor,
                        color: "#aaa",
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                        borderRadius: 12,
                        fontSize: 14,
                        marginRight: 5,
                        marginBottom: 5,
                    }}
                >
                    {i}
                </Text>
            ))}
        </View>
    );

    const renderDose = (doseObj: any) => {
        if (!doseObj) return null;
        const order = ["Threshold", "Light", "Common", "Strong", "Heavy"];
        const colors: any = {
            Threshold: "#2ecc71",
            Light: "#27ae60",
            Common: "#f1c40f",
            Strong: "#e67e22",
            Heavy: "#e74c3c",
        };
        return (
            <View style={{ marginTop: 5 }}>
                {Object.entries(doseObj).map(([route, doses], idx) => (
                    <View key={idx} style={{ marginBottom: 12 }}>
                        <Text style={{ color: "#0f0", fontSize: 16, fontWeight: "bold" }}>
                            {route}
                        </Text>
                        {typeof doses === "string" ? (
                            <Text style={{ color: "#aaa", fontSize: 14 }}>• {doses}</Text>
                        ) : (
                            order
                                // @ts-ignore
                                .filter((strength) => doses[strength] !== undefined)
                                .map((strength, i) => {
                                    const val = (doses as any)[strength];
                                    if (val && typeof val === "object" && "value" in val && "_unit" in val) {
                                        return (
                                            <Text
                                                key={i}
                                                style={{
                                                    color: colors[strength] || "#aaa",
                                                    fontSize: 14,
                                                    marginLeft: 10,
                                                }}
                                            >
                                                • {strength}: {val.value} {val._unit}
                                            </Text>
                                        );
                                    }
                                    return (
                                        <Text
                                            key={i}
                                            style={{
                                                color: colors[strength] || "#aaa",
                                                fontSize: 14,
                                                marginLeft: 10,
                                            }}
                                        >
                                            • {strength}: {String(val)}
                                        </Text>
                                    );
                                })
                        )}
                    </View>
                ))}
            </View>
        );
    };

    const renderDuration = (durationObj: any) => {
        if (!durationObj) return null;
        if (typeof durationObj === "object" && "value" in durationObj && "_unit" in durationObj) {
            return (
                <Text style={{ color: "#aaa", fontSize: 14, marginBottom: 2 }}>
                    • {durationObj.value} {durationObj._unit}
                </Text>
            );
        }
        return (
            <View style={{ marginTop: 5 }}>
                {Object.entries(durationObj)
                    .filter(([key]) => key !== "_unit" && key !== "value")
                    .map(([route, val], idx) => {
                        if (val && typeof val === "object" && "value" in val && "_unit" in val) {
                            return (
                                <Text key={idx} style={{ color: "#aaa", fontSize: 14, marginBottom: 3 }}>
                                    • <Text style={{ fontWeight: "bold", color: "#0af" }}>{route}</Text>: {val.value} {val._unit}
                                </Text>
                            );
                        }
                        if (typeof val === "string" || typeof val === "number") {
                            const unit = (durationObj as any)._unit ? ` ${(durationObj as any)._unit}` : "";
                            return (
                                <Text key={idx} style={{ color: "#aaa", fontSize: 14, marginBottom: 3 }}>
                                    • <Text style={{ fontWeight: "bold", color: "#0af" }}>{route}</Text>: {val}{unit}
                                </Text>
                            );
                        }
                        return null;
                    })}
            </View>
        );
    };

    return (
        <ScrollView style={{ flex: 1, backgroundColor: "#111", padding: 20 }} contentContainerStyle={{ paddingBottom: 40 }}>
            <Text style={{ color: "#0f0", fontSize: 28, fontWeight: "bold", marginBottom: 10 }}>
                {substance.name}
            </Text>

            {substance.commonNames?.length > 0 && (
                <Section title="Aliases / Common Names" icon="tags" color="#f39c12">
                    <View style={{ maxHeight: 180 }}>
                        <ScrollView nestedScrollEnabled>
                            {renderBadges(substance.commonNames, "#333")}
                        </ScrollView>
                    </View>
                </Section>
            )}

            {substance.categories?.length > 0 && (
                <Section title="Categories" icon="layer-group" color="#9b59b6">
                    <View style={{ maxHeight: 180 }}>
                        <ScrollView nestedScrollEnabled>
                            {renderBadges(substance.categories, "#333")}
                        </ScrollView>
                    </View>
                </Section>
            )}

            {substance.formatted_effects?.length > 0 && (
                <Section title="Effects" icon="bolt" color="#e74c3c">
                    <View style={{ maxHeight: 180 }}>
                        <ScrollView nestedScrollEnabled>
                            {renderBadges(substance.formatted_effects, "#333")}
                        </ScrollView>
                    </View>
                </Section>
            )}

            {Object.keys(substance.formatted_onset || {}).length > 0 && (
                <Section title="Onset" icon="hourglass-start" color="#3498db">
                    {renderDuration(substance.formatted_onset)}
                </Section>
            )}

            {Object.keys(substance.formatted_duration || {}).length > 0 && (
                <Section title="Duration" icon="hourglass-half" color="#2980b9">
                    {renderDuration(substance.formatted_duration)}
                </Section>
            )}

            {Object.keys(substance.formatted_dose || {}).length > 0 && (
                <Section title="Dose" icon="prescription-bottle" color="#1abc9c">
                    {renderDose(substance.formatted_dose)}
                </Section>
            )}

            {substance.properties?.summary && (
                <Section title="Summary" icon="info-circle" color="#e67e22">
                    <Text style={{ color: "#aaa" }}>{substance.properties.summary}</Text>
                </Section>
            )}

            {substance.properties?.["half-life"] && (
                <Section title="Half-life" icon="clock" color="#16a085">
                    <Text style={{ color: "#aaa" }}>{substance.properties["half-life"]}</Text>
                </Section>
            )}

            {substance.properties?.["test-kits"] && (
                <Section title="Test Kits" icon="vial" color="#8e44ad">
                    <Text style={{ color: "#aaa" }}>{substance.properties["test-kits"]}</Text>
                </Section>
            )}

            {Object.keys(substance.pweffects || {}).length > 0 && (
                <Section title="Psychonautwiki Effects" icon="brain" color="#c0392b">
                    {Object.entries(substance.pweffects).map(([effect, link], idx) => (
                        <Text
                            key={idx}
                            style={{ color: "#0af", textDecorationLine: "underline", marginBottom: 3 }}
                            onPress={() => Linking.openURL(link)}
                        >
                            {effect}
                        </Text>
                    ))}
                </Section>
            )}

            {substance.links && Object.keys(substance.links).length > 0 && (
                <Section title="Links / Sources" icon="link" color="#8e44ad">
                    {Object.entries(substance.links).map(([k, v], idx) => (
                        <Text
                            key={idx}
                            style={{ color: "#0af", textDecorationLine: "underline", marginBottom: 3 }}
                            onPress={() => Linking.openURL(v)}
                        >
                            {k}
                        </Text>
                    ))}
                </Section>
            )}

            {substance.dose_note && (
                <Section title="Dose Note" icon="sticky-note" color="#e67e22">
                    <Text style={{ color: "#aaa" }}>{substance.dose_note}</Text>
                </Section>
            )}
        </ScrollView>
    );
}
