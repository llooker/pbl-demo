import React from 'react';
import { Link } from 'react-router-dom'

class NewCustomization extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        const { indexOfCustomizationToEdit } = this.props
        const { customizations } = this.props
        this.state = {
            companyName: indexOfCustomizationToEdit ? customizations[indexOfCustomizationToEdit].companyName : '',
            logoUrl: indexOfCustomizationToEdit ? customizations[indexOfCustomizationToEdit].logoUrl : ''
        }
    }


    componentDidMount() {
        // console.log('NewCustomization componentDidMount')
        // console.log('this.props', this.props)
    }

    componentWillUnmount() {
        console.log('NewCustomization componentWillUnmount')
        this.props.cancelIndexOfCustomizationToEdit()
    }

    handleSubmit(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        let objForBody = {}
        for (var [key, value] of data.entries()) {
            objForBody[key] = value
        }
        this.props.saveCustomization(objForBody)
        this.props.history.push('/home')
    }

    updateInput(e) {
        console.log('updateInput');
        console.log('e.target.id', e.target.id)
        console.log('e.target.value', e.target.value)
        this.setState({
            [e.target.id]: e.target.value
        }, () => {
            // console.log('this.state[e.target.id]', this.state[e.target.id])
        });
    }

    render() {
        const { indexOfCustomizationToEdit } = this.props
        const { customizations } = this.props
        return (
            <div className="home container p-5" >
                <div className="row pt-5">
                    <div className="col-sm-9">
                        <h1>Customizations</h1>
                        <form onSubmit={this.handleSubmit}>
                            <input type="hidden" id="id" name="id" value={indexOfCustomizationToEdit ? customizations[indexOfCustomizationToEdit].id : ''} />
                            <input type="hidden" id="customizationIndex" name="customizationIndex" value={indexOfCustomizationToEdit ? indexOfCustomizationToEdit : ''} />
                            <div className="form-group">
                                <label htmlFor="companyName">Company name</label>
                                <input id="companyName" className="form-control" name="companyName" type="text" value={this.state.companyName} onChange={e => this.updateInput(e)} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="logoUrl">Logo url</label>
                                <input id="logoUrl" className="form-control" name="logoUrl" type="text" value={this.state.logoUrl} onChange={e => this.updateInput(e)} />
                            </div>
                            <button className="btn btn-primary mr-2">Save customization</button>
                            <Link to='/customize'>
                                <button type="button" className="btn btn-secondary">Cancel</button>
                            </Link>
                        </form>
                    </div>
                </div >
            </div >
        )
    }
}
export default NewCustomization