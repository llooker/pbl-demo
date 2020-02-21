import React from 'react';

function Modal({ title, toggleModal, objForModal, handleModalFormChange, updateAction }) {
    return (
        <>
            <div className="modal-backdrop fade show" onClick={() => toggleModal()}>
            </div>
            <div className="modal block" tabIndex="-1" role="dialog" data-backdrop="true">
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
                                onClick={() => toggleModal()}
                            >
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>

                        <div className="modal-body">

                            <ModalForm objForModal={objForModal} handleModalFormChange={handleModalFormChange} />

                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-primary ml-auto"
                                onClick={() => {
                                    toggleModal()
                                    updateAction(objForModal)
                                }}
                            >
                                Save changes
                        </button>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

class ModalForm extends React.Component {
    constructor() {
        super();
        this.state = {
            contentTypeValue: '',
        }
    }

    componentDidMount() {
        // console.log('ModalForm componentDidMount')
        this.setState({
            contentTypeValue: this.props.objForModal.contentType ? this.props.objForModal.contentType : ''
        })
    }

    render() {
        console.log('ModalForm render')
        return (
            <form id="contentForm" className="text-left">
                <div className="form-group">
                    <div className="pt-3">
                        <label htmlFor="modalForm">Content Type</label>
                        <select
                            className="form-control"
                            onChange={e => {
                                this.setState({
                                    contentTypeValue: e.target.value
                                }, () => {
                                    console.log('onChange callback this.state.contentTypeValue', this.state.contentTypeValue)

                                });
                                this.props.handleModalFormChange(e); //not changed by state
                            }}
                            type="select-one"
                            value={this.state.contentTypeValue}
                            data-key="type"
                        >
                            <option
                                key="dashboard"
                                value="dashboard"
                            >
                                Dashboard
                            </option>
                            <option
                                key="explore"
                                value="explore"
                            >
                                Explore
                            </option>
                            <option
                                key="folder"
                                value="folder"
                            >
                                Folder
                            </option>
                        </select>
                    </div>
                    <div className="pt-3">
                        <label htmlFor="modalForm">Content Id</label>
                        <input
                            type="text"
                            className="form-control"
                            id="contentId"
                            value={this.props.objForModal.id ? this.props.objForModal.id.value : ''}
                            onChange={this.props.handleModalFormChange}
                            data-key="id"
                        />
                    </div>
                    <div className="pt-3">
                        <label htmlFor="modalForm">Tab Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="tabName"
                            value={this.props.objForModal.name ? this.props.objForModal.name.value : ''}
                            placeholder='E.g. Home, Lookup, Report, Explore'
                            onChange={this.props.handleModalFormChange}
                            data-key="name"
                        />
                    </div>
                </div>
            </form>)
    }
}


export default Modal;