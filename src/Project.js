import Todo from "./Todo";

class Project{
    constructor(title, description){
        this.title = title;
        this.description = description;
        this.todoList = [];
    }
    addTodoListItem(title, description, dueDate){
        this.todoList.push(new Todo(title, description, dueDate));
    }
    deleteTodoListItem(index){
        this.todoList.splice(index, 1);
    }
    getTodoList(){
        return this.todoList;
    }
    getTitle(){
        return this.title;
    }
    getDescription(){
        return this.description;
    }
    setTitle(title){
        this.title = title;
    }
    setDescription(description){
        this.description = description;
    }
}

export default Project