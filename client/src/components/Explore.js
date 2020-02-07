import React from 'react';
import Sidebar from './Sidebar'

import { LookerEmbedSDK, LookerEmbedDashboard } from '@looker/embed-sdk'


class Explore extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            embed_url: '',
            explore: ''
        }
    }

    componentDidMount() {
        this.embedSdkInit()
    }

    embedSdkInit() {
        LookerEmbedSDK.createExploreWithId('thelook_adwords::events')
            .appendTo('#embedContainer')
            .withClassName('iframe')
            .build()
            .connect()
            .then(this.setupExplore)
            .catch((error) => {
                console.error('Connection error', error)
            })
    }

    setupExplore = (explore) => {
        console.log('setupExplore')
        console.log('explore', explore)

        //save dashboard to state
        //to make available across functions
        this.setState({
            explore: explore
        }, () => {
            // console.log('setupDashboard callback')
            // console.log('this.state.dashboard', this.state.dashboard)
        })

    }

    render() {
        const { pathname } = this.props.location
        return (
            <div className="home container p-5">
                <div className="row pt-3">
                    <Sidebar pathname={pathname} />
                    <div className="col-sm-10">
                        <div id="embedContainer" className="mt-3 pt-3 border-top">
                        </div>
                    </div>
                </div >
            </div >
        )
    }
}
export default Explore