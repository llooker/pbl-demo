import React from 'react';
import './Home.css';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            looks: []
        }
    }

    componentDidMount() {
        this.getLookerData();
    }


    async getLookerData() {
        console.log('getLookerData')
        let lookerResposnse = await fetch('/looker', {
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
            embed_url: lookerResposnseData.embed_url
        }, () => {
            // console.log('this.state.looks')
            // console.log(this.state.looks)
        });
    }

    render() {
        console.log('this.state.embed_url', this.state.embed_url)
        return (
            <div className="home container p-5">
                <h3>looks</h3>
                <ul><iframe id='embedLook'
                    title="Inline Frame Example"
                    width="500"
                    height="500"
                    src={this.state.embed_url}>
                </iframe>
                </ul>
            </div >
        )
    }
}

export default Home;

