class Todo{
    constructor(title, description){
        this.title = title;
        this.description = description;
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

export default Todo