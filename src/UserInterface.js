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
            folderEl.id = 'folder' + i;
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
    addFolder(folderData, http){
        document.getElementById('new-folder-popup-wrapper').style.display = 'none';

        let foldersContainer = document.getElementById('folders-container');
        let folderEl = document.createElement('div');
        let folderIndex = foldersContainer.childNodes.length;
        
        folderEl.innerHTML = folderData.name;
        folderEl.id = 'folder' + folderIndex;
        folderEl.classList.add('folder');
        folderEl.addEventListener('click', this.toggleCurrentFolder);
        foldersContainer.appendChild(folderEl);

        
        this.buildNotesContainer(folderData, folderIndex, http);


    }
    deleteFolder(e){
        console.log('event: ' + e.srcElement.id);
        // let id = e.srcElement
        let folderEl = document.getElementById('folder' + e.srcElement.id);
        let notesSubContainer = document.getElementById('notes-sub-container' + e.srcElement.id);

        folderEl.remove();
        notesSubContainer.remove();

        this.toggleCurrentFolder({srcElement: {id: 'folder0'}});
    }
    updateFolder(folderIndex, folderData){
        document.getElementById('update-folder-popup-wrapper').style.display = 'none';

        document.getElementById('folder' + folderIndex).innerHTML = folderData.name;
        console.log(document.getElementById('folder' + folderIndex).innerHTML);
        document.getElementById('folder-name-notes-container' + folderIndex).innerHTML = folderData.name;
        document.getElementById('folder-description-notes-container' + folderIndex).innerHTML = folderData.description;

    }
    //add edit and delete buttons here
    //give each note a css class
    addNote(noteData, folderIndex){
        document.getElementById('new-note-popup-wrapper').style.display = 'none';

        let notesSubContainer = document.getElementById('notes-sub-container' + folderIndex);
        let noteEl = document.createElement('div');
        
        noteEl.innerHTML = noteData.name;
        notesSubContainer.appendChild(noteEl);
    }
    //I should probably make including a name of the note optional
    buildNotesContainer(folderData, folderIndex, http){ //this might be used to create just one container at a time
        let notesContainer = document.getElementById('notes-container');
        let notesSubContainer = document.createElement('div');

        notesSubContainer.classList.add('notes-sub-container');
        notesSubContainer.id = 'notes-sub-container' + folderIndex;

        //add folder title and description into the top of this element
        let folderName = document.createElement('div');
        folderName.id = 'folder-name-notes-container' + folderIndex;
        folderName.innerHTML = folderData.name;

        let folderDescription = document.createElement('div');
        folderDescription.id = 'folder-description-notes-container' + folderIndex;
        folderDescription.innerHTML = folderData.description;

        notesSubContainer.appendChild(folderName);
        notesSubContainer.appendChild(this.buildFolderDeleteBtn(folderData, folderIndex, http));
        notesSubContainer.appendChild(this.buildFolderEditBtn(folderData, folderIndex, http));
        notesSubContainer.appendChild(this.buildCreateNoteBtn(folderData, folderIndex, http));

        notesSubContainer.appendChild(folderDescription);

        let noteEl = document.createElement('div');

        //I have to build the name and description of the note
        //add edit and delete buttons here
        //give each note a css class
        if(folderData.notes != undefined){
            for (let i = 0; i < folderData.notes.length; i++) {
                noteEl.innerHTML = folderData.notes[i].name;
                notesSubContainer.appendChild(noteEl);
                noteEl = document.createElement('div');            
            }
        }
        notesContainer.appendChild(notesSubContainer);
    }
    buildFolderDeleteBtn(folderData, folderIndex, http){
        let deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = 'Delete';
        deleteBtn.id = folderIndex;
        //solution: I will pass an array of functions to the UserInterface class for fetching data
        deleteBtn.addEventListener('click', (e) => {
            http.deleteFolder(e, BASE_URL + '/api/folder/' + folderData._id, 'delete', {}, data => {return data})
        });
        return deleteBtn;
    }
    buildFolderEditBtn(folderData, folderIndex, http){
        let editBtn = document.createElement('button');
        editBtn.innerHTML = 'Edit';

        //expand note to edit
        editBtn.addEventListener('click', () => {
            document.getElementById('update-folder-name-field').value = folderData.name;
            document.getElementById('update-folder-description-field').value = folderData.description;
            document.getElementById('update-folder-popup-wrapper').style.display = 'block';

            document.getElementById('update-folder-form')
            .addEventListener('submit', (e) => {
                e.preventDefault();
                let name = document.getElementById('update-folder-name-field').value;
                let description = document.getElementById('update-folder-description-field').value;
                console.log(name);
                console.log(description);
                http.updateFolderData(folderIndex, BASE_URL + '/api/folder/' + folderData._id, 'put', {name, description}, data => {return data});
                //removes event listener from the form
                document.getElementById('update-folder-form').outerHTML = document.getElementById('update-folder-form').outerHTML;
            })
        })
        document.getElementById('close-update-folder-popup')
        .addEventListener('click', () => {
            document.getElementById('update-folder-popup-wrapper').style.display = 'none';
        })


        return editBtn;
    }
    buildCreateNoteBtn(folderData, folderIndex, http){
        let newNoteBtn = document.createElement('button');
        newNoteBtn.innerHTML = "New Note";

        newNoteBtn.addEventListener('click' , () => {
            document.getElementById('new-note-popup-wrapper').style.display = 'block';

            document.getElementById('new-note-form')
            .addEventListener('submit', (e) => {
                e.preventDefault();
                let name = document.getElementById('new-note-name-field').value;
                let description = document.getElementById('new-note-description-field').value;
                document.getElementById('new-note-name-field').value = '';
                document.getElementById('new-note-description-field').value = '';

                http.sendNewNoteData(folderIndex, BASE_URL + '/api/folder/' + folderData._id + '/note', 'post', {name, description}, data => {return data});
                //removes event listener from the form
                document.getElementById('update-folder-form').outerHTML = document.getElementById('update-folder-form').outerHTML;
            })

        })

        document.getElementById('close-new-note-popup')
        .addEventListener('click', () => {
            document.getElementById('new-note-popup-wrapper').style.display = 'none';
        });

        return newNoteBtn;

    }
    toggleCurrentFolder(e){
        let notesSubContainers = document.getElementsByClassName('notes-sub-container');

        for (let i = 0; i < notesSubContainers.length; i++) {
            notesSubContainers[i].style.display = "none";
        }
        document.getElementById('notes-sub-container' + e.srcElement.id.substring(6)).style.display = 'block';
    }
    openNewFolderForm(){
        document.getElementById('new-folder-popup-wrapper').style.display = 'block';
    }
    closeNewFolderForm(){
        document.getElementById('new-folder-popup-wrapper').style.display = 'none';
    }
}

export default UserInterface