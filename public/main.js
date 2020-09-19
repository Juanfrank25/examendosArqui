
const endPoint = "https://ejem1.cognitiveservices.azure.com/face/v1.0/detect?returnFaceAttributes=age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise"
const key = "231735332ad7433fae66d7fa27592b61"

document.getElementById("Validar").addEventListener("click", () => {
    let urlImg = document.getElementById("urlImg").value
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
                        alert("Pase. Gracias por usar mascarilla.")
                    } else alert("No pasa. No usa mascarilla.")
                } else alert("No pasa. No usa mascarilla.")
            } else alert("No se detecto un rostro")
    })
})

document.getElementById("limpiar").addEventListener("click", () => {
    document.getElementById("urlImg").value = ""
    document.getElementById("imagen").src = ""
})