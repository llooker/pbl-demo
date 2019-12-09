import React from 'react';
import './Home.css';

class Home extends React.Component {
    constructor() {
        super();
        this.state = {
            looks: []
        }
    }

    componentDidMount() {
        console.log('componentDidMount')
        this.getLooks();
    }

    async getLooks() {
        console.log('getLooks')
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
            looks: lookerResposnseData.looks
        }, () => {
            // console.log('this.state.looks')
            // console.log(this.state.looks)
        });
    }

    render() {
        console.log('this.state.looks', this.state.looks)
        return (
            <div className="home container p-5">
                <h1>the start of a cool app</h1>
                <h3>looks</h3>
                <ul>
                    {this.state.looks.length ? this.state.looks.map((key, index) => {
                        return <li key={index}><iframe id='embedLook'
                            title="Inline Frame Example"
                            width="500"
                            height="500"
                            // public url -- https://localhost:9999/embed/public/wnJ9f4T3D2DJc6rtWttmZhNxCNj33kqz
                            // src={this.state.looks[index].embed_url} >
                            // private -- https://localhost:9999/embed/looks/1?allow_login_screen=true
                            // requires following embed settings
                            // sso disabled, embed authentication enabled
                            src={'https://localhost:9999/embed' + this.state.looks[index].short_url + '?allow_login_screen=true'}>

                        </iframe></li>
                    }) : <li>no looks!</li>}
                </ul>
            </div >
        )
    }
}

export default Home;