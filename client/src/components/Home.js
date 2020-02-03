import React from 'react';
import './Home.css';
import Sidebar from './Sidebar'

// import { LookerEmbedSDK, LookerEmbedDashboard } from '../embed-sdk-src/index.ts'
import { LookerEmbedSDK, LookerEmbedDashboard } from '../../node_modules/@looker/embed-sdk/src/index'
console.log('LookerEmbedSDK', LookerEmbedSDK)
console.log('LookerEmbedDashboard', LookerEmbedDashboard)


class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            embed_url: ''
        }
    }

    componentDidMount() {
        this.buildLookerUrl();
    }

    async buildLookerUrl() {
        let lookerResposnse = await fetch('/buildlookerdashboardurl/dashboards/5277', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })

        let lookerResposnseData = await lookerResposnse.json();
        this.setState({
            embed_url: lookerResposnseData.embed_url
        }, () => {
            // console.log('this.state.embed_url')
            // console.log(this.state.embed_url)
        });

    }

    render() {
        const { pathname } = this.props.location
        return (
            <div className="home container p-5">
                <div className="row pt-3">
                    <Sidebar pathname={pathname} />
                    <div className="col-sm-10">
                        <ul><iframe id='embedLook'
                            title="Inline Frame Example"
                            width="850"
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

