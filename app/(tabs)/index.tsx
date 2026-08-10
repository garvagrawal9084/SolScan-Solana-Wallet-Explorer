import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const RPC = "https://api.mainnet-beta.solana.com";

const rpc = async (method: string, params: any[]) => {
    const res = await fetch(RPC, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            method,
            params,
        }),
    });

    const json = await res.json();

    if (json.error) {
        throw new Error(json.error.message);
    }

    return json.result;
};

const getBalance = async (addr: string) => {
    const result = await rpc("getBalance", [addr]);

    return result.value / 1_000_000_000;
};

const getToken = async (addr: string) => {
    console.log("GET TOKEN CALLED:", addr);

    const result = await rpc("getTokenAccountsByOwner", [
        addr,
        {
            programId:
                "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
        },
        {
            encoding: "jsonParsed",
        },
    ]);

    console.log(
        "TOKEN RPC RESULT:",
        JSON.stringify(result, null, 2)
    );

    const tokens = (result.value || []).map((account: any) => {
        const info = account.account.data.parsed.info;

        return {
            pubkey: account.pubkey,
            mint: info.mint,
            amount: info.tokenAmount.uiAmount,
            rawAmount: info.tokenAmount.amount,
            decimals: info.tokenAmount.decimals,
        };
    });

    console.log(
        "TOKENS BEFORE FILTER:",
        JSON.stringify(tokens, null, 2)
    );

    const filteredTokens = tokens.filter(
        (token: any) => Number(token.rawAmount) > 0
    );

    console.log(
        "FINAL TOKENS:",
        JSON.stringify(filteredTokens, null, 2)
    );

    return filteredTokens;
};

const getTxns = async (addr: string) => {
    const sigs = await rpc("getSignaturesForAddress", [
        addr,
        {
            limit: 10,
        },
    ]);

    return sigs.map((signature: any) => ({
        sig: signature.signature,
        time: signature.blockTime,
        ok: !signature.err,
    }));
};

const short = (value: string, length = 4) =>
    `${value.slice(0, length)}...${value.slice(-length)}`;

const timeAgo = (timestamp: number) => {
    const seconds = Math.floor(
        Date.now() / 1000 - timestamp
    );

    if (seconds < 60) {
        return `${seconds}s ago`;
    }

    if (seconds < 3600) {
        return `${Math.floor(seconds / 60)}m ago`;
    }

    if (seconds < 86400) {
        return `${Math.floor(seconds / 3600)}h ago`;
    }

    return `${Math.floor(seconds / 86400)}d ago`;
};

