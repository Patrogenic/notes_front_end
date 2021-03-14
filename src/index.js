import UserData from "./UserData"
import UserInterface from "./UserInterface"

// const BASE_URL = 'http://localhost:3000'; //development url
const BASE_URL = 'https://notes.patrickcs.com'; //production url
const PATH = '/dist/'; // development
// const PATH = '/'; // production

let http = {updateFolderData, deleteFolder, updateNoteData, deleteNote, sendNewNoteData};

let userData = new UserData();
let userInterface = new UserInterface();

//routing
if(window.location.pathname.localeCompare(PATH + "login.html") === 0){
    userInterface.toggleLoginTabs();
    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        let username = document.getElementById('login-username-field').value;
        let password = document.getElementById('login-password-field').value;
        document.getElementById('login-username-field').value = '';
        document.getElementById('login-password-field').value = '';
        userLogin(BASE_URL + '/api/login', 'post', {username, password}, data => {return data});
    })
    document.getElementById('signup-form').addEventListener('submit', (e) => {
        e.preventDefault();
        let username = document.getElementById('signup-username-field').value;
        let password = document.getElementById('signup-password-field').value;
        let password_confirmed = document.getElementById('signup-password-confirm-field').value;
        document.getElementById('signup-username-field').value = '';
        document.getElementById('signup-password-field').value = '';
        document.getElementById('signup-password-confirm-field').value = ''
        makeAccount(BASE_URL + '/api/make_account', 'post', {username, password, password_confirmed}, data => {return data});

    })
}else if(window.location.pathname.localeCompare(PATH + "dashboard.html") === 0){
    getAllFoldersData();

    document.getElementById('folders-sidebar-header')
    .addEventListener('click', () => userInterface.showPopup('new-folder-popup-wrapper'));
    document.getElementById('close-new-folder-popup')
    .addEventListener('click', () => userInterface.hidePopup('new-folder-popup-wrapper'));
    document.getElementById('logout').addEventListener('click', userLogout);
    document.getElementById('user-icon').addEventListener('click', userInterface.toggleShowLogoutOption);
    document.getElementById('menu-icon').addEventListener('click', userInterface.toggleShowFolderMenu);

    document.getElementById('new-folder-submit-btn').addEventListener('click', (e) => {
        e.preventDefault();
        let name = document.getElementById('new-folder-name-field').value;
        let description = document.getElementById('new-folder-description-field').value;
        document.getElementById('new-folder-name-field').value = '';
        document.getElementById('new-folder-description-field').value = '';

        sendNewFolderData(BASE_URL + '/api/folder', 'post', {name, description}, data => {return data});
    })
}else if(window.location.pathname.localeCompare(PATH + "index.html") === 0){
    window.location.href = 'login.html';
}


//in some of these functions, the variable 'data' would be more appropriately named 'response'
async function userLogin(url, method, parameters, callback){
    let data = await userData.sendData(url, method, parameters, callback);
    localStorage.setItem('user', JSON.stringify(data));
    if(data.token != undefined){
        window.location.href = 'dashboard.html'; //redirect
    }else{
        document.getElementById('login-response').innerHTML = 'Invalid Credentials';
        console.log('invalid credentials');
        alert('Invalid Credentials');
    }
}
function userLogout(){
    //clear token from localStorage and redirect user
    localStorage.setItem('user', JSON.stringify(''));
    window.location.href = 'login.html';
}

async function makeAccount(url, method, parameters, callback){
    let data = await userData.sendData(url, method, parameters, callback);
    if(data.token !== undefined){
        localStorage.setItem('user', JSON.stringify(data));
        window.location.href = 'dashboard.html';
        sendNewFolderData(BASE_URL + '/api/folder', 'post', {name: 'Notes', description: ''}, data => {return data});
    }else if(data.message.localeCompare('passwords differ') === 0){
        console.log('passwords differ');
        alert('Passwords do not match')
    }else if(data.message.localeCompare('username is taken') === 0){
        console.log('username is taken');
        alert('Username is already taken')
    }else{
        console.log('error creating new account');
        alert('error creating new account')
    }
}   

//maybe I can pass a function to display the data in the callback
async function getAllFoldersData(){
    let data = await userData.getData(BASE_URL + '/api/folders', 'get', data => {return data});
    if(data === 403){
        window.location.href = 'login.html';
    }else{
        //pass data to userInterface to display the data
        userInterface.displayAllFolderData(data.folderData, http);
    }
}
async function sendNewFolderData(url, method, parameters, callback){
    let data = await userData.sendData(url, method, parameters, callback);
    console.log(data);
    if(data.name !== undefined){ //valid object returned
        userInterface.addFolder(data, http);
    }else{
        //tell the user there was some kind of error
        //'Error: failed to add note'
    }
}
async function updateFolderData(folderIndex, url, method, parameters, callback){
    let data = await userData.sendData(url, method, parameters, callback);
    if(data.name !== undefined){
        //successful edit
        userInterface.updateFolder(folderIndex, data);
    }else{
        console.log('edit was not successful');
        alert('Error saving data');
    }
}
async function deleteFolder(e, url, method, parameters, callback){
    let data = await userData.sendData(url, method, parameters, callback);
    if(data.message.localeCompare('success') !== 0){
        console.log('error deleting folder');
        alert('Error deleting folder')
    }else{
        userInterface.deleteFolder(e);
    }
}

async function sendNewNoteData(folderIndex, url, method, parameters, callback){
    let data = await userData.sendData(url, method, parameters, callback);
    if(data.name !== undefined){
        userInterface.addNote(data, folderIndex, http);
    }else{
        console.log('error creating note');
        alert('Error creating new note')
    }
}
async function updateNoteData(elementId, url, method, parameters, callback){
    let data = await userData.sendData(url, method, parameters, callback);
    if(data.name !== undefined){
        userInterface.updateNote(data, elementId)
    }else{
        console.log('error saving data');
        alert('Error saving note data')
    }
}
async function deleteNote(elementId, url, method, parameters, callback){
    let data = await userData.sendData(url, method, parameters, callback);
    if(data.message.localeCompare('success') !== 0){
        console.log('error deleting note');
        alert('Error deleting note')
    }else{
        userInterface.deleteNote(elementId);
    }
}