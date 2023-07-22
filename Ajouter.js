import {
  Alert,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  Button,
} from "react-native";
import { manipulateAsync } from "expo-image-manipulator";
import React, { useState, useEffect, useRef } from "react";
import { Camera, CameraType } from "expo-camera";
import axios from "axios";

export default function Ajouter({ navigation }) {
  const [image, setImage] = useState(null);
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [load, setLoad] = useState(false);
  const [show, setShow] = useState(false);
  const [type, setType] = useState(CameraType.front);
  const [hasCameraPermission, setHasCameraPermission] = useState();
  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraPermission.status === "granted");
    })();
  }, []);
  let cameraRef = useRef();

  if (hasCameraPermission === null) {
    return <View />;
  }
  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }
  const sendFaces = async () => {
    setLoad(true);
    const formData = new FormData();
    formData.append("label", prenom + " " + nom);
    formData.append("photo", image);

    axios.post("http://192.168.1.13:4000/post", formData);
    setTimeout(() => {
      setLoad(false);
      Alert.alert(
        "Compte ajouté",
        `Le compte de ${prenom} ${nom} est ajouté avec succées`,
        [
          {
            text: "D'accord",
            onPress: () => navigation.navigate("authentifier"),
          },
        ]
      );
    }, 6000);
  };
  return (
    <View style={styles.conta}>
      {show ? (
        <View style={styles.conta}>
          <Camera ref={cameraRef} style={styles.camera} type={type}></Camera>
          <Button
            title="Prendre"
            onPress={async () => {
              let options = {
                quality: 0.5,
                base64: true,
              };
              let newPhoto = await cameraRef.current.takePictureAsync(options);
              const manipResult = await manipulateAsync(
                `data:image/png;base64,${newPhoto.base64}`,
                [{ resize: { width: 245, height: 327 } }],
                { base64: true }
              );
              setShow(false);
              setImage(manipResult.base64);
            }}
          />
        </View>
      ) : (
        <View>
          <Text style={styles.prenom}> Prénom :</Text>
          <TextInput
            onChangeText={(e) => setPrenom(e)}
            defaultValue={prenom}
            selectionColor={"black"}
            style={styles.input}
          />
          <Text style={styles.nom}> Nom :</Text>
          <TextInput
            onChangeText={(e) => setNom(e)}
            defaultValue={nom}
            selectionColor={"black"}
            style={styles.input}
          />
          <Text style={styles.phot}>Prendre une photo :</Text>
          <TouchableOpacity onPress={() => setShow(true)} style={styles.auth}>
            <Text style={styles.commencer}>Ouvrir caméra </Text>
          </TouchableOpacity>
          {load ? <ActivityIndicator size="large" /> : null}
          {image ? (
            <View
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                source={{ uri: `data:image/png;base64,${image}` }}
                style={{
                  width: 300,
                  height: 300,
                  marginTop: 10,
                  marginBottom: 10,
                }}
              />
              <TouchableOpacity onPress={sendFaces} style={styles.auth}>
                <Text style={styles.commencer}>Sauvegarder </Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  conta: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  prenom: {
    fontSize: 15,
    fontWeight: "bold",
    marginLeft: 10,
    marginTop: 10,
  },
  nom: {
    fontSize: 15,
    fontWeight: "bold",
    marginLeft: 10,
  },
  phot: {
    fontSize: 15,
    fontWeight: "bold",
    marginLeft: 15,
  },
  nom: {
    fontSize: 15,
    fontWeight: "bold",
    marginLeft: 10,
  },
  auth: {
    height: 40,
    margin: 12,
    width: 387,
    marginTop: 10,
    backgroundColor: "#18B6EC",
    borderWidth: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  commencer: { fontSize: 15, fontWeight: "bold" },
});
/*<Button
title="S'authentifer"
onPress={() => navigation.navigate("authentifier")}
/>*/