export default function WalletScreen() {
    const router = useRouter();

    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(false);
    const [balance, setBalance] = useState<number | null>(null);
    const [tokens, setTokens] = useState<any[]>([]);
    const [txns, setTxns] = useState<any[]>([]);

    const search = async () => {
        const addr = address.trim();

        if (!addr) {
            Alert.alert(
                "Error",
                "Please enter a wallet address"
            );
            return;
        }

        setLoading(true);

        try {
            const [balanceResult, tokenResult, transactionResult] =
                await Promise.all([
                    getBalance(addr),
                    getToken(addr),
                    getTxns(addr),
                ]);

            console.log("BALANCE:", balanceResult);
            console.log("TOKENS:", tokenResult);
            console.log("TRANSACTIONS:", transactionResult);

            setBalance(balanceResult);
            setTokens(tokenResult);
            setTxns(transactionResult);
        } catch (error: any) {
            console.log("SEARCH ERROR:", error);

            Alert.alert(
                "Error",
                error.message || "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleDemo = () => {
        setAddress(
            "FireuLYd4yjJBhXQyBs3Mq6ZpNEjyHPNPG2eqhTP9RHV"
        );
    };

    return (
        <SafeAreaView style={styles.safe}>
            <ScrollView style={styles.scroll}>
                <Text style={styles.title}>
                    SolScan
                </Text>

                <Text style={styles.subtitle}>
                    Enter a Solana address to view detail
                </Text>

                {/* Search Input */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter wallet address"
                        placeholderTextColor="#6B7280"
                        value={address}
                        onChangeText={setAddress}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                </View>

                {/* Buttons */}
                <View style={styles.btnRow}>
                    <TouchableOpacity
                        style={[
                            styles.btn,
                            loading && styles.btnDisabled,
                        ]}
                        disabled={loading}
                        activeOpacity={0.8}
                        onPress={search}
                    >
                        {loading ? (
                            <ActivityIndicator color="#000" />
                        ) : (
                            <Text style={styles.btnText}>
                                Search
                            </Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.btnGhost}
                        activeOpacity={0.7}
                        onPress={handleDemo}
                    >
                        <Text style={styles.btnGhostText}>
                            Demo
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Balance */}
                {balance != null && (
                    <View style={styles.balanceContainer}>
                        <Text style={styles.balanceLabel}>
                            SOL Balance
                        </Text>

                        <View style={styles.balanceRow}>
                            <Text style={styles.balance}>
                                {balance.toFixed(4)}
                            </Text>

                            <Text style={styles.sol}>
                                SOL
                            </Text>
                        </View>
                    </View>
                )}

                {/* Tokens */}
                {tokens.length > 0 && (
                    <>
                        <Text style={styles.sectionTitle}>
                            Tokens ({tokens.length})
                        </Text>

                        <FlatList
                            data={tokens}
                            keyExtractor={(token) =>
                                token.mint
                            }
                            scrollEnabled={false}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.tokenRow}
                                    activeOpacity={0.7}
                                    onPress={() => {
                                        console.log("CLICKED MINT:", item.mint);

                                        router.push({
                                            pathname: "/token/[mint]",
                                            params: {
                                                mint: item.mint,
                                            },
                                        });
                                    }}
                                >
                                    <Text style={styles.tokenMint}>
                                        {short(item.mint, 6)}
                                    </Text>

                                    <Text style={styles.tokenAmount}>
                                        {item.amount}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />
                    </>
                )}

                {/* Recent Transactions */}
                {txns.length > 0 && (
                    <>
                        <Text style={styles.sectionTitle}>
                            Recent Transactions
                        </Text>

                        <FlatList
                            data={txns}
                            keyExtractor={(transaction) =>
                                transaction.sig
                            }
                            scrollEnabled={false}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.row}
                                    activeOpacity={0.7}
                                    onPress={() => {
                                        router.push(
                                            `/transaction/${item.sig}`
                                        );
                                    }}
                                >
                                    <View
                                        style={styles.txInfo}
                                    >
                                        <Text
                                            style={
                                                styles.txText
                                            }
                                        >
                                            {short(
                                                item.sig,
                                                8
                                            )}
                                        </Text>

                                        {item.time && (
                                            <Text
                                                style={
                                                    styles.txTime
                                                }
                                            >
                                                {timeAgo(
                                                    item.time
                                                )}
                                            </Text>
                                        )}
                                    </View>

                                    <Text
                                        style={[
                                            styles.txStatus,
                                            {
                                                color: item.ok
                                                    ? "#14F195"
                                                    : "#FF4D67",
                                            },
                                        ]}
                                    >
                                        {item.ok
                                            ? "Success"
                                            : "Failed"}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />
                    </>
                )}

                <View style={{ height: 100 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: "#0D0D12",
    },

    scroll: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 16,
    },

    title: {
        color: "#FFFFFF",
        fontSize: 32,
        fontWeight: "700",
        marginBottom: 8,
        letterSpacing: -0.5,
        marginTop: 15,
    },

    subtitle: {
        color: "#6B7280",
        fontSize: 15,
        fontWeight: "400",
        marginBottom: 28,
        marginTop: 4,
    },

    inputContainer: {
        backgroundColor: "#16161D",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#2A2A35",
        paddingHorizontal: 16,
        paddingVertical: 4,
    },

    input: {
        color: "#FFFFFF",
        fontSize: 15,
        paddingVertical: 14,
        fontWeight: "400",
    },

    btnRow: {
        flexDirection: "row",
        gap: 12,
        marginTop: 16,
    },

    btn: {
        flex: 1,
        backgroundColor: "#14F195",
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#14F195",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },

    btnDisabled: {
        opacity: 0.6,
    },

    btnText: {
        color: "#0D0D12",
        fontWeight: "600",
        fontSize: 16,
        letterSpacing: 0.3,
    },

    btnGhost: {
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 14,
        backgroundColor: "#16161D",
        borderWidth: 1,
        borderColor: "#2A2A35",
    },

    btnGhostText: {
        color: "#9CA3AF",
        fontSize: 15,
        fontWeight: "500",
    },

    balanceContainer: {
        marginTop: 28,
        backgroundColor: "#16161D",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#2A2A35",
        padding: 18,
    },

    balanceLabel: {
        color: "#6B7280",
        fontSize: 14,
        marginBottom: 8,
    },

    balanceRow: {
        flexDirection: "row",
        alignItems: "baseline",
        gap: 8,
    },

    balance: {
        color: "#FFFFFF",
        fontSize: 30,
        fontWeight: "700",
    },

    sol: {
        color: "#14F195",
        fontSize: 15,
        fontWeight: "600",
    },

    sectionTitle: {
        color: "#FFFFFF",
        fontSize: 17,
        fontWeight: "600",
        marginTop: 26,
        marginBottom: 10,
    },

    tokenRow: {
        backgroundColor: "#16161D",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#2A2A35",
        paddingHorizontal: 16,
        paddingVertical: 14,
        marginBottom: 8,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    tokenMint: {
        color: "#D1D5DB",
        fontSize: 14,
        fontFamily: "monospace",
    },

    tokenDecimals: {
        color: "#6B7280",
        fontSize: 11,
        marginTop: 4,
    },

    tokenRight: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },

    tokenAmount: {
        color: "#14F195",
        fontSize: 14,
        fontWeight: "600",
    },

    row: {
        backgroundColor: "#16161D",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#2A2A35",
        padding: 14,
        marginBottom: 8,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    txInfo: {
        flex: 1,
    },

    txText: {
        color: "#FFFFFF",
        fontSize: 13,
        fontWeight: "400",
        fontFamily: "monospace",
    },

    txTime: {
        color: "#6B7280",
        fontSize: 12,
        marginTop: 5,
    },

    txStatus: {
        fontSize: 12,
        fontWeight: "600",
        marginLeft: 12,
    },
});

