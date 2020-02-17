import React from 'react';

function Modal({ title, performApiCall }) {
    return (

        <div className="modal block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <div className="text-center" />
                        <h5 className="modal-title">{title}</h5>

                        <button
                            type="button"
                            className="close"
                            data-dismiss="modal"
                            aria-label="Close"
                            onClick={() => this.props.toggleModal()}
                        >
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>

                    <div className="modal-body">

                        <ModalForm objForModal={{ contentType: 'dashboard' }} performApiCall={performApiCall} />

                    </div>
                    <div className="modal-footer"></div>

                    <button
                        type="button"
                        className="btn btn-primary ml-auto"
                    // onClick={() => updateAction({ objForModal })}
                    >
                        Save changes
              </button>
                </div>
            </div>
        </div>
    )
}

class ModalForm extends React.Component {
    constructor() {
        super();
        this.state = {
            contentTypeValue: '',
            contentIdValue: '',
            tabTitleValue: ''
        }
    }

    componentDidMount() {
        this.setState({
            contentTypeValue: this.props.objForModal.contentType ? this.props.objForModal.contentType : '',
            contentIdValue: this.props.objForModal.contentId ? this.props.objForModal.contentId : '',
            tabTitleValue: this.props.objForModal.tabTitle ? this.props.objForModal.tabTitle : '',
        }, () => {
            console.log('componentDidMount callback this.state.contentTypeValue', this.state.contentTypeValue)
            console.log('componentDidMount callback this.state.contentIdValue', this.state.contentIdValue)
            console.log('tabTitleValue callback this.state.tabTitleValue', this.state.tabTitleValue)
        })
    }

    render() {
        return (
            <form id="contentForm" className="text-left">
                <div className="form-group">
                    <div>
                        <label htmlFor="modalForm">Content Type</label>
                        <select
                            className="form-control"
                            onChange={e => {
                                this.setState({
                                    contentTypeValue: e.target.value
                                }, () => {
                                    console.log('onChange callback this.state.contentTypeValue', this.state.contentTypeValue)

                                });
                                // this.props.handleFormChange(e); //not changed by state
                            }}
                            type="select-one"
                            value={this.state.contentTypeValue}
                            data-key="contentTypeValue"
                        >
                            <option
                                key="dashboard"
                                value="dashboard"
                            >
                                Dashboard
                            </option>
                            {/* not seeing this in api so commenting out for now */}
                            {/* <option
                                key="explore"
                                value="explore"
                            >
                                Explore
                            </option> */}
                            <option
                                key="look"
                                value="look"
                            >
                                Look
                            </option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="modalForm">Content Id</label>
                        <input
                            type="text"
                            className="form-control"
                            id="contentId"
                            value={this.state.contentIdValue}
                        // onChange={this.props.handleFormChange}
                        // data-key={key}
                        />
                    </div>
                    <div>
                        <label htmlFor="modalForm">Tab Title</label>
                        <input
                            type="text"
                            className="form-control"
                            id="contentId"
                            value={this.state.tabTitleValue}
                        // onChange={this.props.handleFormChange}
                        // data-key={key}
                        />
                    </div>
                </div>
            </form>)
    }
}


export default Modal;