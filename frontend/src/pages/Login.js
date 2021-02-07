import React, { Component} from 'react';
import Navbar from '../components/NavBar';
const config = require('../config');

const BACKEND_URL = config.backend.uri;

class Login extends Component {

    constructor(){
        super();
        this.state = {
            isFetching: true,
            response: ''
        }
        this.fetchUsersWithFetchAPI = this.fetchUsersWithFetchAPI.bind();
    }

    /***
     * Take a look at backend/app (route /) to see exactly how the response is being sent 
     */
    fetchUsersWithFetchAPI =  () => {
        this.setState({isFetching: true});
        let submision = {
            name: "a",
            email: "aksingh@ucsd.edu",
            message: "Let's hang girl! We haven't talked in like forever...."
        }
        fetch(BACKEND_URL + 'autoEmails/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: JSON.stringify(submision)
        })
            //Make sure to make the request asynchronous else you will get promises/errors
            .then(async result => {
                if (result.ok){
                    const json = await result.json();
                    this.setState({response: json.message, isFetching: false})
                } else{
                    this.setState({response: "Bad", isFetching: false})
                }
            })
            .catch(e => {
                console.log(e);
                this.setState({response: "Error", isFetching: false});
            });
    };

    componentDidMount(){
        this.fetchUsersWithFetchAPI();
    }


    render (){

      return (

          <div>
              <Navbar currentPage="login"/>
              <div style={{marginTop: "30px"}}>
                  This is the Login Page.
              </div> 
              <p>{this.state.isFetching ? 'Fetching message...' : this.state.response}</p>

          </div>

      )
    }
  }
  
  export default Login;