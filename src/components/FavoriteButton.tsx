import { TouchableOpacity , StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useWalletStore } from "../stores/wallet-store";

interface Props {
    address : string 
}

export function FavoriteButton({address} : Props) {
    const addFavorite = useWalletStore((s) => s.addFavorites) ;
    const removeFavorite = useWalletStore((s) => s.removeFavorites) ;
    const isFavorite = useWalletStore((s) => s.isFavorite) ;

    const favorited = isFavorite(address) ;

    return (
        <TouchableOpacity onPress={() => {
            if (favorited) {
                removeFavorite(address) ;
            }else {
                addFavorite(address) ;
            }
        }}
        style = {s.button}
        >
            <Ionicons 
                name={favorited ? "heart" : "heart-outline"}            
                size={24}
                color={favorited ? "#FF4545" : "#666"}
            />
        </TouchableOpacity>
    )
}

const s = StyleSheet.create({
    button : {
        padding : 8
    }
})