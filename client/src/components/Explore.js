import React from 'react';
import Sidebar from './Sidebar'

class Explore extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            embed_url: ''
        }
    }

    componentDidMount() {
        this.buildLookerUrl();
    }

    async buildLookerUrl() {
        let lookerResposnse = await fetch('/buildlookerexploreurl/explore/thelook_adwords/events/qid=BIn3Feb2BUN0UGTzJ2cGyO&origin_space=1097&toggle=vis', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })

        let lookerResposnseData = await lookerResposnse.json();
        this.setState({
            embed_url: lookerResposnseData.embed_url
        }, () => {
            // console.log('this.state.embed_url')
            // console.log(this.state.embed_url)
        });

    }
    render() {
        const { pathname } = this.props.location
        return (
            <div className="home container p-5">
                <div className="row pt-3">
                    <Sidebar pathname={pathname} />
                    <div className="col-sm-10">
                        <ul><iframe id='embedLook'
                            title="Inline Frame Example"
                            width="850"
                            height="750"
                            src={this.state.embed_url}>
                        </iframe>
                        </ul>
                    </div>
                </div >
            </div >
        )
    }
}
export default Explore