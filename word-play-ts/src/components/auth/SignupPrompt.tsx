import { useHistory, Redirect } from "react-router-dom"
import { appUseSelector, totalState } from "../../store";
import { user } from "../../classes/userTypes";

export default function SignUpPrompt() {
    const history = useHistory();
    const currentUser: user = appUseSelector((state: totalState) => state.user)

    return (currentUser ? <Redirect to='/badroute' /> : <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2>Content not available</h2>
        <div>Sorry, most content is unavailable to users without an account.</div>
        <button className="modal-button" onClick={() => history.push('/sign-up')}>Sign Up</button>
    </div>)
}
