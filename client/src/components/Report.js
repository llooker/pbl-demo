import React from 'react';
import Navigation from './Navigation'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'; // ES6

class Report extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            folder_contents: {},
            codeBarIsVisible: false
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

    toggleCodeBar = () => {
        console.log('toggleCodeBar')
        this.setState(prevState => ({
            codeBarIsVisible: prevState.codeBarIsVisible ? false : true
        }), () => {
            console.log('toggleCodeBar callback this.state.codeBarIsVisible', this.state.codeBarIsVisible)
        })
    }

    render() {
        // console.log('this.props', this.props)
        const { pathname } = this.props.location
        const { folder_contents } = this.state
        const { codeBarIsVisible } = this.state
        return (
            < div className="home container p-5" >
                <Navigation pathname={pathname} toggleCodeBar={this.toggleCodeBar} />
                <div className="row pt-5">
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
                    <div className="col-sm-2">
                        <ReactCSSTransitionGroup
                            transitionName="slide"
                            transitionAppear={true}
                            transitionAppearTimeout={500}
                            transitionEnterTimeout={500}
                            transitionLeaveTimeout={500}>
                            {codeBarIsVisible ? <p>For example, <code>&lt;section&gt;</code> should be wrapped as inline.</p>
                                : ''}
                        </ReactCSSTransitionGroup>
                    </div>
                </div >
            </div >
        )
    }
}
export default Report