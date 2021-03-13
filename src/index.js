import ProjectList from "./ProjectList"
import UserData from "./UserData"
import UserInterface from "./UserInterface"

const BASE_URL = 'http://localhost:3000'; //development url
// const BASE_URL = 'http://notes.patrickcs.com'; //production url
const PATH = '/dist/'; // development
// const PATH = '/'; // production


//I will have to put the update functions into some kind of wrapper so they can pull data from the form
let http = {updateFolderData, deleteFolder, updateNoteData, deleteNote, sendNewNoteData};

//handling logout seems to be a client side thing in which all I have to do is clear the token in localStorage
let userData = new UserData();
let userInterface = new UserInterface();



//routing
if(window.location.pathname.localeCompare(PATH + "login.html") === 0){
    userInterface.toggleLoginTabs();
    console.log('login page');
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
    .addEventListener('click', userInterface.openNewFolderForm);
    document.getElementById('close-new-folder-popup')
    .addEventListener('click', userInterface.closeNewFolderForm);
    document.getElementById('logout').addEventListener('click', userLogout);
    document.getElementById('user-icon').addEventListener('click', userInterface.toggleShowLogoutOption);
    document.getElementById('menu-icon').addEventListener('click', userInterface.toggleShowFolderMenu);

    document.getElementById('new-folder-submit-btn').addEventListener('click', (e) => {
        e.preventDefault();
        console.log('event');
        let name = document.getElementById('new-folder-name-field').value;
        let description = document.getElementById('new-folder-description-field').value;
        document.getElementById('new-folder-name-field').value = '';
        document.getElementById('new-folder-description-field').value = '';

        sendNewFolderData(BASE_URL + '/api/folder', 'post', {name, description}, data => {return data});
    })
}else if(window.location.pathname.localeCompare(PATH + "index.html") === 0){
    window.location.href = 'login.html';
}
// else if(){ //create account

// }else if(){ //dashboard
//     //verify authentication on load (check for token)
//      //this will happen when I try to request the data to display
// }






/*
post make account
post log in
post new folder
put update folder
delete folder

post new note
put update note
delete note
*/


/*
    if(data != 403){
        then proceeed
    }else{
        show use a login screen
    }
*/

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
    console.log(data);
    if(data.token !== undefined){
        localStorage.setItem('user', JSON.stringify(data));
        window.location.href = 'dashboard.html';
        sendNewFolderData(BASE_URL + '/api/folder', 'post', {name: 'Notes', description: ''}, data => {return data});
    }else if(data.message.localeCompare('passwords differ') === 0){
        //notify user that passwords differ
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
    console.log(data);
    console.log(data.folderData);
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
// let data = await userData.sendData(BASE_URL + '/api/folder/604450a26ad6b825957242ea', 'put', {name, description}, data => {return data});
async function updateFolderData(folderIndex, url, method, parameters, callback){
    let data = await userData.sendData(url, method, parameters, callback);
    console.log(data);
    if(data.name !== undefined){
        //successful edit
        userInterface.updateFolder(folderIndex, data);
    }else{
        console.log('edit was not successful');
    }
}
// let data = await userData.sendData(BASE_URL + '/api/folder/:id', 'delete', {}, data => {return data});
async function deleteFolder(e, url, method, parameters, callback){
    let data = await userData.sendData(url, method, parameters, callback);
    console.log(data);
    if(data.message.localeCompare('success') !== 0){
        console.log('error deleting folder');
    }else{
        userInterface.deleteFolder(e);
    }
}

// sendNewNoteData(BASE_URL + '/api/folder/604450a26ad6b825957242ea/note', 'post', {name, description}, data => {return data});
async function sendNewNoteData(folderIndex, url, method, parameters, callback){
    let data = await userData.sendData(url, method, parameters, callback);
    console.log(data);
    if(data.name !== undefined){
        userInterface.addNote(data, folderIndex, http);
    }else{
        console.log('error creating note');
    }
}
// updateNoteData(BASE_URL + '/api/folder/note/:id', 'put', {name, description}, data => {return data});
async function updateNoteData(elementId, url, method, parameters, callback){
    let data = await userData.sendData(url, method, parameters, callback);
    console.log(data);
    if(data.name !== undefined){
        userInterface.updateNote(data, elementId)
    }else{
        console.log('error saving data');
    }
}
// deleteNote(BASE_URL + '/api/folder/note/:id', 'delete', {}, data => {return data});
async function deleteNote(elementId, url, method, parameters, callback){
    let data = await userData.sendData(url, method, parameters, callback);
    console.log(data);
    if(data.message.localeCompare('success') !== 0){
        console.log('error deleting note');
    }else{
        userInterface.deleteNote(elementId);
    }

}