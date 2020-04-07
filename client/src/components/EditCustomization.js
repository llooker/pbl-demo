import React from 'react';
import { Link } from 'react-router-dom'
import DefaultLookerContent from '../lookerIndustriesByInstance.json';

let emptyCustomizationObj = {
    id: '',
    date: '',
    salesforceUrl: '',
    companyName: '',
    logoUrl: ''
}

function prettifyKey(key) {
    switch (key) {
        case 'salesforceUrl':
            return 'Salesforce Url';
            break;
        case 'companyName':
            return 'Company Name';
            break;
        case 'logoUrl':
            return 'Logo Url';
            break;
        default:
            return null;
            break;
    }
}

class NewCustomization extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        const { indexOfCustomizationToEdit, customizations } = this.props
        this.state = {
            companyName: indexOfCustomizationToEdit ? customizations[indexOfCustomizationToEdit].companyName : '',
            logoUrl: indexOfCustomizationToEdit ? customizations[indexOfCustomizationToEdit].logoUrl : '',
            salesforceUrl: indexOfCustomizationToEdit ? customizations[indexOfCustomizationToEdit].salesforceUrl : '',
            validSalesforceUrl: indexOfCustomizationToEdit ? this.validateSalesforceUrl(customizations[indexOfCustomizationToEdit].salesforceUrl) : false,
            industry: indexOfCustomizationToEdit ? customizations[indexOfCustomizationToEdit].industry : '',
        }
    }

    componentDidMount() {
        this.salesforceUrlInput.focus();
    }

    componentWillUnmount() {
        // console.log('NewCustomization componentWillUnmount')
        this.props.cancelIndexOfCustomizationToEdit()
    }

    handleSubmit(event) {
        // console.log('handleSubmit')
        event.preventDefault();
        const data = new FormData(event.target);
        let objForBody = {}
        for (var [key, value] of data.entries()) {
            objForBody[key] = value
        }
        this.props.saveCustomization(objForBody)
        setTimeout(() => {
            this.props.history.push('/home') //causes error w/ out time out
        }, 100)
    }

    updateInput(e) {
        this.setState({
            [e.target.id]: e.target.value
        });

        if (e.target.id === "salesforceUrl") {
            this.setState({ validSalesforceUrl: this.validateSalesforceUrl(e.target.value) })
        }
    }

    validateSalesforceUrl = (url) => {
        let urlexp = new RegExp('^https:\/\/looker.my.salesforce.com(?:$|/)');
        let res = url.match(urlexp)
        let returnVal = false;
        if (res !== null) {
            returnVal = true;
        }
        return returnVal
    }


    dropdownSelect = (e) => {
        const targetId = e.target.id
        this.setState({
            [targetId]: e.target.value
        })
    }

    render() {
        // console.log('EditCustomization render');
        const { indexOfCustomizationToEdit, customizations, lookerHost } = this.props
        const { validSalesforceUrl, industry } = this.state
        // let lookerHostNameToUse = lookerHost.substr(0, lookerHost.indexOf('.'));
        // console.log('lookerHost', lookerHost)


        return (
            <div className="home container p-5" >
                <div className="row pt-5">
                    <div className="col-sm-9">
                        <h1>Edit Customization</h1>
                        <form className="border-top mt-3 pt-3" onSubmit={this.handleSubmit}>
                            <input type="hidden" id="id" name="id" value={indexOfCustomizationToEdit ? customizations[indexOfCustomizationToEdit].id : ''} />
                            <input type="hidden" id="customizationIndex" name="customizationIndex" value={indexOfCustomizationToEdit ? indexOfCustomizationToEdit : ''} />
                            <div className="form-group">
                                <label htmlFor="salesforceUrl">Salesforce Url</label>
                                <input id="salesforceUrl"
                                    className="form-control"
                                    name="salesforceUrl"
                                    type="text"
                                    value={this.state.salesforceUrl}
                                    onChange={e => this.updateInput(e)}
                                    ref={input => {
                                        this.salesforceUrlInput = input;
                                    }} />
                                {validSalesforceUrl ?
                                    <small id="salesforceUrlHelp" className="form-text text-success">Valid Salesforce Url!</small>
                                    : this.state.salesforceUrl.length ?
                                        <small id="salesforceUrlHelp" className="form-text text-danger">Must be valid Looker Salesforce Opportunity Url</small>
                                        : <small id="salesforceUrlHelp" className="form-text text-muted">This field is required</small>}
                            </div>
                            <div id="subForm">
                                {/* {DefaultLookerContent[lookerHost] ?
                                    <div className="form-group">
                                        <label htmlFor="industry">Choose industry</label>
                                        <select
                                            id="industry"
                                            className="form-control"
                                            onChange={(e) => this.dropdownSelect(e)}
                                            name="industry"
                                            type="select-one"
                                            value={this.state.industry}
                                            disabled={validSalesforceUrl ? false : true}>

                                            <option
                                                key="none"
                                                value="none"
                                            > None</option>
                                            {Object.keys(DefaultLookerContent[lookerHost]).map(key => {
                                                return (
                                                    <option
                                                        key={key}
                                                        value={key}
                                                    > {(key.charAt(0).toUpperCase() + key.substring(1)).replace('_', ' ')}</option>
                                                )
                                            })}</select>
                                    </div>
                                    : ''} */}
                                <div className="form-group">
                                    <label htmlFor="companyName">Company name</label>
                                    <input id="companyName"
                                        className="form-control"
                                        name="companyName"
                                        type="text"
                                        value={this.state.companyName}
                                        onChange={e => this.updateInput(e)}
                                        disabled={validSalesforceUrl ? false : true}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="logoUrl">Logo URL</label>
                                    <input id="logoUrl"
                                        className="form-control"
                                        name="logoUrl"
                                        type="text"
                                        value={this.state.logoUrl}
                                        onChange={e => this.updateInput(e)}
                                        disabled={validSalesforceUrl ? false : true}
                                    />
                                </div>
                                <div className="form-group mt-3 pt-3">
                                    <button className="btn btn-primary mr-2"
                                        disabled={validSalesforceUrl ? false : true}>Save Customization</button>
                                    <Link to='/customize'>
                                        <button type="button" className="btn btn-secondary ">Cancel</button>
                                    </Link>
                                </div></div>
                        </form>

                    </div>
                </div >
            </div >
        )
    }
}
export default NewCustomization