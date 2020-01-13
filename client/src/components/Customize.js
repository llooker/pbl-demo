import React from 'react';
import Sidebar from './Sidebar'

class Customize extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="home container p-5">
                <div class="row pt-3">
                    <Sidebar />
                    <div class="col-sm-9">
                        <h1>Customize</h1>
                    </div>
                </div >
            </div >
        )
    }
}
export default Customize