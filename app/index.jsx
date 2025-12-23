// app/index.jsx
import { Redirect } from "expo-router";
import { useAuthGlobal } from "../src/context/AuthContext";

export default function Index() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
}