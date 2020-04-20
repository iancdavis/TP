
export async function testPost(photo) {
    return fetch('http://192.168.0.107:5000/test')
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
            return data
        })
        .catch(error => console.error(error))
}

export async function postPicture(photo){
    console.log(photo.uri)
    console.log('photo posted')

    var data = new FormData()
    data.append('file', {
      uri: photo.uri,
      name: 'photo.jpg',
      type: 'image/jpg'
    })

    console.log(data)

    try {
      return fetch('http://192.168.0.107:5000/measure', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'enctype': 'multipart/form-data'
        },
        body: data
      })

      let json = await response.json()
      console.log(`RESPONSE: ${json}`)
    } catch (error) {
      console.error(`Error in fetch: ${error}`)
    }
  } 