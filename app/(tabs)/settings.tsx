import React, { use } from 'react';
import {Text, TouchableOpacity, View , StyleSheet, Pressable} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import { useRouter } from 'expo-router';

export default function settings () {
    const router = useRouter();

    return (
        <SafeAreaView>
            <Text>Settings</Text>
            <TouchableOpacity onPress={() => {
                router.push("/orders")
            }} style={s.order}>
                <Text>My Orders</Text>
            </TouchableOpacity>

            <Pressable style = {{
                marginTop : 20 , 
                padding : 12 ,
                backgroundColor : "#2A2A35" ,
                borderRadius : 8
            }}>
                <Text>My Orders</Text>
            </Pressable>
        </SafeAreaView>
    );
};

const s = StyleSheet.create({
    order : {
        marginTop : 20 ,
        padding : 10 ,
        backgroundColor : "#eee" ,
        borderRadius : 5
    }
})


