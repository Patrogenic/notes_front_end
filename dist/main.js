(()=>{"use strict";const e="http://notes.patrickcs.com",t="http://notes.patrickcs.com";let n={updateFolderData:async function(e,t,n,l,i){let a=await o.sendData(t,n,l,i);console.log(a),void 0!==a.name?d.updateFolder(e,a):console.log("edit was not successful")},deleteFolder:async function(e,t,n,l,i){let a=await o.sendData(t,n,l,i);console.log(a),0!==a.message.localeCompare("success")?console.log("error deleting folder"):d.deleteFolder(e)},updateNoteData:async function(e,t,n,l,i){let a=await o.sendData(t,n,l,i);console.log(a),void 0!==a.name?d.updateNote(a,e):console.log("error saving data")},deleteNote:async function(e,t,n,l,i){let a=await o.sendData(t,n,l,i);console.log(a),0!==a.message.localeCompare("success")?console.log("error deleting note"):d.deleteNote(e)},sendNewNoteData:async function(e,t,l,i,a){let r=await o.sendData(t,l,i,a);console.log(r),void 0!==r.name?d.addNote(r,e,n):console.log("error creating note")}},o=new class{constructor(){}getAllFolders(){const e=JSON.parse(localStorage.getItem("user")).token;return fetch("url",{method:"get",headers:{Accept:"application/json, text/plain, */*","Content-Type":"application/json",Authorization:"Bearer "+e}}).then((e=>(console.log(e),e.json()))).then((e=>{console.log(e)}))}getData(e,t,n){const o=JSON.parse(localStorage.getItem("user")).token;return fetch(e,{method:t,headers:{Accept:"application/json, text/plain, */*","Content-Type":"application/json",Authorization:"Bearer "+o}}).then((e=>200!=e.status?e.status:e.json())).then((e=>n(e)))}sendData(e,t,n,o){const d=JSON.parse(localStorage.getItem("user"));let l;return null!==d&&(l=d.token),fetch(e,{method:t,headers:{Accept:"application/json, text/plain, */*","Content-Type":"application/json",Authorization:"Bearer "+l},body:JSON.stringify(n)}).then((e=>200!=e.status?e.status:e.json())).then((e=>o(e)))}},d=new class{constructor(){}toggleLoginTabs(){let e=document.getElementById("login-form"),t=document.getElementById("signup-form"),n=document.getElementById("login-tab"),o=document.getElementById("signup-tab");n.addEventListener("click",(()=>{e.style.display="block",t.style.display="none",n.style.backgroundColor="lightgrey",o.style.backgroundColor="transparent"})),o.addEventListener("click",(()=>{e.style.display="none",t.style.display="block",n.style.backgroundColor="transparent",o.style.backgroundColor="lightgrey"}))}toggleShowLogoutOption(){if(0===document.getElementById("logout").style.display.localeCompare("block"))document.getElementById("logout").style.display="none";else{let e=document.getElementById("user-icon").getBoundingClientRect();console.log(e),document.getElementById("logout").style.display="block",document.getElementById("logout").style.top=e.top+"px",document.getElementById("logout").style.left=e.left-110+"px"}}toggleShowFolderMenu(){let e=document.getElementById("folders-sidebar");0===e.style.visibility.localeCompare("visible")?e.style.visibility="hidden":e.style.visibility="visible"}toggleShowButtons(){document.querySelectorAll(".note-container-header").forEach((e=>{e.addEventListener("mouseover",(()=>{document.querySelectorAll(".folder-btn-container").forEach((e=>{e.style.visibility="visible"}))}))})),document.querySelectorAll(".note-container-header").forEach((e=>{e.addEventListener("mouseout",(()=>{document.querySelectorAll(".folder-btn-container").forEach((e=>{e.style.visibility="hidden"}))}))}))}displayAllFolderData(e,t){this.displayFolders(e,t),this.toggleShowButtons(),document.getElementById("folders-sidebar-header").addEventListener("mouseover",(()=>{document.getElementById("add-folder-icon").style.visibility="visible"})),document.getElementById("folders-sidebar-header").addEventListener("mouseout",(()=>{document.getElementById("add-folder-icon").style.visibility="hidden"}))}displayFolders(e,t){console.log("http "+t);let n=document.getElementById("folders-container"),o=(document.getElementById("notes-container"),document.createElement("div"));for(let d=0;d<e.length;d++)o.innerHTML=e[d].name,o.id="folder"+d,o.classList.add("folder"),o.addEventListener("click",this.toggleCurrentFolder),n.appendChild(o),o=document.createElement("div"),this.buildNotesContainer(e[d],d,t)}addFolder(e,t){document.getElementById("new-folder-popup-wrapper").style.display="none";let n=document.getElementById("folders-container"),o=document.createElement("div"),d=n.childNodes.length+1;o.innerHTML=e.name,o.id="folder"+d,o.classList.add("folder"),o.addEventListener("click",this.toggleCurrentFolder),n.appendChild(o),this.buildNotesContainer(e,d,t),this.toggleShowButtons()}deleteFolder(e){let t=document.getElementById("folder"+e.srcElement.id),n=document.getElementById("notes-sub-container"+e.srcElement.id);t.remove(),n.remove();let o=document.getElementById("folders-container").childNodes[0].id;this.toggleCurrentFolder({srcElement:{id:o}})}updateFolder(e,t){document.getElementById("update-folder-popup-wrapper").style.display="none",document.getElementById("folder"+e).innerHTML=t.name,console.log(document.getElementById("folder"+e).innerHTML),document.getElementById("folder-name-notes-container"+e).innerHTML=t.name,null!==document.getElementById("folder-description-notes-container"+e)&&(document.getElementById("folder-description-notes-container"+e).innerHTML=t.description),document.getElementById("update-folder-name-field").value=t.name,document.getElementById("update-folder-description-field").innerHTML=t.description}addNote(e,t,n){document.getElementById("new-note-popup-wrapper").style.display="none";let o=document.getElementById("notes-sub-container"+t),d=document.getElementById("notes-sub-container"+t).childNodes.length-1;o.appendChild(this.buildNoteElement(e,t,n,d))}updateNote(e,t){document.getElementById(t+"name").innerHTML=e.name,document.getElementById(t+"description").innerHTML=e.description,console.log("changes saved")}deleteNote(e){document.getElementById(e).remove(),document.getElementById("close-show-note-popup").click()}buildNotesContainer(e,t,n){let o=document.getElementById("notes-container"),d=document.createElement("div"),l=document.createElement("div"),i=document.createElement("div");l.classList.add("note-container-header"),i.classList.add("folder-btn-container"),d.classList.add("notes-sub-container"),d.id="notes-sub-container"+t;let a=document.createElement("div");if(a.id="folder-name-notes-container"+t,a.innerHTML=e.name,a.classList.add("note-container-name"),l.appendChild(a),i.appendChild(this.buildFolderDeleteBtn(e,t,n)),i.appendChild(this.buildFolderEditBtn(e,t,n)),i.appendChild(this.buildCreateNoteBtn(e,t,n)),l.appendChild(i),d.appendChild(l),document.getElementById("close-show-note-popup").addEventListener("click",(()=>{document.getElementById("show-note-popup-wrapper").style.display="none",document.getElementById("edit-note-submit-btn").outerHTML=document.getElementById("edit-note-submit-btn").outerHTML,document.getElementById("delete-note-form").outerHTML=document.getElementById("delete-note-form").outerHTML})),null!=e.notes)for(let o=0;o<e.notes.length;o++)d.appendChild(this.buildNoteElement(e.notes[o],t,n,o));o.appendChild(d)}buildFolderDeleteBtn(t,n,o){let d=document.createElement("img");return d.src="./images/delete_icon.png",d.id=n,d.title="Delete Folder",d.addEventListener("click",(n=>{1===document.getElementById("folders-container").childNodes.length?(console.log("you cannot delete your last folder"),alert("You cannot delete your last folder")):o.deleteFolder(n,e+"/api/folder/"+t._id,"delete",{},(e=>e))})),d}buildFolderEditBtn(t,n,o){let d=document.createElement("img");return d.src="./images/edit_icon.png",d.title="Edit Folder",d.addEventListener("click",(()=>{document.getElementById("update-folder-name-field").value=document.getElementById("folder-name-notes-container"+n).innerHTML,null!==document.getElementById("folder-description-notes-container"+n)&&(document.getElementById("update-folder-description-field").innerHTML=document.getElementById("folder-description-notes-container"+n).innerHTML),document.getElementById("update-folder-popup-wrapper").style.display="block",document.getElementById("update-folder-submit-btn").addEventListener("click",(d=>{d.preventDefault();let l=document.getElementById("update-folder-name-field").value,i="";null!==document.getElementById("update-folder-description-field")&&(i=document.getElementById("update-folder-description-field").innerHTML),console.log(l),console.log(i),o.updateFolderData(n,e+"/api/folder/"+t._id,"put",{name:l,description:i},(e=>e)),document.getElementById("update-folder-form").outerHTML=document.getElementById("update-folder-form").outerHTML}))})),document.getElementById("close-update-folder-popup").addEventListener("click",(()=>{document.getElementById("update-folder-popup-wrapper").style.display="none"})),d}buildCreateNoteBtn(t,n,o){let d=document.createElement("img");return d.src="./images/add_icon.png",d.title="New Note",d.addEventListener("click",(()=>{document.getElementById("new-note-popup-wrapper").style.display="block",document.getElementById("new-note-submit-btn").addEventListener("click",(d=>{d.preventDefault();let l=document.getElementById("new-note-name-field").value,i=document.getElementById("new-note-description-field").innerHTML;document.getElementById("new-note-name-field").value="",document.getElementById("new-note-description-field").innerHTML="",o.sendNewNoteData(n,e+"/api/folder/"+t._id+"/note","post",{name:l,description:i},(e=>e)),document.getElementById("new-note-submit-btn").outerHTML=document.getElementById("new-note-submit-btn").outerHTML}))})),document.getElementById("close-new-note-popup").addEventListener("click",(()=>{document.getElementById("new-note-popup-wrapper").style.display="none"})),d}buildNoteElement(t,n,o,d){let l=document.createElement("div"),i=document.createElement("div"),a=document.createElement("div");return l.id="folder"+n+"note"+d,l.classList.add("note"),i.innerHTML=t.name,i.id="folder"+n+"note"+d+"name",i.classList.add("note-name"),a.innerHTML=t.description,a.id="folder"+n+"note"+d+"description",a.classList.add("note-description"),l.addEventListener("click",(()=>{document.getElementById("show-note-popup-wrapper").style.display="block",document.getElementById("show-note-name-field").value=document.getElementById("folder"+n+"note"+d+"name").innerHTML,document.getElementById("show-note-description-field").innerHTML=document.getElementById("folder"+n+"note"+d+"description").innerHTML,document.getElementById("edit-note-submit-btn").addEventListener("click",(l=>{l.preventDefault(),console.log("called");let i=document.getElementById("show-note-name-field").value,a=document.getElementById("show-note-description-field").innerHTML;o.updateNoteData("folder"+n+"note"+d,e+"/api/folder/note/"+t._id,"put",{name:i,description:a},(e=>e))})),document.getElementById("delete-note-submit-btn").addEventListener("click",(l=>{l.preventDefault(),o.deleteNote("folder"+n+"note"+d,e+"/api/folder/note/"+t._id,"delete",{},(e=>e)),document.getElementById("delete-note-submit-btn").outerHTML=document.getElementById("delete-note-submit-btn").outerHTML}))})),l.appendChild(i),l.appendChild(a),l}toggleCurrentFolder(e){let t=document.getElementsByClassName("notes-sub-container");for(let e=0;e<t.length;e++)t[e].style.display="none";document.getElementById("notes-sub-container"+e.srcElement.id.substring(6)).style.display="block",document.getElementById("folders-sidebar").style.visibility="hidden"}openNewFolderForm(){document.getElementById("new-folder-popup-wrapper").style.display="block"}closeNewFolderForm(){document.getElementById("new-folder-popup-wrapper").style.display="none"}};async function l(e,t,l,i){let a=await o.sendData(e,t,l,i);console.log(a),void 0!==a.name&&d.addFolder(a,n)}0===window.location.pathname.localeCompare("/login.html")?(d.toggleLoginTabs(),console.log("login page"),document.getElementById("login-form").addEventListener("submit",(e=>{e.preventDefault();let t=document.getElementById("login-username-field").value,n=document.getElementById("login-password-field").value;document.getElementById("login-username-field").value="",document.getElementById("login-password-field").value="",async function(e,t,n,d){let l=await o.sendData("http://notes.patrickcs.com/api/login","post",n,(e=>e));localStorage.setItem("user",JSON.stringify(l)),null!=l.token?window.location.href="dashboard.html":(document.getElementById("login-response").innerHTML="Invalid Credentials",console.log("invalid credentials"),alert("Invalid Credentials"))}(0,0,{username:t,password:n})})),document.getElementById("signup-form").addEventListener("submit",(e=>{e.preventDefault();let n=document.getElementById("signup-username-field").value,d=document.getElementById("signup-password-field").value,i=document.getElementById("signup-password-confirm-field").value;document.getElementById("signup-username-field").value="",document.getElementById("signup-password-field").value="",document.getElementById("signup-password-confirm-field").value="",async function(e,n,d,i){let a=await o.sendData("http://notes.patrickcs.com/api/make_account","post",d,(e=>e));console.log(a),void 0!==a.token?(localStorage.setItem("user",JSON.stringify(a)),window.location.href="dashboard.html",l(t+"/api/folder","post",{name:"Notes",description:""},(e=>e))):0===a.message.localeCompare("passwords differ")?(console.log("passwords differ"),alert("Passwords do not match")):0===a.message.localeCompare("username is taken")?(console.log("username is taken"),alert("Username is already taken")):(console.log("error creating new account"),alert("error creating new account"))}(0,0,{username:n,password:d,password_confirmed:i})}))):0===window.location.pathname.localeCompare("/dashboard.html")?(async function(){let e=await o.getData(t+"/api/folders","get",(e=>e));console.log(e),console.log(e.folderData),403===e?window.location.href="login.html":d.displayAllFolderData(e.folderData,n)}(),document.getElementById("folders-sidebar-header").addEventListener("click",d.openNewFolderForm),document.getElementById("close-new-folder-popup").addEventListener("click",d.closeNewFolderForm),document.getElementById("logout").addEventListener("click",(function(){localStorage.setItem("user",JSON.stringify("")),window.location.href="login.html"})),document.getElementById("user-icon").addEventListener("click",d.toggleShowLogoutOption),document.getElementById("menu-icon").addEventListener("click",d.toggleShowFolderMenu),document.getElementById("new-folder-submit-btn").addEventListener("click",(e=>{e.preventDefault(),console.log("event");let n=document.getElementById("new-folder-name-field").value,o=document.getElementById("new-folder-description-field").value;document.getElementById("new-folder-name-field").value="",document.getElementById("new-folder-description-field").value="",l(t+"/api/folder","post",{name:n,description:o},(e=>e))}))):0===window.location.pathname.localeCompare("/index.html")&&(window.location.href="login.html")})();