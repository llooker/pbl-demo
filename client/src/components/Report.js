import React from 'react';
import Sidebar from './Sidebar'

class Report extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            folder_contents: {}
        }
    }

    componentDidMount() {
        this.fetchFolderContents();
    }

    async fetchFolderContents() {
        let lookerResposnse = await fetch('/fetchfolder/1827', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })

        let lookerResposnseData = await lookerResposnse.json();
        this.setState({
            folder_contents: lookerResposnseData.folder
        }, () => {
            // console.log('callback this.state.folder_contents')
            // console.log(this.state.folder_contents)
        });

    }

    render() {
        // console.log('this.props', this.props)
        const { pathname } = this.props.location
        const { folder_contents } = this.state
        return (
            < div className="home container p-5" >
                <div className="row pt-3">
                    <Sidebar pathname={pathname} />
                    <div className="col-sm-10">
                        <h1>demo.looker > folder 1827</h1>
                        <h3>Dashboards</h3>
                        <ul>
                            {folder_contents.dashboards && folder_contents.dashboards.length ? folder_contents.dashboards.map((item, index) => {
                                return <li key={item.id}>{item.title}</li>
                            }) : <span>no dashboards :(</span>}
                        </ul>
                        <h3>Looks</h3>
                        <ul>
                            {folder_contents.looks && folder_contents.looks.length ? folder_contents.looks.map((item, index) => {
                                return <li key={item.id}>{item.title}</li>
                            }) : <span>no looks :(</span>}
                        </ul>
                    </div>
                </div >
            </div >
        )
    }
}
export default Report