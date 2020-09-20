
const endPoint = "https://ejem1.cognitiveservices.azure.com/face/v1.0/detect?returnFaceAttributes=age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise"
const key = "231735332ad7433fae66d7fa27592b61"
const endpoint = "https://examen2parcial.azurewebsites.net/rest/api/DatoBiometrico"

document.getElementById("Val").addEventListener("click", () => {
    let urlImg = document.getElementById("urlImg").value
    alert(urlImg)
   document.getElementById("imagen").src = urlImg
    fetch(endPoint, {
        method: 'POST',
        body: JSON.stringify({
            url: urlImg
        }),
        headers: {
            "Content-type": "application/json",
            "Ocp-Apim-Subscription-Key": key
        }
    })
    .then(response => response.json())
    .then(json => {
       if (json.length > 0) {
                const accesorio = json[0].faceAttributes.accessories.find(accesorio => accesorio.type == "mask")
                if (accesorio) {
                    if (accesorio.confidence >= 0.8) {
                        alert("Se detecto Mascarilla.")
                    } else alert("No se detecto mascarilla.")
                } else alert("No pasa por no portar mascarilla.")
            } else alert("Rostro no detectado")
    })
})

document.getElementById("Bio").addEventListener('click', () => {

    let urlImg = document.getElementById("urlImg").value
    document.getElementById("imagen").src = urlImg
     fetch(endpoint, {
         method: 'POST',
         body: JSON.stringify({
             urlImg,
             day:document.getElementById("Day").value
         }),
         headers: {
             "Content-type": "application/json",
             "Ocp-Apim-Subscription-Key": key
         }
     })
     .then(response => response.json())
     .then(json => {
        if (json.success) {
            alert("Se le permite el Acceso")
              
        } else {
            alert(`Accesso Denegado. ${json.msg}`)
        }
     })
})

document.getElementById("Limpiar").addEventListener("click", () => {
    document.getElementById("urlImg").value = ""
    document.getElementById("imagen").src = ""
})