const BASE_URL = 'http://localhost:3000'; //development url
class UserInterface{
    constructor(){
        
    }
    toggleLoginTabs(){
        let loginForm = document.getElementById('login-form');
        let signupForm = document.getElementById('signup-form');

        let loginTab = document.getElementById('login-tab');
        let signupTab = document.getElementById('signup-tab');

        loginTab.addEventListener('click', () => {
            loginForm.style.display = 'block';
            signupForm.style.display = 'none';
            loginTab.style.backgroundColor = 'lightgrey';
            signupTab.style.backgroundColor = 'transparent';

        });
        signupTab.addEventListener('click', () => {
            loginForm.style.display = 'none';
            signupForm.style.display = 'block';
            loginTab.style.backgroundColor = 'transparent';
            signupTab.style.backgroundColor = 'lightgrey';
        });
    }
    displayAllFolderData(data, http){
        this.displayFolders(data, http);
        // this.displayNotes(data);
    }
    displayFolders(data, http){
        console.log('http ' + http);
        let foldersContainer = document.getElementById('folders-container');
        let notesContainer = document.getElementById('notes-container');


        let folderEl = document.createElement('div');

        //the ids of the folders and notes will have to be stored somewhere
        for(let i = 0; i < data.length; i++) {
            folderEl.innerHTML = data[i].name;
            folderEl.id = i;
            folderEl.classList.add('folder');
            folderEl.addEventListener('click', this.toggleCurrentFolder);
            foldersContainer.appendChild(folderEl);
            folderEl = document.createElement('div');

            //this might be able to go back into the function below
            this.buildNotesContainer(data[i], i, http);
            
            
            /*
                add an event listener to display the notes for this folder and
                hide all other notes
                display: block for the notes in this folder, and
                display: none for all other notes

                on each note group element, I can have a button that adds notes
                to the currently selected folder
                --this will probably simplify things

                I still need a create folder button though
            */
        }


    }
    addFolder(folderData){
        let foldersContainer = document.getElementById('folders-container');
        let folderEl = document.createElement('div');
        
        folderEl.innerHTML = folderData.name;
        folderEl.id = foldersContainer.childNodes.length;
        folderEl.classList.add('folder');
        folderEl.addEventListener('click', this.toggleCurrentFolder);
        foldersContainer.appendChild(folderEl);


    }
    //I should probably make including a name of the note optional
    buildNotesContainer(folderData, folderIndex, http){ //this might be used to create just one container at a time
        let notesContainer = document.getElementById('notes-container');
        let notesSubContainer = document.createElement('div');

        notesSubContainer.classList.add('notes-sub-container');
        notesSubContainer.id = 'notes-sub-container' + folderIndex;

        //add folder title and description into the top of this element
        let folderName = document.createElement('div');
        folderName.innerHTML = folderData.name;

        let deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = 'delete';
        //solution: I will pass an array of functions to the UserInterface class for fetching data
        deleteBtn.addEventListener('click', () => {http.deleteFolder(BASE_URL + '/api/folder/' + folderData._id, 'delete', {}, data => {return data})});


        let folderDescription = document.createElement('div');
        folderDescription.innerHTML = folderData.description;

        notesSubContainer.appendChild(folderName);
        notesSubContainer.appendChild(deleteBtn);
        notesSubContainer.appendChild(folderDescription);

        let noteEl = document.createElement('div');

        //I have to build the name and description of the note
        for (let i = 0; i < folderData.notes.length; i++) {
            noteEl.innerHTML = folderData.notes[i].name;
            notesSubContainer.appendChild(noteEl);
            noteEl = document.createElement('div');            
        }
        notesContainer.appendChild(notesSubContainer);
    }
    toggleCurrentFolder(e){
        let notesSubContainers = document.getElementsByClassName('notes-sub-container');

        for (let i = 0; i < notesSubContainers.length; i++) {
            notesSubContainers[i].style.display = "none";
        }
        document.getElementById('notes-sub-container' + e.srcElement.id).style.display = 'block';
    }
    openNewFolderForm(){
        document.getElementById('new-folder-popup-wrapper').style.display = 'block';
    }
    closeNewFolderForm(){
        document.getElementById('new-folder-popup-wrapper').style.display = 'none';
    }
}

export default UserInterface