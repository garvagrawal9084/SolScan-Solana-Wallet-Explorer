import { SafeAreaView } from 'react-native-safe-area-context';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    ScrollView,
    StyleSheet,
    Alert
} from 'react-native';

import { useState } from 'react';

import { Ionicons } from '@expo/vector-icons'
import {Card} from "../../src/components/Card";

export default function Swap() {
    const [fromAmount, setFromAmount] = useState("100")
    const [toAmount, setToAmount] = useState("0.28014")
    const [fromToken, setFromToken] = useState("USDC")
    const [toToken, setToToken] = useState("SOL")

    const swapToken = () => {
        setFromToken(toToken);
        setToToken(fromToken);
        setFromAmount(toAmount);
        setToAmount(fromAmount);
    }

    const handleSwap = () => {
        if (!fromAmount) return Alert.alert("Enter a amount");

        Alert.alert(
            "Swap",
            `Swapping ${fromAmount} ${fromToken} to ${toAmount} ${toToken}`
        )
    }



    return (
        <SafeAreaView style={s.safe}>
            <ScrollView style={s.scroll} contentContainerStyle={s.content}>
                <Text style={s.title}>Swap Token</Text>

                <Card token={fromAmount} setToken={setFromAmount} />

                <View style={s.arrowContainer}>
                    <TouchableOpacity style={s.swapArrow} onPress={swapToken}>
                        <Ionicons name="arrow-down" size={20} color="#FFF" />
                    </TouchableOpacity>
                </View>

                <Card token={toAmount} setToken={setToAmount} />

                <View>
                    <TouchableOpacity onPress={handleSwap} style = {s.swapBtn}>
                        <Text style = {s.swapText}>Swap</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const s = StyleSheet.create({
    // ScrollView itself
    safe: {
        flex: 1,
        backgroundColor: "#0D0D12",
    },

    scroll: {
        flex: 1,
    },

    content: {
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 30,
    },

    // Page title
    title: {
        color: "#FFFFFF",
        fontSize: 32,
        fontWeight: "700",
        marginBottom: 20,
        letterSpacing: -0.5,
    },

    // Swap card
    card: {
        backgroundColor: "#16161D",
        borderWidth: 1,
        borderColor: "#2A2A35",
        borderRadius: 20,
        padding: 18,
        marginBottom: 12,
    },

    // Top section of card
    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    // Token selector
    tokenSelector: {
        flexDirection: "row",
        alignItems: "center",

        backgroundColor: "#252530",

        paddingLeft: 6,
        paddingRight: 10,
        paddingVertical: 6,

        borderRadius: 24,

        gap: 6,
    },

    // Token circle
    tokenIcon: {
        width: 32,
        height: 32,

        borderRadius: 16,

        alignItems: "center",
        justifyContent: "center",

        backgroundColor: "#9945FF",
    },

    // S inside token circle
    tokenIconText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "700",
    },

    // USDC / SOL text
    tokenName: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "700",
    },

    // Amount input
    amountInput: {
        flex: 1,

        marginLeft: 12,

        color: "#FFFFFF",

        fontSize: 36,
        fontWeight: "600",

        textAlign: "right",

        padding: 0,
    },

    // Bottom section
    cardFooter: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",

        marginTop: 16,
    },

    // Balance text
    balanceText: {
        color: "#8A8A98",
        fontSize: 13,
    },

    // USD value
    usdText: {
        color: "#8A8A98",
        fontSize: 13,
    },

    arrowContainer: {
        alignItems: "center",
        marginVertical: -22,   // ← pulls it up, overlapping both cards
        zIndex: 10,            // ← renders on top of the cards
    },

    swapArrow: {
        backgroundColor: "#0D0D12",
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 3,
        borderColor: "#0D0D12",
    },
    swapBtn : {
        backgroundColor : "#14F195",
        paddingVertical : 16 ,
        borderRadius : 14,
        alignItems : "center" ,
        justifyContent : "center",
        marginTop : 20,
        borderWidth : 1 ,
        shadowColor : "#14F195",
        borderColor: "#252530"
    },
    swapText : {
        color : "#0D0D12" ,
        fontWeight : "600",
        fontSize : 16 ,
        letterSpacing : 0.3
    }
});