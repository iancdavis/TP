//function for testing if server connection was establised
export async function testPost(photo) {
    return fetch('http://192.168.0.107:5000/test')
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
            return data
        })
        .catch(error => console.error(error))
}

//send image to server and recieve processed data
export async function postPicture(photo){
    console.log(photo.uri)
    console.log('photo posted')

    //create a FormData() object to hold image data
    var data = new FormData()
    
    //populate  FormData with image data
    data.append('file', {
      uri: photo.uri,
      name: 'photo.jpg',
      type: 'image/jpg'
    })
    
    //log the data to be sent FOR TESTING
    console.log(data)

    try {
        //make fetch request and await response from server
        let response = await fetch('http://192.168.0.107:5000/measure', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'enctype': 'multipart/form-data'
        },
        body: data
      })
      //convert response to json
      let json = await response.json()

      //log response FOR TESTING
      console.log(`RESPONSE in api: ${json}`)

      //return data 
      return json
    } catch (error) {
      console.error(`Error in fetch: ${error}`)
    }
  } 