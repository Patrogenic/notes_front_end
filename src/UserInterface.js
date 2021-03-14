// const BASE_URL = 'http://localhost:3000'; //development url
const BASE_URL = 'http://notes.patrickcs.com'; //production url
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
    toggleShowLogoutOption(){
        if(document.getElementById('logout').style.display.localeCompare('block') === 0){
            document.getElementById('logout').style.display = 'none';
        }else{
            let rect = document.getElementById('user-icon').getBoundingClientRect();
            document.getElementById('logout').style.display = 'block';
            document.getElementById('logout').style.top = rect.top + 'px';
            document.getElementById('logout').style.left = rect.left - 110 + 'px';
        }
    }
    toggleShowFolderMenu(){
        let sidebar = document.getElementById('folders-sidebar');

        if(sidebar.style.animationName.localeCompare('hide-sidebar') === 0 || sidebar.style.animationName.localeCompare('') === 0){
            sidebar.style.animationName = 'show-sidebar';
            sidebar.style.animationFillMode = 'forwards';
        }else{
            sidebar.style.animationName = 'hide-sidebar';
            sidebar.style.animationFillMode = 'forwards';
        }
    }
    toggleShowButtons(){
        document.querySelectorAll('.note-container-header').forEach( header => {
            header.addEventListener('mouseover', () => {
                document.querySelectorAll('.folder-btn-container').forEach(btnContainer => {
                    btnContainer.style.visibility = 'visible';
                })
            })
        })
        document.querySelectorAll('.note-container-header').forEach( header => {
            header.addEventListener('mouseout', () => {
                document.querySelectorAll('.folder-btn-container').forEach(btnContainer => {
                    btnContainer.style.visibility = 'hidden';
                })
            })
        })
    }
    displayAllFolderData(data, http){
        this.displayFolders(data, http);
        // this.displayNotes(data);

        //building the dynamic event listeners
        this.toggleShowButtons();

        document.getElementById('folders-sidebar').style.height = document.getElementById('main-content').offsetHeight + "px";
        window.addEventListener('resize', () => {
            document.getElementById('folders-sidebar').style.height = document.getElementById('main-content').offsetHeight + "px";
        })

        document.getElementById('folders-sidebar-header').addEventListener('mouseover', () => {
            document.getElementById('add-folder-icon').style.visibility = 'visible';
        })
        document.getElementById('folders-sidebar-header').addEventListener('mouseout', () => {
            document.getElementById('add-folder-icon').style.visibility = 'hidden';
        })
        
    }
    displayFolders(data, http){
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
        // document.getElementById('new-folder-popup-wrapper').style.display = 'none';
        this.hidePopup('new-folder-popup-wrapper');
        document.getElementById('new-folder-submit-btn').outerHTML = document.getElementById('new-folder-submit-btn').outerHTML;

        let foldersContainer = document.getElementById('folders-container');
        let folderEl = document.createElement('div');

        //the new index is one more than the current highest index, and the last element will always have the highest index
        let folderIndex = foldersContainer.childNodes[foldersContainer.childNodes.length - 1].id.substring(6);
        folderIndex = Number.parseInt(folderIndex) + 1;

        folderEl.innerHTML = folderData.name;
        folderEl.id = 'folder' + folderIndex;
        folderEl.classList.add('folder');
        folderEl.addEventListener('click', this.toggleCurrentFolder);
        foldersContainer.appendChild(folderEl);

        this.buildNotesContainer(folderData, folderIndex, http);
        this.toggleShowButtons();
    }
    deleteFolder(e){
        let folderEl = document.getElementById('folder' + e.srcElement.id);
        let notesSubContainer = document.getElementById('notes-sub-container' + e.srcElement.id);

        folderEl.remove();
        notesSubContainer.remove();

        let folderIndex = document.getElementById('folders-container').childNodes[0].id; //id of first folder

        this.toggleCurrentFolder({srcElement: {id: folderIndex}});
    }
    updateFolder(folderIndex, folderData){
        // document.getElementById('update-folder-popup-wrapper').style.display = 'none';
        this.hidePopup('update-folder-popup-wrapper');
        document.getElementById('update-folder-submit-btn').outerHTML = document.getElementById('update-folder-submit-btn').outerHTML;


        document.getElementById('folder' + folderIndex).innerHTML = folderData.name;
        document.getElementById('folder-name-notes-container' + folderIndex).innerHTML = folderData.name;
        if(document.getElementById('folder-description-notes-container' + folderIndex) !== null){
            document.getElementById('folder-description-notes-container' + folderIndex).innerHTML = folderData.description;
        }
        document.getElementById('update-folder-name-field').value = folderData.name;
        document.getElementById('update-folder-description-field').innerHTML = folderData.description;


    }
    //add edit and delete buttons here
    //give each note a css class
    addNote(noteData, folderIndex, http){
        // document.getElementById('new-note-popup-wrapper').style.display = 'none';
        this.hidePopup('new-note-popup-wrapper');
        document.getElementById('new-note-submit-btn').outerHTML = document.getElementById('new-note-submit-btn').outerHTML;


        let notesSubContainer = document.getElementById('notes-sub-container' + folderIndex);

        // buildNoteElement({notes = [noteData]}, folderIndex, http, 0);
        // let noteEl = document.createElement('div');
        let noteIndex = document.getElementById('notes-sub-container' + folderIndex).childNodes.length - 1;
        
        notesSubContainer.appendChild(this.buildNoteElement(noteData, folderIndex, http, noteIndex));
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
        let noteHeaderContainer = document.createElement('div');
        let notesHeaderBtns = document.createElement('div');

        noteHeaderContainer.classList.add('note-container-header');
        notesHeaderBtns.classList.add('folder-btn-container');

        notesSubContainer.classList.add('notes-sub-container');
        notesSubContainer.id = 'notes-sub-container' + folderIndex;

        //add folder title and description into the top of this element
        let folderName = document.createElement('div');
        folderName.id = 'folder-name-notes-container' + folderIndex;
        folderName.innerHTML = folderData.name;
        folderName.classList.add('note-container-name');

        // let folderDescription = document.createElement('div');
        // folderDescription.id = 'folder-description-notes-container' + folderIndex;
        // folderDescription.innerHTML = folderData.description;
        // folderDescription.classList.add('note-container-description');

        noteHeaderContainer.appendChild(folderName);
        notesHeaderBtns.appendChild(this.buildFolderDeleteBtn(folderData, folderIndex, http));
        notesHeaderBtns.appendChild(this.buildFolderEditBtn(folderData, folderIndex, http));
        notesHeaderBtns.appendChild(this.buildCreateNoteBtn(folderData, folderIndex, http));

        noteHeaderContainer.appendChild(notesHeaderBtns);
        notesSubContainer.appendChild(noteHeaderContainer);
        // notesSubContainer.appendChild(folderDescription);

        //this only needs to called once somewhere
        //not sure where to put it, maybe the constructor
        document.getElementById('close-show-note-popup')
        .addEventListener('click', () => {
            // document.getElementById('show-note-popup-wrapper').style.display = 'none';
            this.hidePopup('show-note-popup-wrapper');

            //remove event listeners when closing window
            document.getElementById('edit-note-submit-btn').outerHTML = document.getElementById('edit-note-submit-btn').outerHTML;
            document.getElementById('delete-note-form').outerHTML = document.getElementById('delete-note-form').outerHTML;

        });

    
        if(folderData.notes != undefined){
            for (let i = 0; i < folderData.notes.length; i++) {
                notesSubContainer.appendChild(this.buildNoteElement(folderData.notes[i], folderIndex, http, i));         
            }
        }
        notesContainer.appendChild(notesSubContainer);
    }
    buildFolderDeleteBtn(folderData, folderIndex, http){
        let deleteBtn = document.createElement('img');
        deleteBtn.src = './images/delete_icon.png';
        deleteBtn.id = folderIndex;
        deleteBtn.title = 'Delete Folder';
        //solution: I will pass an array of functions to the UserInterface class for fetching data
        deleteBtn.addEventListener('click', (e) => {
            if(document.getElementById('folders-container').childNodes.length === 1){
                //reject the deletion
                console.log('you cannot delete your last folder');
                alert('You cannot delete your last folder');
            }else{
                http.deleteFolder(e, BASE_URL + '/api/folder/' + folderData._id, 'delete', {}, data => {return data})
            }
        });
        return deleteBtn;
    }
    buildFolderEditBtn(folderData, folderIndex, http){
        let editBtn = document.createElement('img');
        editBtn.src = './images/edit_icon.png';
        editBtn.title = 'Edit Folder';

        //expand note to edit
        editBtn.addEventListener('click', () => {
            document.getElementById('update-folder-name-field').value = document.getElementById('folder-name-notes-container' + folderIndex).innerHTML;
            if(document.getElementById('folder-description-notes-container' + folderIndex) !== null){
                document.getElementById('update-folder-description-field').innerHTML = document.getElementById('folder-description-notes-container' + folderIndex).innerHTML;
            }
            // document.getElementById('update-folder-popup-wrapper').style.display = 'block';
            this.showPopup('update-folder-popup-wrapper');

            document.getElementById('update-folder-submit-btn')
            .addEventListener('click', (e) => {
                e.preventDefault();
                let name = document.getElementById('update-folder-name-field').value;
                let description = '';
                if(document.getElementById('update-folder-description-field') !== null){
                    description = document.getElementById('update-folder-description-field').innerHTML;
                }
                http.updateFolderData(folderIndex, BASE_URL + '/api/folder/' + folderData._id, 'put', {name, description}, data => {return data});
                //removes event listener from the form
                document.getElementById('update-folder-submit-btn').outerHTML = document.getElementById('update-folder-submit-btn').outerHTML;
            })
        })
        document.getElementById('close-update-folder-popup')
        .addEventListener('click', () => {
            // document.getElementById('update-folder-popup-wrapper').style.display = 'none';
            this.hidePopup('update-folder-popup-wrapper');
            document.getElementById('update-folder-submit-btn').outerHTML = document.getElementById('update-folder-submit-btn').outerHTML;
            
        })


        return editBtn;
    }
    buildCreateNoteBtn(folderData, folderIndex, http){
        let newNoteBtn = document.createElement('img');
        newNoteBtn.src = './images/add_icon.png';
        newNoteBtn.title = "New Note";

        newNoteBtn.addEventListener('click' , () => {
            // document.getElementById('new-note-popup-wrapper').style.display = 'block';
            this.showPopup('new-note-popup-wrapper');

            document.getElementById('new-note-submit-btn')
            .addEventListener('click', (e) => {
                e.preventDefault();
                let name = document.getElementById('new-note-name-field').value;
                let description = document.getElementById('new-note-description-field').innerHTML;
                document.getElementById('new-note-name-field').value = '';
                document.getElementById('new-note-description-field').innerHTML = '';

                http.sendNewNoteData(folderIndex, BASE_URL + '/api/folder/' + folderData._id + '/note', 'post', {name, description}, data => {return data});
                //removes event listener from the form
                document.getElementById('new-note-submit-btn').outerHTML = document.getElementById('new-note-submit-btn').outerHTML;
            })

        })

        //this only needs to be called once somewhere
        document.getElementById('close-new-note-popup')
        .addEventListener('click', () => {
            // document.getElementById('new-note-popup-wrapper').style.display = 'none';
            this.hidePopup('new-note-popup-wrapper');
        document.getElementById('new-note-submit-btn').outerHTML = document.getElementById('new-note-submit-btn').outerHTML;

        });

        return newNoteBtn;

    }
    //all the stuff I do here has to be added to the addNote method
    //figure something out with making this string a variable 'folder' + folderIndex + "note" + i
    buildNoteElement(noteData, folderIndex, http, i){
        let noteEl = document.createElement('div');
        let noteNameEl = document.createElement('div');
        let noteDescriptionEl = document.createElement('div');

        noteEl.id = 'folder' + folderIndex + "note" + i; //ex: 'folder0note0'
        noteEl.classList.add('note');

        noteNameEl.innerHTML = noteData.name;
        noteNameEl.id = 'folder' + folderIndex + "note" + i + "name";
        noteNameEl.classList.add('note-name');
        noteDescriptionEl.innerHTML = noteData.description;
        noteDescriptionEl.id = 'folder' + folderIndex + "note" + i + "description";
        noteDescriptionEl.classList.add('note-description');

        //adding events for the popup to view, edit, and delete the note
        //edit and delete events are removed when the window is closed
        noteEl.addEventListener('click', () => {
            // document.getElementById('show-note-popup-wrapper').style.display = 'block';
            this.showPopup('show-note-popup-wrapper');
            document.getElementById('show-note-name-field').value = document.getElementById('folder' + folderIndex + "note" + i + "name").innerHTML;
            document.getElementById('show-note-description-field').innerHTML = document.getElementById('folder' + folderIndex + "note" + i + "description").innerHTML;

            document.getElementById('edit-note-submit-btn').addEventListener('click', (e) => {
                e.preventDefault();
                let name = document.getElementById('show-note-name-field').value;
                let description = document.getElementById('show-note-description-field').innerHTML;
                http.updateNoteData('folder' + folderIndex + "note" + i, BASE_URL + '/api/folder/note/' + noteData._id, 'put', {name, description}, data => {return data});
            })

            document.getElementById('delete-note-submit-btn').addEventListener('click', (e) => {
                e.preventDefault();
                http.deleteNote('folder' + folderIndex + "note" + i, BASE_URL + '/api/folder/note/' + noteData._id, 'delete', {}, data => {return data});
                document.getElementById('delete-note-submit-btn').outerHTML = document.getElementById('delete-note-submit-btn').outerHTML;
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
        document.getElementById('folders-sidebar').style.visibility = 'hidden';
    }
    showPopup(elementName){
        let popup = document.getElementById(elementName);
        popup.style.animationName = 'show-popup';
    }
    hidePopup(elementName){
        let popup = document.getElementById(elementName);
        popup.style.animationName = 'hide-popup';
    }
}

export default UserInterface