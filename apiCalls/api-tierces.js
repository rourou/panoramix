const Axios = require('axios')

//get fete du jour
const getFeteDuJour = async (date) => {

    const url = `https://fetedujour.fr/api/v2/yhlsSYNkJ3TMFCbe/text-normal?api_key=yhlsSYNkJ3TMFCbe&f=text&t=normal-${date.month}-${date.day}`
    const infoClan = await Axios.get(
        url,
    ).then((result) => {
        console.log('result:', result.data)
        return ({
            data: result.data,
            statusCode: 200
        })
    }).catch((error) => {
        console.log('error:', error)
        return ({
            data: "N/A",
            statusCode: 400
        })
    })
    return (infoClan);
}

//EXPORT
module.exports = {
    getFeteDuJour: getFeteDuJour
};
