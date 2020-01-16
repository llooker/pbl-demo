import React from 'react';
import Sidebar from './Sidebar'
import { Link } from 'react-router-dom'

class Customizations extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            customizations: []
        }
        this.deleteCustomization = this.deleteCustomization.bind(this);
    }


    componentDidMount() {
        console.log('Customize componentDidMount')
        console.log('this.props', this.props)
        // this.retrieveCustomizations()
    }


    deleteCustomization(customizationId) {
        // console.log('deleteCustomization')
        // console.log('customizationId', customizationId)
        this.props.deleteCustomization(customizationId)
        this.props.history.push('/home') //here
    }

    render() {
        const { customizations } = this.props
        return (
            <div className="home container p-5" >
                <div className="row pt-3">
                    {/* <Sidebar /> */}
                    <div className="col-sm-12">
                        <h1>Customizations</h1>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">Name</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customizations.map((customization, index) => {
                                    return (
                                        <tr key={customization.id}>
                                            <td>{customization.companyname}</td>
                                            {
                                                customization.id === "defaultCustomization" ? <td>Not available</td> :
                                                    <td>
                                                        <button type="button" className="btn btn-secondary mr-2">Edit</button>
                                                        <button type="button" className="btn btn-danger" onClick={() => this.deleteCustomization(customization.id)} >Delete</button>
                                                    </td>
                                            }
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                        <Link to='/customize/new'>
                            <button type="button" className="btn btn-primary">New Customization</button>
                        </Link>
                    </div>
                </div >
            </div >
        )
    }
}
export default Customizations