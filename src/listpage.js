import React from 'react';
import { Component } from 'react';
import './listpage.css';
import { API, Storage } from 'aws-amplify';
//import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
//import { Auth } from 'aws-amplify';
import { listItems } from './graphql/queries';
import { deleteItem as deleteItemMutation } from './graphql/mutations';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit,faTrash,faPlusCircle } from "@fortawesome/free-solid-svg-icons";

const initialFormState = { name: '', description: '', image: '', imageFile: '', imageUrl: '' }
const initialItemState = [{ name: '', description: '' }]

class ListPage extends Component {

  constructor(props){
    super(props);
    this.fetchItems = this.fetchItems.bind(this);
    this.createItem = this.createItem.bind(this);
    this.editItem = this.editItem.bind(this);
    
    this.state = {
      isLoggedIn: false,
      username: "",
      items: initialItemState,
      formData: initialFormState
    };
    this.fetchItems();

  }

  async fetchItems() {
    this.state = {items:initialItemState}
    // const user = await Auth.currentUserInfo();
    // if (user) {
    //   this.setState({isLoggedIn: true});
    //   this.setState({username: user.username});
    // }
    const apiData = await API.graphql({ query: listItems });
    const itemsFromAPI = apiData.data.listItems.items;
    await Promise.all(itemsFromAPI.map(async item => {
      if (item.imageFile) {
        const imageUrl = await Storage.get(item.imageFile);
        item.imageUrl = imageUrl;
      }
      return item;
    }))
    this.setState({items: apiData.data.listItems.items});
  }

  async createItem() {
    this.props.history.push({
      pathname: '/detailpage',
      state: { 
        item: {id:""}
      }
    });
  }

  async deleteItem({ id }) {
    const newItemsArray = this.state.items.filter(item => item.id !== id);
    this.setState({items: newItemsArray});
    await API.graphql({ query: deleteItemMutation, variables: { input: { id } }});
  }

  editItem(item) {
    this.props.history.push({
      pathname: '/detailpage',
      state: { 
        item: item
      }
    });
  }

  handleChange(e){
    this.setState({
      text: e.target.value
    })
  }

  render() {

    return (
      <div style={{marginBottom: 30}}  className="container-fluid">
        <h1>I's choice {this.state.username}</h1>

        {
          this.state.items.map(item => (
            <div key={item.id || item.name}>
            <Card>
            <Card.Body>
              {/* <div className="container-fluid"> */}
              <div className="row">
                <div className="col-4">
                  <img src={item.imageUrl} style={{width: 50,height:50}} alt=""/>
                </div>
                <div className="col-6">
                  <div>{item.name}</div>
                  <div>{item.description}</div>
                </div>
                {/* {this.state.username && */}
                  <div className="col-2">
                    <Button 
                      onClick={() =>  this.editItem(item)} variant="outline-primary">
                      <FontAwesomeIcon icon={faEdit} />
                    </Button>
                    <Button onClick={() =>  this.deleteItem(item)} variant="outline-primary">
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>
                  </div>
                {/* } */}
              </div>              
              {/* </div>               */}
            </Card.Body>
            </Card>
            </div>              
          ))
        }

      <div className="container-fluid">
       <div className="row">
         <div className="col-3">
           <Button onClick={this.createItem} variant="outline-primary">
             <FontAwesomeIcon icon={faPlusCircle} />
           </Button>
         </div>
       </div>              
      </div> 

      </div>
    );
  }
}

export default withRouter(ListPage)  
      