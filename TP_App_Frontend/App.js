import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { Camera, Constants } from 'expo-camera'

import {postPicture, testPost} from './api'

//react native screen that contains a camera view, and makes fetch request to backend
export default function App() {
  const [hasPermission, setHasPermission] = useState(null)
  const [type, setType] = useState(Camera.Constants.Type.back)
  const [ready, setReady] = useState(false)
  const [camera, setCamera] = useState(null)
  const [tpSize, settpSize] = useState(null)

  useEffect(() => {
    //ask for camera permission on mount
    (async () => {
      const { status } = await Camera.requestPermissionsAsync()
      setHasPermission(status === 'granted')
    })()
  }, [])

  //wrapper for call to takePictureAsync() that must be called in an async function
  async function takePicture(){
    if (camera) {
      console.log('snap pressed')
      const options = {
        quality: 0,
        base64: false,
        exif: true,
        skipProcessing: false,
      }

      //Take picture
      let photo = await camera.takePictureAsync(options)

      //Send picture to server
      let measureResponse = await postPicture(photo)
      console.log(`Response in main thread: ${JSON.stringify(measureResponse)}`)
      settpSize(measureResponse)
      console.log(`TP Size: ${tpSize}`) //wont be current because component has not rerendered

      /* //Equivalent way to send picture to server with then instead of await
      postPicture(photo).then( (response) => {
        console.log(`Response with then in main thread: ${response}`)
        settpSize(response)
        console.log(`TP Size: ${tpSize}`)
      }) */

    }
    else {
      console.log('snap pressed but camera was not present')
    }
  }

  //Flips camera between front and rear facing cameras
  function handleFlip() {
    setType(
      type === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    )
  }

  //check if camera has permission and is mounted
  function handleCameraReady() {
    if (hasPermission && camera) {
      setReady(true)
      console.log('TESTING camera is ready')
    }
  }

  //Alternate render views while camera is waiting for permissions
  if (hasPermission === null) {
    return <View/>
  }
  if (hasPermission === false) {
    return <Text>Access to camera has not been granted</Text>
  }

  return (
    <View style={styles.container}>
      <Camera 
        style={styles.camera} 
        type={type}
        ref={ref => {setCamera(ref)}}
        onCameraReady={handleCameraReady}
        ratio={'16:9'}
      >
        <View style={styles.measurementContainer}>
          <Text style={styles.measurementText}>TP Measurement</Text>
          <Text style={styles.measurementText}>{tpSize}in</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleFlip}>
            <Text style={styles.buttonText}> Flip </Text>
          </TouchableOpacity>
          <TouchableOpacity disabled={!ready} style={styles.button} onPress={takePicture}>
            <Text style={styles.buttonText} >Snap</Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 0,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
    borderColor: 'white',
    borderRadius: 10,
    borderWidth: 3,
  },
  buttonText: {
    fontSize: 18, 
    marginBottom: 10, 
    color: 'white'
  },
  measurementContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: Constants.statusBarHeight,
  },
  measurementText: {
    fontSize: 32, 
    color: 'white',
  }
});

