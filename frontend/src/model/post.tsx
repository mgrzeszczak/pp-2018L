export default class Post {
    id: number;
    author: string;
    content: string;
    timestamp: number;

    constructor(id: number, author: string, content: string) {
        this.content = content;
        this.id = id;
        this.author = author;
        this.timestamp = Date.now();
    }

}
