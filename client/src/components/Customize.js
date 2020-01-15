import React from 'react';
import Sidebar from './Sidebar'

class Customize extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            customizations: []
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    componentDidMount() {
        console.log('Customize componentDidMount')
        console.log('this.props', this.props)
        this.retrieveCustomizations()
    }

    retrieveCustomizations = async () => {
        console.log('retrieveCustomizations')
        let customizationResponse = await fetch('/customize', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })
        // console.log('customizationResponse', customizationResponse)
        let customizationResponseData = await customizationResponse.json();
        // console.log('customizationResponseData', customizationResponseData)
        this.setState({
            customizations: customizationResponseData[0].customizations || customizationResponseData.customizations
        }, () => {
            console.log('callback')
            console.log('this.state.customizations', this.state.customizations)
            // this.props.additionalMethod(this.state.customizations[0])
        })
    }

    handleSubmit(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        let objForBody = {}
        for (var [key, value] of data.entries()) {
            objForBody[key] = value
        }

        fetch('/savecustomization', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(objForBody)
        }).then(response => {
            console.log('response', response)
        });
    }

    render() {
        const { customizations } = this.state
        // console.log('customizations', customizations)
        return (
            <div className="home container p-5" >
                <div className="row pt-3">
                    {/* <Sidebar /> */}
                    <div className="col-sm-9">
                        <h1>Customizations</h1>
                        <ul>

                            {customizations.map((customization, index) => {
                                return <li key={index}>{customization.companyname}</li>
                            })}
                        </ul>
                        <form onSubmit={this.handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="companyname">Company name</label>
                                <input id="companyname" className="form-control" name="companyname" type="text" />
                            </div>
                            <button className="btn btn-primary">Save customization!</button>
                        </form>
                    </div>
                </div >
            </div >
        )
    }
}
export default Customize