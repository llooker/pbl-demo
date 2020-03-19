import React from 'react';
import { Link } from 'react-router-dom'
import Moment from 'moment'

class Customizations extends React.Component {
    constructor(props) {
        super(props);
        this.editCustomization = this.editCustomization.bind(this);
        this.applyCustomization = this.applyCustomization.bind(this);
        this.state = {
            customizations: this.props.customizations,
            isOrdered: null
        }
    }

    componentDidMount() {
        // console.log('Customize componentDidMount')
        // console.log('this.props', this.props)
    }

    editCustomization(customizationIndex) {
        this.props.editCustomization(customizationIndex)
        this.props.history.push('/customize/edit')
    }

    applyCustomization(customizationIndex) {
        this.props.applyCustomization(customizationIndex)
        this.props.history.push('/home') //customize
    }

    sortByCreatedDate() {
        let { isOrdered } = this.state
        let sortedCustomizations;
        if (isOrdered === null || isOrdered === "DESC") {
            sortedCustomizations = this.state.customizations.sort((a, b) => (a.date > b.date) ? 1 : -1)
            this.setState({
                isOrdered: "ASC"
            })
        } else if (isOrdered === "ASC") {
            sortedCustomizations = this.state.customizations.sort((a, b) => (a.date > b.date) ? -1 : 1)
            this.setState({
                isOrdered: "DESC"
            })

        }
        this.setState({
            customizations: sortedCustomizations
        })
    }

    render() {
        const { activeCustomization } = this.props
        const { customizations } = this.state
        const { isOrdered } = this.state
        return (
            <div className="home container p-5 position-relative">
                <div className="row pt-5">
                    <div className="col-sm-12">
                        <h1>Customizations</h1>
                        <table className="table pt-3 mt-3">
                            <thead>
                                <tr>
                                    <th scope="col">Name</th>
                                    <th scope="col" className="cursor" onClick={() => this.sortByCreatedDate()}><a>Last Saved {isOrdered === null ? '' : isOrdered === "ASC" ? '∧' : '∨'}</a></th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customizations.map((customization, index) => {
                                    return (
                                        <tr key={customization.id} id={customization.id} index={index} >
                                            <td >{customization.companyName}</td>
                                            <td >{Moment(customization.date).format('LLL')}</td>
                                            {
                                                customization.companyName === activeCustomization.companyName ?
                                                    <td><span className="badge badge-info p-3">Active</span></td>
                                                    : customization.id === "defaultCustomization" ?
                                                        <td>
                                                            <button type="button" className="btn btn-secondary mr-2" data-index={index} onClick={() => this.applyCustomization(index)}>Apply</button>
                                                        </td> :
                                                        <td>
                                                            <button type="button" className="btn btn-primary mr-2" data-index={index} onClick={() => this.applyCustomization(index)}>Apply</button>
                                                            <button type="button" className="btn btn-secondary mr-2" data-index={index} onClick={() => this.editCustomization(index)}>Edit</button>
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