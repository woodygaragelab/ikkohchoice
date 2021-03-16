//import logo from './logo.svg';
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

function App() {
//class App extends React.Component {
  const [items, setItems] = useState([]);
  const [items, setItems] = useState(initialItemState);
  const [formData, setFormData] = useState(initialFormState);

  // constructor(props) {
  //   super(props);
  //   //this.handleChange1 = this.handleChange1.bind(this)
  //   //this.handleChange2 = this.handleChange2.bind(this)
  //   //this.handleClick = this.handleClick.bind(this)
  //   this.editItem = this.editItem.bind(this);
  //   this.state = {
  //     id: ""
  //   };
  // }



  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    const apiData = await API.graphql({ query: listItems });
    const itemsFromAPI = apiData.data.listItems.items;
    await Promise.all(itemsFromAPI.map(async item => {
      if (item.image) {
        const image = await Storage.get(item.image);
        item.image = image;
      }
      return item;
    }))
    setItems(apiData.data.listItems.items);
  }

  async function createItem() {
    if (!formData.name || !formData.description) return;
    await API.graphql({ query: createItemMutation, variables: { input: formData } });
    if (formData.image) {
      const image = await Storage.get(formData.image);
      formData.image = image;
    }
    setItems([ ...items, formData ]);
    setFormData(initialFormState);
  }

  async function deleteItem({ id }) {
    const newItemsArray = items.filter(item => item.id !== id);
    setItems(newItemsArray);
    await API.graphql({ query: deleteItemMutation, variables: { input: { id } }});
  }

  function editItem({id}) {
  //async function editItem({ id }) {

    // this.props.history.push({
    //    pathname: '/detail',
    //    state: { 
    //      id: id
    //    }
    //  });
  }

  async function onChange(e) {
    if (!e.target.files[0]) return
    const file = e.target.files[0];
    setFormData({ ...formData, image: file.name });
    await Storage.put(file.name, file);
    fetchItems();
  }

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
          items.map(item => (
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
                  <Button onClick={() =>  editItem(item)} variant="outline-primary">Edit</Button>
                  <Button onClick={() =>  deleteItem(item)} variant="outline-primary">Delete</Button>
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
           <Button onClick={createItem} variant="outline-primary">ADD</Button>
         </div>
         <div class="col-3">
           <input
             onChange={e => setFormData({ ...formData, 'name': e.target.value})}
             placeholder="name"
             value={formData.name}
           />
         </div>
         <div class="col-3">
           <input
             onChange={e => setFormData({ ...formData, 'description': e.target.value})}
             placeholder="description"
             value={formData.description}
           />
         </div>
         <div class="col-3">
           <input
             type="file"
             onChange={onChange}
           />
         </div>
       </div>              
      </div> 

      <AmplifySignOut />
    </div>
  );
}

export default withAuthenticator(App);
// export default App;