import React from 'react';
import Sidebar from './Sidebar'
import { Link } from 'react-router-dom'

class NewCustomization extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    componentDidMount() {
        console.log('NewCustomization componentDidMount')
        console.log('this.props', this.props)
        // this.retrieveCustomizations()
    }

    handleSubmit(event) {
        console.log('handleSubmit')
        event.preventDefault();
        const data = new FormData(event.target);
        let objForBody = {}
        for (var [key, value] of data.entries()) {
            objForBody[key] = value
        }
        console.log('objForBody', objForBody)
        this.props.saveCustomization(objForBody)
        this.props.history.push('/home') //here
    }

    render() {
        const { customizations } = this.props
        return (
            <div className="home container p-5" >
                <div className="row pt-3">
                    {/* <Sidebar /> */}
                    <div className="col-sm-9">
                        <h1>Customizations</h1>
                        <form onSubmit={this.handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="companyname">Company name</label>
                                <input id="companyname" className="form-control" name="companyname" type="text" />
                            </div>
                            <button className="btn btn-primary">Save customization</button>
                        </form>
                    </div>
                </div >
            </div >
        )
    }
}
export default NewCustomization