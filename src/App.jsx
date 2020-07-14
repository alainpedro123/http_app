import React, { Component } from "react";
import { ToastContainer } from 'react-toastify';
import http from './services/httpService';
import config from './config.json';
import 'react-toastify/dist/ReactToastify.css';

class App extends Component {
  state = {
    posts: []
  };

  async componentDidMount(){ // we call the server here
    const { data: posts } = await http.get(config.url);
    this.setState( { posts });
  }

  handleAdd = async () => { // CREATING DATA - POST
    const obj = { title: 'a', body: 'b' } // Creating a new data
    const { data: post } = await http.post(config.url, obj); // posting(creating) the data "obj" in the server.
    const posts = [post, ...this.state.posts];
    this.setState({ posts });
  };

  handleUpdate = async post => { // UPDATING DATA - PUT
    post.title = 'UPDATED';
    await http.put(config.url + '/' + post.id, post); 
    
    const posts=[...this.state.posts];
    const index = posts.indexOf(post);

    posts[index] = { ...post} 
    this.setState({ posts });
  };

  handleDelete = async post => { // DELETING DATA - DELETE
// 1. reference of the original states
    const originalPosts = this.state.posts;

// 2. update the UI accordingly before calling the server
    const posts = this.state.posts.filter(p => p.id !== post.id);
      this.setState({ posts });
    
// 3. wrap the call to the server
    try{ // we use "try - catch" to do something especific as a result of the expected failure
      await http.delete(config.url + "/" + post.id);
    }
    catch(error){   
      console.log("HANDLE DELETE CATCH BLOCK");

        if(error.response && error.status === 404) //checking a specific expected error
        alert("This post has already been deleted.");
    
        this.setState({ posts: originalPosts }); 
    }
};
  render() {
    return (
      <React.Fragment>
      <ToastContainer/>
        <button className="btn btn-primary" onClick={this.handleAdd}>
          Add
        </button>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {this.state.posts.map(post => (
              <tr key={post.id}>
                <td>{post.title}</td>
                <td>
                  <button
                    className="btn btn-info btn-sm"
                    onClick={() => this.handleUpdate(post)}
                  >
                    Update
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => this.handleDelete(post)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </React.Fragment>
    );
  }
}

export default App;