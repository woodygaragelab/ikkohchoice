import React, { useState, useEffect } from 'react';
import './App.css';
import { API, Storage } from 'aws-amplify';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { listItems } from './graphql/queries';
import { createItem as createItemMutation, deleteItem as deleteItemMutation } from './graphql/mutations';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Detail from './detail';
import { BrowserRouter as Router, Route } from 'react-router-dom';

const initialFormState = { name: '', description: '' }
const initialItemState = [{ name: '', description: '' }]

class App extends React.Component {
  // const [items, setItems] = useState([]);
  // const [items, setItems] = useState(initialItemState);
  // const [formData, setFormData] = useState(initialFormState);
  // useEffect(() => {
  //   fetchItems();
  // }, []);

  constructor(props) {
    super(props);
    this.fetchItems = this.fetchItems.bind(this);
    this.createItem = this.createItem.bind(this);
    this.editItem = this.editItem.bind(this);
    this.onChange = this.onChange.bind(this);
    this.state = {
      items: initialItemState,
      formData: initialFormState
    };
  }




  async fetchItems() {
    const apiData = await API.graphql({ query: listItems });
    const itemsFromAPI = apiData.data.listItems.items;
    await Promise.all(itemsFromAPI.map(async item => {
      if (item.image) {
        const image = await Storage.get(item.image);
        item.image = image;
      }
      return item;
    }))
    //setItems(apiData.data.listItems.items);
    this.setState({items: apiData.data.listItems.items});
  }

  async createItem() {
    if (!this.state.formData.name || !this.state.formData.description) return;
    await API.graphql({ query: createItemMutation, variables: { input: this.state.formData } });
    if (this.state.formData.image) {
      const image = await Storage.get(this.state.formData.image);
      //formData.image = image;
      this.state.formData.image = image;
      //this.setState({formData: {image: image}});
      this.setState({formData: this.state.formData});
    }
    //setItems([ ...items, formData ]);
    this.setState({items: [ ...this.state.items, this.state.formData ]});
    //setFormData(initialFormState);
    this.setState({formData: initialFormState});
    
  }

  async deleteItem({ id }) {
    const newItemsArray = this.state.items.filter(item => item.id !== id);
    this.setState({items: newItemsArray});
    await API.graphql({ query: deleteItemMutation, variables: { input: { id } }});
  }

  editItem({id}) {
  //async function editItem({ id }) {

    this.props.history.push({
       pathname: '/detail',
       state: { 
         id: id
       }
     });
  }

  async onChange(e) {
    if (!e.target.files[0]) return
    const file = e.target.files[0];
    //setFormData({ ...formData, image: file.name });
    this.setState({formData: { ...this.state.formData, image: file.name }});
    await Storage.put(file.name, file);
    this.fetchItems();
  }
  
  render(){
    return (
    <div className="App">
      <Router>
          <div>
            {/* <Route exact path='/' component={Home}/> */}
            <Route path='/detail' component={Detail}/>
          </div>
      </Router>


      <h1>I's choice</h1>
      <div style={{marginBottom: 30}}>
        {
          this.state.items.map(item => (
            <Card>
            <Card.Body>
              {/* <div key={item.id || item.name}> */}
              <div class="container-fluid">
              <div class="row">
                <div class="col-4">
                  <img src={item.image} style={{width: 50,height:50}}/>
                </div>
                <div class="col-6">
                  <div>{item.name}</div>
                  <div>{item.description}</div>
                </div>
                <div class="col-2">
                  {/* <Button onClick={() =>  editItem(item)} variant="outline-primary">Edit</Button>
                  <Button onClick={() =>  deleteItem(item)} variant="outline-primary">Delete</Button> */}
                  <Button onClick={() =>  this.editItem(item)} variant="outline-primary">Edit</Button>
                  <Button onClick={() =>  this.deleteItem(item)} variant="outline-primary">Delete</Button>
                </div>
              </div>              
              </div>              
            </Card.Body>
            </Card>
          ))
        }
      </div>

      <div class="container-fluid">
       <div class="row">
         <div class="col-3">
           <Button onClick={this.createItem} variant="outline-primary">ADD</Button>
         </div>
         <div class="col-3">
           <input
            //  onChange={e => setFormData({ ...formData, 'name': e.target.value})}
             onChange={e => this.setState({formData: { ...this.state.formData, 'name': e.target.value }})}
             placeholder="name"
             value={this.state.formData.name}
           />
         </div>
         <div class="col-3">
           <input
            //  onChange={e => setFormData({ ...formData, 'description': e.target.value})}
             onChange={e => this.setState({formData: { ...this.state.formData, 'description': e.target.value }})}
             placeholder="description"
             value={this.state.formData.description}
           />
         </div>
         <div class="col-3">
           <input
             type="file"
             onChange={this.onChange}
           />
         </div>
       </div>              
      </div> 

      <AmplifySignOut />
    </div>
  )};
}

export default withAuthenticator(App);
// export default App;