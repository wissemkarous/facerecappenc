import React, { useState, useEffect, useRef } from "react";
import LottieView from "lottie-react-native";
import { LogBox } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Ajouter from "./screens/Ajouter";
import "react-native-gesture-handler";

import Authentification from "./screens/Authentification";
LogBox.ignoreLogs([
  "ViewPropTypes will be removed",
  "ColorPropType will be removed",
]);
import {
  StyleSheet,
  Button,
  ActivityIndicator,
  Image,
  Alert,
  SafeAreaView,
  View,
  StatusBar,
  Text,
  TouchableOpacity,
  Form,
  Platform,
} from "react-native";
import { Camera, CameraType } from "expo-camera";
import * as FaceDetector from "expo-face-detector";
import axios from "axios";
import * as FileSystem from "expo-file-system";

export default function ImagePickerExample() {
  /* const [reload, setReload] = useState(false);
  const [bienvenu, setBienvenu] = useState(true);
  const [nouveau, setNouveau] = useState(false);
  const [show, setShow] = useState(false);
  const [nom, setNom] = useState("");
  const [val, setVal] = useState(null);
  const [image, setImage] = useState(null);
  const [imagee, setImagee] = useState(null);
  const [imgCap, setImgCap] = useState(null);
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
      setShow(false);
      setReload(true);
      const formData = new FormData();
      formData.append("filee", newPhoto.base64);
      axios.post("http://192.168.1.11:4000/stat", formData).then((res) => {
        setNom(res.data.aya);
        setNouveau(true);
        setReload(false);
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {show ? (
        <Camera
          autoFocus={false}
          ref={cameraRef}
          onFacesDetected={handleFacesDetected}
          faceDetectorSettings={{
            mode: FaceDetector.FaceDetectorMode.fast,
            detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
            runClassifications: FaceDetector.FaceDetectorClassifications.none,
            minDetectionInterval: 4000,
            tracking: true,
          }}
          style={styles.camera}
          type={type}
        ></Camera>
      ) : null}
      {bienvenu ? (
        <Button
          title="S'authentifier"
          onPress={() => {
            setShow(!show);
            setBienvenu(false);
          }}
        ></Button>
      ) : null}
      {reload ? (
        <LottieView
          source={require("./assets/16279-ai-face-scana-face-recognition.json")}
          autoPlay
          loop
        />
      ) : null}
      {nouveau ? (
        <Button
          style={styles.auth}
          title="Nouveau"
          onPress={() => {
            setNom("");
            setShow(!show);
            setNouveau(false);
          }}
        ></Button>
      ) : null}
      {nom !== "" ? <Text>Bienvenu {nom} </Text> : null}
    </SafeAreaView>
  );
}
*/
  const Stack = createStackNavigator();
  const Drawer = createDrawerNavigator();
  return (
    <SafeAreaView style={styles.container}>
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="authentifier">
          <Drawer.Screen
            name="ajout"
            component={Ajouter}
            options={{
              headerStyle: {
                backgroundColor: "black",
              },
              title: "Ajouter un compte",
              headerTitleStyle: {
                color: "white",
              },
              headerTitleAlign: "center",
            }}
          />
          <Drawer.Screen
            name="authentifier"
            component={Authentification}
            options={{
              headerStyle: {
                backgroundColor: "black",
              },
              title: "S'authentifier",
              headerTitleStyle: {
                color: "white",
              },
              headerTitleAlign: "center",
            }}
          />
        </Drawer.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
  },
  camera: {
    flex: 1,
  },
  auth: {},
  admin: {},
  buttonContainer: {
    backgroundColor: "#fff",
    alignSelf: "flex-end",
  },
  preview: {
    alignSelf: "stretch",
    flex: 1,
  },
});
