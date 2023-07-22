import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Button, SafeAreaView, View, StatusBar, Text, TouchableOpacity } from "react-native";
import { Camera } from "expo-camera";
import axios from "axios";

export default function App() {
  const [reload, setReload] = useState(false);
  const [bienvenu, setBienvenu] = useState(true);
  const [nouveau, setNouveau] = useState(false);
  const [show, setShow] = useState(false);
  const [nom, setNom] = useState("");
  let cameraRef = useRef();
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.front);
  const [departMessage, setDepartMessage] = useState("");

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraPermission.status === "granted");
    })();
  }, []);

  if (hasCameraPermission === null) {
    return <View />;
  }
  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const captureImage = async () => {
    if (cameraRef.current) {
      let options = {
        quality: 0.5,
        base64: true,
      };

      let newPhoto = await cameraRef.current.takePictureAsync(options);
      setShow(false);
      setReload(true);
      setDepartMessage("Image captured, processing...");
      const formData = new FormData();
      formData.append("filee", newPhoto.base64);
      axios.post("http://192.168.1.11:4000/stat", formData).then((res) => {
        setNom(res.data.aya);
        setNouveau(true);
        setReload(false);
        setDepartMessage(""); // Reset the departure message
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {show ? (
        <Camera
          autoFocus={Camera.Constants.AutoFocus.off}
          ref={cameraRef}
          style={styles.camera}
          type={type}
        />
      ) : null}
      {bienvenu ? (
        <Button
          title="S'authentifier"
          onPress={() => {
            setShow(true); // Show the camera preview
            setBienvenu(false);
          }}
        />
      ) : null}
      {nouveau ? (
        <Button
          style={styles.auth}
          title="Nouveau"
          onPress={() => {
            setNom("");
            setShow(true); // Show the camera preview
            setNouveau(false);
          }}
        />
      ) : null}
      {nom !== "" ? <Text>Bienvenue {nom}</Text> : null}
      {departMessage ? <Text>{departMessage}</Text> : null}
      {show && !nouveau ? (
        <TouchableOpacity onPress={captureImage} style={styles.captureButton}>
          <Text style={styles.captureButtonText}>Capture Image</Text>
        </TouchableOpacity>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  auth: {},
  captureButton: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  captureButtonText: {
    color: "white",
    fontSize: 18,
  },
});
