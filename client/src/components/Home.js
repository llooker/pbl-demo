import React from 'react';
import './Home.css';
import { GoogleLogin } from 'react-google-login';

class Home extends React.Component {
    constructor() {
        super();
        this.state = {
            looks: []
        }
    }

    componentDidMount() {
        console.log('componentDidMount')
        console.log('GoogleLogin')
        console.log(GoogleLogin)
        // this.getLookerData();
        // this.performAuth();


        // const responseGoogle = (response) => {
        //     console.log(response);
        // }
    }


    async getLookerData() {
        console.log('getLookerData')
        let lookerResposnse = await fetch('/home', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })

        let lookerResposnseData = await lookerResposnse.json();
        console.log('lookerResposnseData')
        console.log(lookerResposnseData)
        this.setState({
            // looks: lookerResposnseData.looks,
            // dashboards: lookerResposnseData.dashboards,
            // session: lookerResposnseData.session,
            embed_url: lookerResposnseData.embed_url
        }, () => {
            // console.log('this.state.looks')
            // console.log(this.state.looks)
        });
    }


    async performAuth() {
        console.log('performAuth')
        let authResponse = await fetch('/login', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })
        console.log('authResponse')
        console.log(authResponse)
    }

    // onSignIn = (googleUser) => {
    //     var profile = googleUser.getBasicProfile();
    //     console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    //     console.log('Name: ' + profile.getName());
    //     console.log('Image URL: ' + profile.getImageUrl());
    //     console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    // }


    responseGoogle = (response) => {
        console.log(response);
    }


    render() {
        // console.log('this.state.looks', this.state.looks)
        // console.log('this.state.dashboards', this.state.dashboards)
        // console.log('this.state.session', this.state.session)
        console.log('this.state.embed_url', this.state.embed_url)
        return (
            <div className="home container p-5">
                {/* <h1>the start of a cool app</h1>
                <h3>looks</h3>
                <ul><iframe id='embedLook'
                    title="Inline Frame Example"
                    width="500"
                    height="500"
                    // src={this.state.dashboards[index].embed_url ? this.state.dashboards[index].embed_url : 'https://localhost:9999/embed' + this.state.dashboards[index].short_url + '?allow_login_screen=true'} >
                    // src={'https://localhost:9999/embed/dashboards/' + this.state.dashboards[index].id} >
                    src={this.state.embed_url}>
                </iframe>
                </ul> */}
                {/* <div class="g-signin2" data-onsuccess={() => this.onSignIn()} ></div> */}
                <GoogleLogin
                    clientId="1026815692414-cdeeupbmb7bbjcmfovmr6bqktsi86c2u.apps.googleusercontent.com"
                    buttonText="Login"
                    onSuccess={() => this.responseGoogle()}
                    onFailure={() => this.responseGoogle()}
                    cookiePolicy={'single_host_origin'}
                />
            </div >
        )
    }
}

export default Home;

