import { View, Button, StyleSheet, Text, TouchableOpacity } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { Camera, CameraType } from "expo-camera";
import * as FaceDetector from "expo-face-detector";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { manipulateAsync } from "expo-image-manipulator";
import axios from "axios";

export default function Authentification({ navigation }) {
  const [bienvenu, setBienvenu] = useState(false);
  const [reload, setReload] = useState(false);
  const [commencer, setCommencer] = useState({
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  });
  const [show, setShow] = useState(false);
  const [nom, setNom] = useState("");
  const [prob, setProb] = useState(false);
  let cameraRef = useRef();
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [type, setType] = useState(CameraType.front);

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

  const handleFacesDetected = async ({ faces }) => {
    if (faces.length === 1) {
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

      setCommencer({
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      });
      setShow(false);
      setReload(true);
      const formData = new FormData();
      formData.append("filee", manipResult.base64);
      axios.post("http://192.168.1.13:4000/stat", formData).then((res) => {
        if (res.data.oyo === "prob") {
          setReload(false);
          setProb(true);
          setTimeout(() => {
            setProb(false);
            setBienvenu(false);
          }, 5000);
        } else {
          setNom(res.data.aya);
          setBienvenu(true);
          setReload(false);
          setTimeout(() => {
            setBienvenu(false);
          }, 5000);
        }
      });
    }
  };

  return (
    <View style={commencer}>
      {!show && !reload && !bienvenu && !prob ? (
        <TouchableOpacity
          onPress={() => {
            setShow(true);
            setCommencer({ flex: 1 });
          }}
          style={styles.auth}
        >
          <Text style={styles.commencer}>Commencer {"\n"} le pointage</Text>
        </TouchableOpacity>
      ) : null}

      {show ? (
        <Camera
          autoFocus={false}
          ref={cameraRef}
          onFacesDetected={handleFacesDetected}
          faceDetectorSettings={{
            mode: FaceDetector.FaceDetectorMode.fast,
            detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
            runClassifications: FaceDetector.FaceDetectorClassifications.none,
            minDetectionInterval: 10000,
          }}
          style={styles.camera}
          type={type}
        />
      ) : null}

      {nom !== "" && bienvenu ? (
        <View style={styles.cont}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              bottom: 15,
              marginBottom: 25,
            }}
          >
            <Text style={styles.verifie}>Identitée vérifiée</Text>
            <MaterialIcons name="verified" size={35} color="green" />
          </View>
          <Text style={styles.bienvenu}>Bienvenue {nom} </Text>
        </View>
      ) : null}

      {prob ? (
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            bottom: 15,
          }}
        >
          <Text style={styles.verifie}>Vous n'etes pas identifié</Text>
          <AntDesign name="closecircle" size={35} color="red" />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
  },
  Vérification: { fontSize: 30, fontWeight: "bold" },
  cont: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  auth: {
    height: 100,
    width: 300,
    backgroundColor: "#18B6EC",
    borderWidth: 1,
    borderRadius: 5,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    bottom: 20,
  },
  commencer: { fontSize: 30, fontWeight: "bold" },
  bienvenu: { fontSize: 30, fontWeight: "bold", bottom: 30 },
  verifie: {
    fontSize: 30,
    fontWeight: "bold",
    bottom: 6,
    marginRight: 5,
  },
});
