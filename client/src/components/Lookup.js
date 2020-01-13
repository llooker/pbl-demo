import React from 'react';
import Sidebar from './Sidebar'

class Lookup extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        console.log('this.props', this.props)
        const { pathname } = this.props.location
        return (
            <div className="home container p-5">
                <div className="row pt-3">
                    <Sidebar pathname={pathname} />
                    <div className="col-sm-9">
                        <h1>Lookup</h1>
                    </div>
                </div >
            </div >
        )
    }
}
export default Lookup