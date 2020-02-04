import React from 'react';
import './Home.css';
import Sidebar from './Sidebar'

import { LookerEmbedSDK, LookerEmbedDashboard } from '@looker/embed-sdk'
console.log('000 LookerEmbedSDK')
console.log(LookerEmbedSDK)

LookerEmbedSDK.init('http://localhost:5000', '/auth')
// let myLookerEmbedSDK = new LookerEmbedSDK();
console.log('111 LookerEmbedSDK')
console.log(LookerEmbedSDK)

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            embed_url: ''
        }
    }

    componentDidMount() {
        this.buildLookerUrl();

        this.embedSdkInit()
    }


    embedSdkInit() {
        console.log('embedSdkInit')
        LookerEmbedSDK.createDashboardWithId(5277)
            .appendTo('#embedContainer')
            .withClassName('iframe')
            .on('dashboard:run:start', (e) => { console.log(e) })
            .withNext()
            .on('dashboard:loaded', (e) => { console.log(e) })
            .on('dashboard:loaded', this.setupDashboarddd)
            // .on('dashboard:loaded', setupDashboarddd)
            .build()
            .connect()
            .then((d) => { console.log(d) })
            .catch((error) => {
                console.error('Connection error', error)
            })
    }


    setupDashboard = (dashboard) => {
        console.log('setupDashboard')
        console.log('dashboard', dashboard)
        // setDashboard(dashboard)

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
                    <div id="embedContainer" className="col-sm-10">

                    </div>
                    {/* <div className="col-sm-10">
                        <ul><iframe id='embedLook'
                            title="Inline Frame Example"
                            width="850"
                            height="750"
                            src={this.state.embed_url}>
                        </iframe>
                        </ul>
                    </div> */}
                </div >
            </div >
        )
    }
}

export default Home;

