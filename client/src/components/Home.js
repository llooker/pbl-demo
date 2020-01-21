import React from 'react';
import './Home.css';
import Sidebar from './Sidebar'

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
            console.log('this.state.embed_url')
            console.log(this.state.embed_url)
        });
    }

    render() {
        const { pathname } = this.props.location
        return (
            <div className="home container p-5">
                <div className="row pt-3">
                    <Sidebar pathname={pathname} />
                    <div className="col-sm-9">
                        {/* <h1>Home</h1> */}
                        <ul><iframe id='embedLook'
                            title="Inline Frame Example"
                            width="750"
                            height="750"
                            src={this.state.embed_url}>
                        </iframe>
                        </ul>
                    </div>
                </div >
            </div >
        )
    }
}

export default Home;

