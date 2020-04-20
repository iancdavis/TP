import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { Camera, Constants } from 'expo-camera'

import {postPicture, testPost} from './api'

export default function App() {
  const [hasPermission, setHasPermission] = useState(null)
  const [type, setType] = useState(Camera.Constants.Type.back)
  const [ready, setReady] = useState(false)
  const [camera, setCamera] = useState(null)

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync()
      setHasPermission(status === 'granted')
    })()
  }, [])

  async function takePicture(){
    if (camera) {
      console.log('snap pressed')
      const options = {
        quality: 0,
        base64: false,
        exif: true,
        skipProcessing: false,
        //onPictureSaved: postPicture(),
      }
      let photo = await camera.takePictureAsync(options)
      //console.log(photo)
      let measureResponse = await postPicture(photo)
      
      //let nothing = await testPost(photo)
      //console.log(`app data: ${JSON.stringify(nothing['test response'])}`)
    }
    else {
      console.log('snap pressed but camera was not present')
    }
  }

  function handleFlip() {
    setType(
      type === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    )
  }

  function handleCameraReady() {
    if (hasPermission && camera) {
      setReady(true)
      console.log('TESTING camera is ready')
    }
  }

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
  }
});

