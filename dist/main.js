(()=>{"use strict";const e="http://localhost:3000",t="http://localhost:3000",n="/dist/";let o={updateFolderData:async function(e,t,n,o,a){let r=await d.sendData(t,n,o,a);console.log(r),void 0!==r.name?l.updateFolder(e,r):console.log("edit was not successful")},deleteFolder:async function(e,t,n,o,a){let r=await d.sendData(t,n,o,a);console.log(r),0!==r.message.localeCompare("success")?console.log("error deleting folder"):l.deleteFolder(e)},updateNoteData:async function(e,t,n,o,a){let r=await d.sendData(t,n,o,a);console.log(r),void 0!==r.name?l.updateNote(r,e):console.log("error saving data")},deleteNote:async function(e,t,n,o,a){let r=await d.sendData(t,n,o,a);console.log(r),0!==r.message.localeCompare("success")?console.log("error deleting note"):l.deleteNote(e)},sendNewNoteData:async function(e,t,n,o,a){let r=await d.sendData(t,n,o,a);console.log(r),void 0!==r.name?l.addNote(r,e):console.log("error creating note")}},d=new class{constructor(){}getAllFolders(){const e=JSON.parse(localStorage.getItem("user")).token;return fetch("url",{method:"get",headers:{Accept:"application/json, text/plain, */*","Content-Type":"application/json",Authorization:"Bearer "+e}}).then((e=>(console.log(e),e.json()))).then((e=>{console.log(e)}))}getData(e,t,n){const o=JSON.parse(localStorage.getItem("user")).token;return fetch(e,{method:t,headers:{Accept:"application/json, text/plain, */*","Content-Type":"application/json",Authorization:"Bearer "+o}}).then((e=>200!=e.status?e.status:e.json())).then((e=>n(e)))}sendData(e,t,n,o){const d=JSON.parse(localStorage.getItem("user")).token;return console.log("url: "+e),fetch(e,{method:t,headers:{Accept:"application/json, text/plain, */*","Content-Type":"application/json",Authorization:"Bearer "+d},body:JSON.stringify(n)}).then((e=>200!=e.status?e.status:e.json())).then((e=>o(e)))}},l=new class{constructor(){}toggleLoginTabs(){let e=document.getElementById("login-form"),t=document.getElementById("signup-form"),n=document.getElementById("login-tab"),o=document.getElementById("signup-tab");n.addEventListener("click",(()=>{e.style.display="block",t.style.display="none",n.style.backgroundColor="lightgrey",o.style.backgroundColor="transparent"})),o.addEventListener("click",(()=>{e.style.display="none",t.style.display="block",n.style.backgroundColor="transparent",o.style.backgroundColor="lightgrey"}))}displayAllFolderData(e,t){this.displayFolders(e,t)}displayFolders(e,t){console.log("http "+t);let n=document.getElementById("folders-container"),o=(document.getElementById("notes-container"),document.createElement("div"));for(let d=0;d<e.length;d++)o.innerHTML=e[d].name,o.id="folder"+d,o.classList.add("folder"),o.addEventListener("click",this.toggleCurrentFolder),n.appendChild(o),o=document.createElement("div"),this.buildNotesContainer(e[d],d,t)}addFolder(e,t){document.getElementById("new-folder-popup-wrapper").style.display="none";let n=document.getElementById("folders-container"),o=document.createElement("div"),d=n.childNodes.length+1;o.innerHTML=e.name,o.id="folder"+d,o.classList.add("folder"),o.addEventListener("click",this.toggleCurrentFolder),n.appendChild(o),this.buildNotesContainer(e,d,t)}deleteFolder(e){let t=document.getElementById("folder"+e.srcElement.id),n=document.getElementById("notes-sub-container"+e.srcElement.id);t.remove(),n.remove(),this.toggleCurrentFolder({srcElement:{id:"folder0"}})}updateFolder(e,t){document.getElementById("update-folder-popup-wrapper").style.display="none",document.getElementById("folder"+e).innerHTML=t.name,console.log(document.getElementById("folder"+e).innerHTML),document.getElementById("folder-name-notes-container"+e).innerHTML=t.name,document.getElementById("folder-description-notes-container"+e).innerHTML=t.description,document.getElementById("update-folder-name-field").value=t.name,document.getElementById("update-folder-description-field").value=t.description}addNote(e,t){document.getElementById("new-note-popup-wrapper").style.display="none";let n=document.getElementById("notes-sub-container"+t),o=document.createElement("div");o.innerHTML=e.name,n.appendChild(o)}updateNote(e,t){document.getElementById(t+"name").innerHTML=e.name,document.getElementById(t+"description").innerHTML=e.description,console.log("changes saved")}deleteNote(e){document.getElementById(e).remove(),document.getElementById("close-show-note-popup").click()}buildNotesContainer(e,t,n){let o=document.getElementById("notes-container"),d=document.createElement("div");d.classList.add("notes-sub-container"),d.id="notes-sub-container"+t;let l=document.createElement("div");l.id="folder-name-notes-container"+t,l.innerHTML=e.name;let a=document.createElement("div");if(a.id="folder-description-notes-container"+t,a.innerHTML=e.description,d.appendChild(l),d.appendChild(this.buildFolderDeleteBtn(e,t,n)),d.appendChild(this.buildFolderEditBtn(e,t,n)),d.appendChild(this.buildCreateNoteBtn(e,t,n)),d.appendChild(a),document.getElementById("close-show-note-popup").addEventListener("click",(()=>{document.getElementById("show-note-popup-wrapper").style.display="none",document.getElementById("edit-note-submit-btn").outerHTML=document.getElementById("edit-note-submit-btn").outerHTML,document.getElementById("delete-note-form").outerHTML=document.getElementById("delete-note-form").outerHTML})),null!=e.notes)for(let o=0;o<e.notes.length;o++)d.appendChild(this.buildNoteElement(e,t,n,o));o.appendChild(d)}buildFolderDeleteBtn(t,n,o){let d=document.createElement("button");return d.innerHTML="Delete",d.id=n,d.addEventListener("click",(n=>{o.deleteFolder(n,e+"/api/folder/"+t._id,"delete",{},(e=>e))})),d}buildFolderEditBtn(t,n,o){let d=document.createElement("button");return d.innerHTML="Edit",d.addEventListener("click",(()=>{document.getElementById("update-folder-name-field").value=document.getElementById("folder-name-notes-container"+n).innerHTML,document.getElementById("update-folder-description-field").value=document.getElementById("folder-description-notes-container"+n).innerHTML,document.getElementById("update-folder-popup-wrapper").style.display="block",document.getElementById("update-folder-form").addEventListener("submit",(d=>{d.preventDefault();let l=document.getElementById("update-folder-name-field").value,a=document.getElementById("update-folder-description-field").value;console.log(l),console.log(a),o.updateFolderData(n,e+"/api/folder/"+t._id,"put",{name:l,description:a},(e=>e)),document.getElementById("update-folder-form").outerHTML=document.getElementById("update-folder-form").outerHTML}))})),document.getElementById("close-update-folder-popup").addEventListener("click",(()=>{document.getElementById("update-folder-popup-wrapper").style.display="none"})),d}buildCreateNoteBtn(t,n,o){let d=document.createElement("button");return d.innerHTML="New Note",d.addEventListener("click",(()=>{document.getElementById("new-note-popup-wrapper").style.display="block",document.getElementById("new-note-form").addEventListener("submit",(d=>{d.preventDefault();let l=document.getElementById("new-note-name-field").value,a=document.getElementById("new-note-description-field").value;document.getElementById("new-note-name-field").value="",document.getElementById("new-note-description-field").value="",o.sendNewNoteData(n,e+"/api/folder/"+t._id+"/note","post",{name:l,description:a},(e=>e)),document.getElementById("update-folder-form").outerHTML=document.getElementById("update-folder-form").outerHTML}))})),document.getElementById("close-new-note-popup").addEventListener("click",(()=>{document.getElementById("new-note-popup-wrapper").style.display="none"})),d}buildNoteElement(t,n,o,d){let l=document.createElement("div"),a=document.createElement("div"),r=document.createElement("div");return l.id="folder"+n+"note"+d,l.classList.add("note"),a.innerHTML=t.notes[d].name,a.id="folder"+n+"note"+d+"name",a.classList.add("note-name"),r.innerHTML=t.notes[d].description,r.id="folder"+n+"note"+d+"description",r.classList.add("note-description"),l.addEventListener("click",(()=>{document.getElementById("show-note-popup-wrapper").style.display="block",document.getElementById("show-note-name-field").value=document.getElementById("folder"+n+"note"+d+"name").innerHTML,document.getElementById("show-note-description-field").value=document.getElementById("folder"+n+"note"+d+"description").innerHTML,document.getElementById("edit-note-submit-btn").addEventListener("click",(l=>{l.preventDefault(),console.log("called");let a=document.getElementById("show-note-name-field").value,r=document.getElementById("show-note-description-field").value;o.updateNoteData("folder"+n+"note"+d,e+"/api/folder/note/"+t.notes[d]._id,"put",{name:a,description:r},(e=>e))})),document.getElementById("delete-note-submit-btn").addEventListener("click",(l=>{l.preventDefault(),o.deleteNote("folder"+n+"note"+d,e+"/api/folder/note/"+t.notes[d]._id,"delete",{},(e=>e))}))})),l.appendChild(a),l.appendChild(r),l}toggleCurrentFolder(e){let t=document.getElementsByClassName("notes-sub-container");for(let e=0;e<t.length;e++)t[e].style.display="none";document.getElementById("notes-sub-container"+e.srcElement.id.substring(6)).style.display="block"}openNewFolderForm(){document.getElementById("new-folder-popup-wrapper").style.display="block"}closeNewFolderForm(){document.getElementById("new-folder-popup-wrapper").style.display="none"}};0===window.location.pathname.localeCompare(n+"login.html")?(l.toggleLoginTabs(),console.log("login page"),document.getElementById("login-form").addEventListener("submit",(e=>{e.preventDefault(),async function(e,t,n,o){let l=await d.sendData("http://localhost:3000/api/login","post",n,(e=>e));localStorage.setItem("user",JSON.stringify(l)),null!=l.token?window.location.href="dashboard.html":(document.getElementById("login-response").innerHTML="Invalid Credentials",console.log("invalid credentials"))}(0,0,{username:document.getElementById("username-field").value,password:document.getElementById("password-field").value})}))):0===window.location.pathname.localeCompare(n+"dashboard.html")&&(async function(){let e=await d.getData(t+"/api/folders","get",(e=>e));console.log(e),console.log(e.folderData),403===e?window.location.href="login.html":l.displayAllFolderData(e.folderData,o)}(),document.getElementById("open-new-folder-form").addEventListener("click",l.openNewFolderForm),document.getElementById("close-new-folder-popup").addEventListener("click",l.closeNewFolderForm),document.getElementById("new-folder-form").addEventListener("submit",(e=>{e.preventDefault();let t=document.getElementById("new-folder-name-field").value,n=document.getElementById("new-folder-description-field").value;document.getElementById("new-folder-name-field").value="",document.getElementById("new-folder-description-field").value="",async function(e,t,n,a){let r=await d.sendData("http://localhost:3000/api/folder","post",n,(e=>e));console.log(r),void 0!==r.name&&l.addFolder(r,o)}(0,0,{name:t,description:n})})))})();