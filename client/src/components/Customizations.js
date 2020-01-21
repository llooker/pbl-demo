import React from 'react';
import Sidebar from './Sidebar'
import { Link } from 'react-router-dom'

class Customizations extends React.Component {
    constructor(props) {
        super(props);
        this.deleteCustomization = this.deleteCustomization.bind(this);
        this.editCustomization = this.editCustomization.bind(this);
        this.applyCustomization = this.applyCustomization.bind(this);
    }


    componentDidMount() {
        console.log('Customize componentDidMount')
        console.log('this.props', this.props)
        // this.retrieveCustomizations()
    }


    deleteCustomization(customizationIndex) {
        console.log('deleteCustomization')
        console.log('customizationIndex', customizationIndex)
        this.props.deleteCustomization(customizationIndex)
        this.props.history.push('/home')
    }


    editCustomization(customizationIndex) {
        console.log('editCustomization')
        console.log('customizationIndex', customizationIndex)
        this.props.editCustomization(customizationIndex)
        this.props.history.push('/customize/edit')
    }

    applyCustomization(customizationIndex) {
        console.log('applyCustomization')
        console.log('customizationIndex', customizationIndex)
        this.props.applyCustomization(customizationIndex)
        this.props.history.push('/customize')
    }

    render() {
        const { customizations } = this.props
        const { activeCustomization } = this.props
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
                                        <tr key={customization.id} index={index} >
                                            <td >{customization.companyname}</td>
                                            {
                                                customization.companyname == activeCustomization.companyname ?
                                                    <td><span className="badge badge-info">Active</span></td>
                                                    : customization.id === "defaultCustomization" ?
                                                        <td>
                                                            <button type="button" className="btn btn-secondary mr-2" data-index={index} onClick={() => this.applyCustomization(index)}>Apply</button>
                                                        </td> :
                                                        <td>
                                                            <button type="button" className="btn btn-secondary mr-2" data-index={index} onClick={() => this.applyCustomization(index)}>Apply</button>
                                                            <button type="button" className="btn btn-secondary mr-2" data-index={index} onClick={() => this.editCustomization(index)}>Edit</button>
                                                            <button type="button" className="btn btn-danger" data-index={index} onClick={() => this.deleteCustomization(index)} >Delete</button>
                                                        </td>
                                            }
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                        <Link to='/customize/edit'>
                            <button type="button" className="btn btn-primary">New Customization</button>
                        </Link>
                    </div>
                </div >
            </div >
        )
    }
}
export default Customizations