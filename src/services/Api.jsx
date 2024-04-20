export class Api {
  constructor() {
    this.url = 'https://jsonplaceholder.typicode.com';
  }

  async getPosts() {
    const response = await fetch(`${this.url}/posts`);
    return response.json();
  }

  async getPost(id) {
    const response = await fetch(`${this.url}/posts/${id}`);
    return response.json();
  }

  async getUsers() {
    const response = await fetch(`${this.url}/users`);
    return response.json();
  }

  async getUser(id) {
    const response = await fetch(`${this.url}/users/${id}`);
    return response.json();
  }
}