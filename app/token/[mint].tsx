import {useLocalSearchParams, useRouter} from "expo-router";
import {useEffect, useState} from "react";
import {ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {SafeAreaView} from "react-native-safe-area-context";

interface tokenInfo {
    mint: string;
    supply: string;
    decimals: number;
}

export default function TokenDetailScreen() {
    const {mint} = useLocalSearchParams<{ mint: string }>();
    const router = useRouter();

    const [tokenInfo, setTokenInfo] = useState<tokenInfo | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchTokenInfo = async () => {
        try {
            console.log("MINT RECEIVED:", mint);

            if (!mint) {
                throw new Error("Mint address is missing");
            }

            const res = await fetch(
                "https://api.mainnet-beta.solana.com",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        jsonrpc: "2.0",
                        id: 1,
                        method: "getTokenSupply",
                        params: [mint],
                    }),
                }
            );

            const json = await res.json();

            console.log(
                "RPC RESPONSE:",
                JSON.stringify(json, null, 2)
            );

            if (json.error) {
                throw new Error(json.error.message);
            }

            const value = json.result?.value;

            setTokenInfo({
                mint,
                supply: value?.uiAmountString ?? "Unknown",
                decimals: value?.decimals ?? 0,
            });
        } catch (error: any) {
            console.log(
                "Failed to fetch token info:",
                error.message
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTokenInfo();
    }, [mint]);

    if (loading) {
        return (
            <View style={s.center}>
                <ActivityIndicator size={"large"} color={"#14F195"}/>
            </View>
        )
    }

    return (
        <SafeAreaView style={s.container}>
            <ScrollView>
                <TouchableOpacity style={s.backBotton} onPress={() => router.back()}>
                    <Ionicons name={"arrow-back"} size={24} color="#FFF"/>
                    <Text style={s.backText}>Back</Text>
                </TouchableOpacity>

                {/* Token Header*/}
                <View style={s.header}>
                    <Text style={s.title}>Token Detail</Text>
                </View>

                {/*Mint Address*/}
                <View style={s.card}>
                    <Text style={s.cardLabel}>Mint Address</Text>
                    <Text style={s.mintAddress}>{mint}</Text>
                </View>

                {/*Token Info */}
                {tokenInfo && (
                    <View style={s.card}>
                        <View style={s.infoRow}>
                            <Text style={s.infoLabel}>Total Supply</Text>
                            <Text style={s.infoValue}>{tokenInfo.supply?.toLocaleString() || "Unknown"}</Text>
                        </View>
                        <View style={s.divider} />
                        <View style={s.card}>
                            <View style={s.infoRow}>
                                <Text style={s.infoLabel}>Decimal</Text>
                                <Text style={s.infoValue}>{tokenInfo.decimals || "Unknown"}</Text>
                            </View>
                        </View>
                    </View>
                )}

                {/* View on Solscan */}
                <TouchableOpacity
                    style={s.linkButton}
                    onPress={() => {
                        // We'll add Linking.openURL later
                        // For now this is a placeholder
                    }}
                >
                    <Text style={s.linkButtonText}>View on Solscan ↗</Text>
                </TouchableOpacity>


            </ScrollView>
        </SafeAreaView>
    )
}


const s = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0a0a1a"
    },
    container: {
        flex: 1,
        backgroundColor: "#0a0a1a",
        paddingTop: 20,
        paddingHorizontal: 12
    },
    scroll: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 16,
    },
    backText: {
        color: "#fff",
        fontSize: 16,
        marginLeft: 8
    },
    backBotton: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20
    },
    header: {
        marginBottom: 20
    },
    title: {
        color: "#FFF",
        fontSize: 24,
        fontWeight: "bold"
    },
    card: {
        backgroundColor: "#1a1a2e",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    cardLabel: {
        color: "#888",
        fontSize: 12,
        textTransform: "uppercase",
        letterSpacing: 1,
        marginBottom: 0
    },
    mintAddress: {
        color: "#9945FF",
        fontSize: 13,
        fontFamily: "monospace",
    },
    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 8,
    },
    divider : {
        height : 1,
        backgroundColor: "#2a2a3e",
    },
    infoLabel : {
        color: "#888",
        fontSize: 14,
    },
    infoValue : {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
    },
    linkButton : {
        backgroundColor: "#9945FF20",
        padding: 14,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 8,
    },
    linkButtonText: {
        color: "#9945FF",
        fontSize: 14,
        fontWeight: "600",
    },
})