import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Linking,
  SafeAreaViewBase
} from "react-native";

// import {
//   SafeAreaView ,
//   View ,
//   Text ,  // web  ,   -> RN everything is in
//   TextInput , // web ->  RN ->
//   TouchableOpacity, web : button RN->
//   FlatList , // web : .map() RN ->  (virtualized)
//   ScrollView , web overflow scroll -> RN
//   ActivityIndicator ,
//   StyleSheet , web css file -> RN : StyleSheet.create()
//   Alert ,
//   Linking
// } from "react-native"

const RPC = "https://api.mainnet-beta.solana.com";

const rpc = async (method: string, params: any[]) => {
  const res = await fetch(RPC, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params })
  });

  const json = await res.json();
  if (json.error) throw new Error(json.error.message);
  return json.result;
};

const getBalance = async (addr: String) => {
  const result = await rpc("getBalance", [addr]);
  return result.value / 1_000_000_000;
};

const getToken = async (addr: string) => {
  const result = await rpc("getTokenAccountsByOwner", [
    addr,
    { programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" },
    { encoding: "jsonParsed" },
  ]);

  return (result.value || [])
    .map((a: any) => ({
      mint: a.account.data.parsed.info.mint,
      amount: a.account.data.parsed.info.tokenAmount.uiAmount,
    }))
    .filter((t: any) => t.amount > 0);
};

const getTxns = async (addr: string) => {
  const sigs = await rpc("getSignaturesForAddress", [addr, { limit: 10 }]);

  return sigs.map((s: any) => ({
    sig: s.signature,
    time: s.blockTime,
    ok: !s.err,
  }));
};

const short = (s: string, n = 4) =>
  `${s.slice(0, n)}...${s.slice(-n)}`;

const timeAgo = (ts: number) => {
  const s = Math.floor(Date.now() / 1000 - ts);

  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 84600) return `${Math.floor(s / 3600)}h ago`;

  return `${Math.floor(s / 84600)}d ago`;
};



export default function App() {
  const [address, setAddress] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [tokens, setTokens] = useState<any[]>([]);
  const [txns, setTxns] = useState<any[]>([]);

  const search = async () => {
    const addr : string = address.trim() ;
    setLoading(true) ;
    try {
      const [bal, tok, tx] = await Promise.all([
        getBalance(addr) ,
        getToken(addr),
        getTxns(addr) 
      ]);

      setBalance(bal) ;
      setTokens(tok) ;
      setTxns(tx) ;
    }catch(error: any) {
      Alert.alert("Error" , error.message)
    }finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll}>

        <Text style={styles.title}>
          SolScan
        </Text>

        <Text style={styles.subtitle}>
          Enter a Solana address to view detail
        </Text>

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

        <View style={styles.btnRow}>
          <TouchableOpacity
            style={[styles.btn, loading && styles.btnDisabled]}
            disabled={loading}
            activeOpacity={0.8}
            onPress={() => search()}
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.btnText}>Search</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnGhost}
            activeOpacity={0.7}
          >
            <Text style={styles.btnGhostText}>
              Demo
            </Text>
          </TouchableOpacity>
        </View>

        {balance != null && (
          <View style={styles.balanceContainer}>
            <Text style={styles.balanceLabel}>
              SQL Balance
            </Text>

            <View style={styles.balanceRow}>
              <Text style={styles.balance}>
                {balance.toFixed(4)}
              </Text>

              <Text style={styles.sol}>
                SOL
              </Text>
            </View>

            {/* <Text>{short(address.trim() , 6)}</Text> */}
          </View>
        )}

        {tokens.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>
              Tokens ({tokens.length})
            </Text>

            <FlatList
              data={tokens}
              keyExtractor={(t) => t.mint}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View style={styles.tokenRow}>
                  <Text style={styles.tokenMint}>
                    {short(item.mint, 6)}
                  </Text>

                  <Text style={styles.tokenAmount}>
                    {item.amount}
                  </Text>
                </View>
              )}
            />
          </>
        )}

        {txns.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>
              Recent Transaction
            </Text>

            <FlatList
              data={txns}
              keyExtractor={(t) => t.sig}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.row}
                  onPress={() =>
                    Linking.openURL(
                      `https://solscan.io/tx/${item?.sig}`
                    )
                  }
                  activeOpacity={0.7}
                >
                  <Text style={styles.txText}>
                    {short(item.sig, 8)}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

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
    shadowOffset: { width: 0, height: 4 },
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
  },

  txText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "400",
  },
});