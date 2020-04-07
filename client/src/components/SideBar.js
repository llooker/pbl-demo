import React from 'react';
import DemoComponents from '../demoComponents.json';

class SideBar extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        console.log('SideBar componentDidMount')
    }


    render() {
        const { toggleSideBar } = this.props
        return (
            <div className="col-sm-3">

                <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                    onClick={() => toggleSideBar()}
                >
                    <span aria-hidden="true">&times;</span>
                </button>

                <div className="p-3">
                    <h3>Demo Components</h3>
                    {/* <ul className="nav flex-column">
                        <li class="nav-item">
                            <a class="nav-link" href="#">Link</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Link</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link disabled" href="#">Disabled</a>
                        </li>
                    </ul> */}

                    <div class="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                        {/* {
                            DemoComponents.map((item, index) => {
                                return (
                                    <li key={item.type} class="nav-item">
                                        <a class="nav-link active" href="#">Active</a>
                                    </li>)
                            })
                        } */}
                        <a class="nav-link active" id="v-pills-home-tab" data-toggle="pill" href="#v-pills-home" role="tab" aria-controls="v-pills-home" aria-selected="true">Home</a>
                        <a class="nav-link" id="v-pills-profile-tab" data-toggle="pill" href="#v-pills-profile" role="tab" aria-controls="v-pills-profile" aria-selected="false">Profile</a>
                        <a class="nav-link" id="v-pills-messages-tab" data-toggle="pill" href="#v-pills-messages" role="tab" aria-controls="v-pills-messages" aria-selected="false">Messages</a>
                        <a class="nav-link" id="v-pills-settings-tab" data-toggle="pill" href="#v-pills-settings" role="tab" aria-controls="v-pills-settings" aria-selected="false">Settings</a>
                    </div>
                    <ul>
                    </ul>
                </div>

            </div>
        )
    }
}



export default SideBar;