import Project from "./Project"

class ProjectList{
    constructor(projectsFromStorage){
        this.projectList = [];
        if(projectsFromStorage === []){
            this.addProject('Misc', 'Miscellaneous Todo List');
        }else{
            //api call and then this
            console.log(projectsFromStorage.projectList.length);
            for(let i = 0; i < projectsFromStorage.projectList.length; i++){
                let projectTitle = projectsFromStorage.projectList[i].title;
                let projectDescription = projectsFromStorage.projectList[i].description;
                this.projectList.push(new Project(projectTitle, projectDescription));
                for(let j = 0; j < projectsFromStorage.projectList[i].todoList.length; j++){
                    let todoListItemTitle = projectsFromStorage.projectList[i].todoList[j].title;
                    let todoListItemDescription = projectsFromStorage.projectList[i].todoList[j].description;
                    let todoListItemDueDate = projectsFromStorage.projectList[i].todoList[j].dueDate;

                    this.projectList[i].addTodoListItem(todoListItemTitle, todoListItemDescription, todoListItemDueDate);
                    console.log(todoListItemTitle);
                }
                //begin creating objects to put into ProjectList
                //I have to create every todo item and every projects
            }

        }
    }
    addProject(title, description){
        this.projectList.push(new Project(title, description));
    }
    deleteProject(index){
        this.projectList.splice(index, 1);
    }
    getProjectList(){
        return this.projectList;
    }
    getProjectByIndex(index){
        return this.projectList[index];
    }
}


export default ProjectList