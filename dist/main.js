(()=>{"use strict";const e="http://notes.patrickcs.com",t="http://notes.patrickcs.com";let n={updateFolderData:async function(e,t,n,d,i){let a=await o.sendData(t,n,d,i);console.log(a),void 0!==a.name?l.updateFolder(e,a):console.log("edit was not successful")},deleteFolder:async function(e,t,n,d,i){let a=await o.sendData(t,n,d,i);console.log(a),0!==a.message.localeCompare("success")?console.log("error deleting folder"):l.deleteFolder(e)},updateNoteData:async function(e,t,n,d,i){let a=await o.sendData(t,n,d,i);console.log(a),void 0!==a.name?l.updateNote(a,e):console.log("error saving data")},deleteNote:async function(e,t,n,d,i){let a=await o.sendData(t,n,d,i);console.log(a),0!==a.message.localeCompare("success")?console.log("error deleting note"):l.deleteNote(e)},sendNewNoteData:async function(e,t,d,i,a){let s=await o.sendData(t,d,i,a);console.log(s),void 0!==s.name?l.addNote(s,e,n):console.log("error creating note")}},o=new class{constructor(){}getAllFolders(){const e=JSON.parse(localStorage.getItem("user")).token;return fetch("url",{method:"get",headers:{Accept:"application/json, text/plain, */*","Content-Type":"application/json",Authorization:"Bearer "+e}}).then((e=>(console.log(e),e.json()))).then((e=>{console.log(e)}))}getData(e,t,n){const o=JSON.parse(localStorage.getItem("user")).token;return fetch(e,{method:t,headers:{Accept:"application/json, text/plain, */*","Content-Type":"application/json",Authorization:"Bearer "+o}}).then((e=>200!=e.status?e.status:e.json())).then((e=>n(e)))}sendData(e,t,n,o){const l=JSON.parse(localStorage.getItem("user"));let d;return null!==l&&(d=l.token),fetch(e,{method:t,headers:{Accept:"application/json, text/plain, */*","Content-Type":"application/json",Authorization:"Bearer "+d},body:JSON.stringify(n)}).then((e=>200!=e.status?e.status:e.json())).then((e=>o(e)))}},l=new class{constructor(){}toggleLoginTabs(){let e=document.getElementById("login-form"),t=document.getElementById("signup-form"),n=document.getElementById("login-tab"),o=document.getElementById("signup-tab");n.addEventListener("click",(()=>{e.style.display="block",t.style.display="none",n.style.backgroundColor="lightgrey",o.style.backgroundColor="transparent"})),o.addEventListener("click",(()=>{e.style.display="none",t.style.display="block",n.style.backgroundColor="transparent",o.style.backgroundColor="lightgrey"}))}toggleShowLogoutOption(){if(0===document.getElementById("logout").style.display.localeCompare("block"))document.getElementById("logout").style.display="none";else{let e=document.getElementById("user-icon").getBoundingClientRect();console.log(e),document.getElementById("logout").style.display="block",document.getElementById("logout").style.top=e.top+"px",document.getElementById("logout").style.left=e.left-110+"px"}}toggleShowFolderMenu(){let e=document.getElementById("folders-sidebar");0===e.style.visibility.localeCompare("visible")?e.style.visibility="hidden":e.style.visibility="visible"}toggleShowButtons(){document.querySelectorAll(".note-container-header").forEach((e=>{e.addEventListener("mouseover",(()=>{document.querySelectorAll(".folder-btn-container").forEach((e=>{e.style.visibility="visible"}))}))})),document.querySelectorAll(".note-container-header").forEach((e=>{e.addEventListener("mouseout",(()=>{document.querySelectorAll(".folder-btn-container").forEach((e=>{e.style.visibility="hidden"}))}))}))}displayAllFolderData(e,t){this.displayFolders(e,t),this.toggleShowButtons(),document.getElementById("folders-sidebar-header").addEventListener("mouseover",(()=>{document.getElementById("add-folder-icon").style.visibility="visible"})),document.getElementById("folders-sidebar-header").addEventListener("mouseout",(()=>{document.getElementById("add-folder-icon").style.visibility="hidden"}))}displayFolders(e,t){console.log("http "+t);let n=document.getElementById("folders-container"),o=(document.getElementById("notes-container"),document.createElement("div"));for(let l=0;l<e.length;l++)o.innerHTML=e[l].name,o.id="folder"+l,o.classList.add("folder"),o.addEventListener("click",this.toggleCurrentFolder),n.appendChild(o),o=document.createElement("div"),this.buildNotesContainer(e[l],l,t)}addFolder(e,t){document.getElementById("new-folder-popup-wrapper").style.display="none";let n=document.getElementById("folders-container"),o=document.createElement("div"),l=n.childNodes.length+1;o.innerHTML=e.name,o.id="folder"+l,o.classList.add("folder"),o.addEventListener("click",this.toggleCurrentFolder),n.appendChild(o),this.buildNotesContainer(e,l,t),this.toggleShowButtons()}deleteFolder(e){let t=document.getElementById("folder"+e.srcElement.id),n=document.getElementById("notes-sub-container"+e.srcElement.id);t.remove(),n.remove();let o=document.getElementById("folders-container").childNodes[0].id;this.toggleCurrentFolder({srcElement:{id:o}})}updateFolder(e,t){document.getElementById("update-folder-popup-wrapper").style.display="none",document.getElementById("folder"+e).innerHTML=t.name,console.log(document.getElementById("folder"+e).innerHTML),document.getElementById("folder-name-notes-container"+e).innerHTML=t.name,null!==document.getElementById("folder-description-notes-container"+e)&&(document.getElementById("folder-description-notes-container"+e).innerHTML=t.description),document.getElementById("update-folder-name-field").value=t.name,document.getElementById("update-folder-description-field").value=t.description}addNote(e,t,n){document.getElementById("new-note-popup-wrapper").style.display="none";let o=document.getElementById("notes-sub-container"+t),l=document.getElementById("notes-sub-container"+t).childNodes.length-1;o.appendChild(this.buildNoteElement(e,t,n,l))}updateNote(e,t){document.getElementById(t+"name").innerHTML=e.name,document.getElementById(t+"description").innerHTML=e.description,console.log("changes saved")}deleteNote(e){document.getElementById(e).remove(),document.getElementById("close-show-note-popup").click()}buildNotesContainer(e,t,n){let o=document.getElementById("notes-container"),l=document.createElement("div"),d=document.createElement("div"),i=document.createElement("div");d.classList.add("note-container-header"),i.classList.add("folder-btn-container"),l.classList.add("notes-sub-container"),l.id="notes-sub-container"+t;let a=document.createElement("div");if(a.id="folder-name-notes-container"+t,a.innerHTML=e.name,a.classList.add("note-container-name"),d.appendChild(a),i.appendChild(this.buildFolderDeleteBtn(e,t,n)),i.appendChild(this.buildFolderEditBtn(e,t,n)),i.appendChild(this.buildCreateNoteBtn(e,t,n)),d.appendChild(i),l.appendChild(d),document.getElementById("close-show-note-popup").addEventListener("click",(()=>{document.getElementById("show-note-popup-wrapper").style.display="none",document.getElementById("edit-note-submit-btn").outerHTML=document.getElementById("edit-note-submit-btn").outerHTML,document.getElementById("delete-note-form").outerHTML=document.getElementById("delete-note-form").outerHTML})),null!=e.notes)for(let o=0;o<e.notes.length;o++)l.appendChild(this.buildNoteElement(e.notes[o],t,n,o));o.appendChild(l)}buildFolderDeleteBtn(t,n,o){let l=document.createElement("img");return l.src="./images/delete_icon.png",l.id=n,l.title="Delete Folder",l.addEventListener("click",(n=>{1===document.getElementById("folders-container").childNodes.length?(console.log("you cannot delete your last folder"),alert("You cannot delete your last folder")):o.deleteFolder(n,e+"/api/folder/"+t._id,"delete",{},(e=>e))})),l}buildFolderEditBtn(t,n,o){let l=document.createElement("img");return l.src="./images/edit_icon.png",l.title="Edit Folder",l.addEventListener("click",(()=>{document.getElementById("update-folder-name-field").value=document.getElementById("folder-name-notes-container"+n).innerHTML,null!==document.getElementById("folder-description-notes-container"+n)&&(document.getElementById("update-folder-description-field").value=document.getElementById("folder-description-notes-container"+n).innerHTML),document.getElementById("update-folder-popup-wrapper").style.display="block",document.getElementById("update-folder-submit-btn").addEventListener("click",(l=>{l.preventDefault();let d=document.getElementById("update-folder-name-field").value,i="";null!==document.getElementById("update-folder-description-field")&&(i=document.getElementById("update-folder-description-field").value),console.log(d),console.log(i),o.updateFolderData(n,e+"/api/folder/"+t._id,"put",{name:d,description:i},(e=>e)),document.getElementById("update-folder-form").outerHTML=document.getElementById("update-folder-form").outerHTML}))})),document.getElementById("close-update-folder-popup").addEventListener("click",(()=>{document.getElementById("update-folder-popup-wrapper").style.display="none"})),l}buildCreateNoteBtn(t,n,o){let l=document.createElement("img");return l.src="./images/add_icon.png",l.title="New Note",l.addEventListener("click",(()=>{document.getElementById("new-note-popup-wrapper").style.display="block",document.getElementById("new-note-submit-btn").addEventListener("click",(l=>{l.preventDefault();let d=document.getElementById("new-note-name-field").value,i=document.getElementById("new-note-description-field").value;document.getElementById("new-note-name-field").value="",document.getElementById("new-note-description-field").value="",o.sendNewNoteData(n,e+"/api/folder/"+t._id+"/note","post",{name:d,description:i},(e=>e)),document.getElementById("new-note-submit-btn").outerHTML=document.getElementById("new-note-submit-btn").outerHTML}))})),document.getElementById("close-new-note-popup").addEventListener("click",(()=>{document.getElementById("new-note-popup-wrapper").style.display="none"})),l}buildNoteElement(t,n,o,l){let d=document.createElement("div"),i=document.createElement("div"),a=document.createElement("div");return d.id="folder"+n+"note"+l,d.classList.add("note"),i.innerHTML=t.name,i.id="folder"+n+"note"+l+"name",i.classList.add("note-name"),a.innerHTML=t.description,a.id="folder"+n+"note"+l+"description",a.classList.add("note-description"),d.addEventListener("click",(()=>{document.getElementById("show-note-popup-wrapper").style.display="block",document.getElementById("show-note-name-field").value=document.getElementById("folder"+n+"note"+l+"name").innerHTML,document.getElementById("show-note-description-field").value=document.getElementById("folder"+n+"note"+l+"description").innerHTML,document.getElementById("edit-note-submit-btn").addEventListener("click",(d=>{d.preventDefault(),console.log("called");let i=document.getElementById("show-note-name-field").value,a=document.getElementById("show-note-description-field").value;o.updateNoteData("folder"+n+"note"+l,e+"/api/folder/note/"+t._id,"put",{name:i,description:a},(e=>e))})),document.getElementById("delete-note-submit-btn").addEventListener("click",(d=>{d.preventDefault(),o.deleteNote("folder"+n+"note"+l,e+"/api/folder/note/"+t._id,"delete",{},(e=>e)),document.getElementById("delete-note-submit-btn").outerHTML=document.getElementById("delete-note-submit-btn").outerHTML}))})),d.appendChild(i),d.appendChild(a),d}toggleCurrentFolder(e){let t=document.getElementsByClassName("notes-sub-container");for(let e=0;e<t.length;e++)t[e].style.display="none";document.getElementById("notes-sub-container"+e.srcElement.id.substring(6)).style.display="block",document.getElementById("folders-sidebar").style.visibility="hidden"}openNewFolderForm(){document.getElementById("new-folder-popup-wrapper").style.display="block"}closeNewFolderForm(){document.getElementById("new-folder-popup-wrapper").style.display="none"}};async function d(e,t,d,i){let a=await o.sendData(e,t,d,i);console.log(a),void 0!==a.name&&l.addFolder(a,n)}0===window.location.pathname.localeCompare("/login.html")?(l.toggleLoginTabs(),console.log("login page"),document.getElementById("login-form").addEventListener("submit",(e=>{e.preventDefault();let t=document.getElementById("login-username-field").value,n=document.getElementById("login-password-field").value;document.getElementById("login-username-field").value="",document.getElementById("login-password-field").value="",async function(e,t,n,l){let d=await o.sendData("http://notes.patrickcs.com/api/login","post",n,(e=>e));localStorage.setItem("user",JSON.stringify(d)),null!=d.token?window.location.href="dashboard.html":(document.getElementById("login-response").innerHTML="Invalid Credentials",console.log("invalid credentials"),alert("Invalid Credentials"))}(0,0,{username:t,password:n})})),document.getElementById("signup-form").addEventListener("submit",(e=>{e.preventDefault();let n=document.getElementById("signup-username-field").value,l=document.getElementById("signup-password-field").value,i=document.getElementById("signup-password-confirm-field").value;document.getElementById("signup-username-field").value="",document.getElementById("signup-password-field").value="",document.getElementById("signup-password-confirm-field").value="",async function(e,n,l,i){let a=await o.sendData("http://notes.patrickcs.com/api/make_account","post",l,(e=>e));console.log(a),void 0!==a.token?(localStorage.setItem("user",JSON.stringify(a)),window.location.href="dashboard.html",d(t+"/api/folder","post",{name:"Notes",description:""},(e=>e))):0===a.message.localeCompare("passwords differ")?(console.log("passwords differ"),alert("Passwords do not match")):0===a.message.localeCompare("username is taken")?(console.log("username is taken"),alert("Username is already taken")):(console.log("error creating new account"),alert("error creating new account"))}(0,0,{username:n,password:l,password_confirmed:i})}))):0===window.location.pathname.localeCompare("/dashboard.html")?(async function(){let e=await o.getData(t+"/api/folders","get",(e=>e));console.log(e),console.log(e.folderData),403===e?window.location.href="login.html":l.displayAllFolderData(e.folderData,n)}(),document.getElementById("folders-sidebar-header").addEventListener("click",l.openNewFolderForm),document.getElementById("close-new-folder-popup").addEventListener("click",l.closeNewFolderForm),document.getElementById("logout").addEventListener("click",(function(){localStorage.setItem("user",JSON.stringify("")),window.location.href="login.html"})),document.getElementById("user-icon").addEventListener("click",l.toggleShowLogoutOption),document.getElementById("menu-icon").addEventListener("click",l.toggleShowFolderMenu),document.getElementById("new-folder-submit-btn").addEventListener("click",(e=>{e.preventDefault(),console.log("event");let n=document.getElementById("new-folder-name-field").value,o=document.getElementById("new-folder-description-field").value;document.getElementById("new-folder-name-field").value="",document.getElementById("new-folder-description-field").value="",d(t+"/api/folder","post",{name:n,description:o},(e=>e))}))):0===window.location.pathname.localeCompare("/index.html")&&(window.location.href="login.html")})();