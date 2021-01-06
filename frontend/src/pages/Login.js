import React, { Component} from 'react';
import Navbar from '../components/NavBar';

class Login extends Component {

    // constructor(){
    //     states = {
    //         isFetching: true,
    //         response: ''
    //     }
    // }

    // fetchUsersWithFetchAPI = () => {
    //     this.setState({isFetching: true});
    //     fetch('http://localhost:9000/')
    //         .then(response => response.json())
    //         .then(result => {
    //             this.setState({response: result, isFetching: false})
    //         })
    //         .catch(e => {
    //             console.log(e);
    //             this.setState({isFetching: false});
    //         });
    // };


    render (){

      return (

          <div>
              <Navbar/>
              <div style={{marginTop: "30px"}}>
                  This is the Login Page.
              </div> 

          </div>

      )
    }
  }
  
  export default Login;