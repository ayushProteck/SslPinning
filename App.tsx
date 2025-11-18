import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Dimensions } from 'react-native';
import axios from 'axios';
import { initializeSslPinning } from 'react-native-ssl-public-key-pinning';
import WebView from 'react-native-webview';
const {width} = Dimensions.get("screen");

export default function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const runSecureRequest = async () => {
      try {
        // Initialize SSL Pinning
        await initializeSslPinning({
          'google.com': {
            includeSubdomains: true,
            publicKeyHashes: [
              // 'CLOmM1/OXvSPjw5UOYbAf9GKOxImEp9hhku9W90fHMk=',
              'hxqRlPTu1bMS/0DITB1SSu0vd4u/8l8TjPgfaAp63Gc=',
            ],
          },
        });

        // Axios request with SSL pinning enabled
        const response = await axios.get('https://www.google.com', {
          timeout: 10000,
        });
        console.log(response, "responce");
        setData(response.data);
        setError(null);
      } catch (err : any) {
        console.log(err, "error");
        setError(err.message);
      }
    };
    runSecureRequest();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container} scrollEnabled={true}>
      <Text style={styles.title}>🔐 Axios SSL Pinning Demo</Text>
      {error ? (
        <Text style={styles.error}>❌ Error: {error}</Text>
      ) : data ? (
        <View
          style={{
            flex: 1
          }}
        >
          <Text style={styles.success}>✅ Response received!</Text>
          <WebView
          showsHorizontalScrollIndicator={true}
          style={{
            width: width,
            flex: 1
          }}
            source={{
              html: data
            }}
            javaScriptEnabled={true}
          />
        </View>
      ) : (
        <ActivityIndicator size="large" color="#0000ff" />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, width:"100%" },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  success: { color: 'green', marginTop: 10 },
  error: { color: 'red', marginTop: 10 },
});
