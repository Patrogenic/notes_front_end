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
        }
    }
    addFolder(folderData, http){
        document.getElementById('new-folder-popup-wrapper').style.display = 'none';

        let foldersContainer = document.getElementById('folders-container');
        let folderEl = document.createElement('div');
        let folderIndex = foldersContainer.childNodes.length + 1;
        
        folderEl.innerHTML = folderData.name;
        folderEl.id = 'folder' + folderIndex;
        folderEl.classList.add('folder');
        folderEl.addEventListener('click', this.toggleCurrentFolder);
        foldersContainer.appendChild(folderEl);

        this.buildNotesContainer(folderData, folderIndex, http);
    }
    deleteFolder(e){
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

        document.getElementById('update-folder-name-field').value = folderData.name;
        document.getElementById('update-folder-description-field').value = folderData.description;


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
    updateNote(noteData, elementId){
        document.getElementById(elementId + 'name').innerHTML = noteData.name;
        document.getElementById(elementId + 'description').innerHTML = noteData.description;

        console.log('changes saved'); //TODO create element for this
    }
    deleteNote(elementId){
        document.getElementById(elementId).remove();
        document.getElementById('close-show-note-popup').click();
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

        //this only needs to called once somewhere
        //not sure where to put it, maybe the constructor
        document.getElementById('close-show-note-popup')
        .addEventListener('click', () => {
            document.getElementById('show-note-popup-wrapper').style.display = 'none';

            //remove event listeners when closing window
            document.getElementById('edit-note-submit-btn').outerHTML = document.getElementById('edit-note-submit-btn').outerHTML;
            document.getElementById('delete-note-form').outerHTML = document.getElementById('delete-note-form').outerHTML;

        });

    
        if(folderData.notes != undefined){
            for (let i = 0; i < folderData.notes.length; i++) {
                notesSubContainer.appendChild(this.buildNoteElement(folderData, folderIndex, http, i));         
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
            document.getElementById('update-folder-name-field').value = document.getElementById('folder-name-notes-container' + folderIndex).innerHTML;
            document.getElementById('update-folder-description-field').value = document.getElementById('folder-description-notes-container' + folderIndex).innerHTML;
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

        //this only needs to be called once somewhere
        document.getElementById('close-new-note-popup')
        .addEventListener('click', () => {
            document.getElementById('new-note-popup-wrapper').style.display = 'none';
        });

        return newNoteBtn;

    }
    //all the stuff I do here has to be added to the addNote method
    //figure something out with making this string a variable 'folder' + folderIndex + "note" + i
    buildNoteElement(folderData, folderIndex, http, i){
        let noteEl = document.createElement('div');
        let noteNameEl = document.createElement('div');
        let noteDescriptionEl = document.createElement('div');

        noteEl.id = 'folder' + folderIndex + "note" + i; //ex: 'folder0note0'
        noteEl.classList.add('note');

        noteNameEl.innerHTML = folderData.notes[i].name;
        noteNameEl.id = 'folder' + folderIndex + "note" + i + "name";
        noteNameEl.classList.add('note-name');
        noteDescriptionEl.innerHTML = folderData.notes[i].description;
        noteDescriptionEl.id = 'folder' + folderIndex + "note" + i + "description";
        noteDescriptionEl.classList.add('note-description');

        //adding events for the popup to view, edit, and delete the note
        //edit and delete events are removed when the window is closed
        noteEl.addEventListener('click', () => {
            document.getElementById('show-note-popup-wrapper').style.display = 'block';
            document.getElementById('show-note-name-field').value = document.getElementById('folder' + folderIndex + "note" + i + "name").innerHTML;
            document.getElementById('show-note-description-field').value = document.getElementById('folder' + folderIndex + "note" + i + "description").innerHTML;

            document.getElementById('edit-note-submit-btn').addEventListener('click', (e) => {
                e.preventDefault();
                console.log('called');
                let name = document.getElementById('show-note-name-field').value;
                let description = document.getElementById('show-note-description-field').value;
                http.updateNoteData('folder' + folderIndex + "note" + i, BASE_URL + '/api/folder/note/' + folderData.notes[i]._id, 'put', {name, description}, data => {return data});
            })

            document.getElementById('delete-note-submit-btn').addEventListener('click', (e) => {
                e.preventDefault();
                http.deleteNote('folder' + folderIndex + "note" + i, BASE_URL + '/api/folder/note/' + folderData.notes[i]._id, 'delete', {}, data => {return data});
            })
        })
        noteEl.appendChild(noteNameEl);
        noteEl.appendChild(noteDescriptionEl);

        return noteEl;
    }
    toggleCurrentFolder(e){
        let notesSubContainers = document.getElementsByClassName('notes-sub-container');

        for (let i = 0; i < notesSubContainers.length; i++) {
            notesSubContainers[i].style.display = "none";
        }
        document.getElementById('notes-sub-container' + e.srcElement.id.substring(6)).style.display = 'block';
    }
    //I either want to not have methods for these, or have methods for everything else as well
    //possibly, I could use the element id as an argument (hopefully I can use bind and it will be all okay)
    openNewFolderForm(){
        document.getElementById('new-folder-popup-wrapper').style.display = 'block';
    }
    closeNewFolderForm(){
        document.getElementById('new-folder-popup-wrapper').style.display = 'none';
    }
}

export default UserInterface