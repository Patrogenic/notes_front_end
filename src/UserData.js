
//this class will be used for fetching data from the api/back end
class UserData{
    constructor(){

    }
    /*
        url: is the url to fetch,
        method: is the HTTP method,
        parameters: are body parameters from a form,
        callback: is a function to perform after successfully receiving data
    */
    getData(url, method, callback){
        const localstorage_user = JSON.parse(localStorage.getItem('user'));
        const inMemoryToken = localstorage_user.token;

        return (fetch(url, {
            method: method,
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + inMemoryToken,
            },
        }).then(res => {
            if(res.status != 200){ //if it's not 200, then it's probably 403
                return res.status;
            }else{
                return res.json();
            }
        }).then(json => {
            // console.log(json);
            return callback(json);
        }))
    }
    sendData(url, method, parameters, callback){
        const localstorage_user = JSON.parse(localStorage.getItem('user'));
        let inMemoryToken;
        if(localstorage_user !== null){
            inMemoryToken = localstorage_user.token;
        }

        return (fetch(url, {
            method: method,
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + inMemoryToken,
            },
            body: JSON.stringify(parameters),
        }).then(res => {
            if(res.status != 200){ //if it's not 200, then it's probably 403
                return res.status;
            }else{
                return res.json();
            }
        }).then(json => {
            return callback(json);
        }))
    }
}

export default UserData;