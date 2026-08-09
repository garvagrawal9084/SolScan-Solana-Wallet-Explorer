import { Ionicons } from '@expo/vector-icons'
import React, { Dispatch, SetStateAction } from 'react'
import { Text, TextInput, TouchableOpacity, View , StyleSheet } from 'react-native'

interface inputs {
    token : string ,
    setToken : Dispatch<SetStateAction<string>>
}

export const Card = ({token , setToken} : {token : string , setToken : Dispatch<SetStateAction<string>>}) => {
    return (
        <>
            <View style={s.card}>
                <View style={s.cardHeader}>
                    <TouchableOpacity style={[s.tokenSelector, { backgroundColor: "#6B7280" }]}>
                        <View style={[s.tokenIcon, { backgroundColor: "#9945FF" }]}>
                            <Text style={s.tokenIconText}>S</Text>
                        </View>
                        <Text style={s.tokenName}>{token}</Text>
                        <Ionicons name='chevron-down' size={18} color={'#888'} />
                    </TouchableOpacity>
                    <TextInput
                        style={s.amountInput}
                        value={token}
                        onChangeText={setToken}
                        keyboardType="numeric"
                        placeholder="0"
                        placeholderTextColor={"#666"}
                    />
                </View>
                <View style={s.cardFooter}>
                    <Text style={s.balanceText}>Balance : 0.0661 {token}</Text>
                    <Text style={s.usdText}>$499.749</Text>
                </View>
            </View>
        </>
    )
}

const s = StyleSheet.create({
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
})

