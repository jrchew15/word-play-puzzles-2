import { useHistory } from 'react-router-dom';
import { Dispatch, MouseEventHandler, SetStateAction, useState } from 'react';
import { appUseSelector, totalState } from '../store';
// import UserDropdown from './UserDropdown';
import { Modal } from '../context/Modal';
// import User from './User';

import './nav.css'

const NavBar = (props: { showUserDropdown: boolean, setShowUserDropdown: Dispatch<SetStateAction<boolean>>, showDeveloperDropdown: boolean, setShowDeveloperDropdown: Dispatch<SetStateAction<boolean>>, setTriggerReload: Dispatch<SetStateAction<boolean>> }) => {
  const currentUser = appUseSelector((state: totalState) => state.user);
  const history = useHistory()

  const [imageSrc, setImageSrc] = useState<string>('/static/images/icon_1-cropped.svg')
  const [showModal, setShowModal] = useState<boolean>(false)



  const userDropdownToggle: MouseEventHandler<HTMLElement> = (e) => {
    props.setShowUserDropdown(x => !x)
    props.setShowDeveloperDropdown(false)
  }
  const developerDropdownToggle: MouseEventHandler<HTMLElement> = (e) => {
    props.setShowDeveloperDropdown(x => !x)
    props.setShowUserDropdown(false)
  }
  const closeDropdowns = () => {
    props.setShowDeveloperDropdown(false)
    props.setShowUserDropdown(false)
  }


  return (<>
    <nav id='my-nav'>
      <div id='left-nav'>
        {currentUser?.id > 0 &&
          <div id='dropdown-selector' onClick={userDropdownToggle} >
            {(props.showUserDropdown) ? <i className="fas fa-times" /> : <i className="fas fa-bars" />}
          </div>}
        {/* {(props.showUserDropdown) && <UserDropdown showDropdown={props.showUserDropdown} setShowDropdown={props.setShowUserDropdown} setShowModal={setShowModal} closeDropdowns={closeDropdowns} setTriggerReload={props.setTriggerReload} />} */}
        <img src={imageSrc} alt='logo' className='logo'
          onMouseEnter={() => setImageSrc('/static/images/icon_2-cropped.svg')}
          onMouseLeave={() => setImageSrc('/static/images/icon_1-cropped.svg')}
          onClick={() => { history.push('/'); closeDropdowns() }}
        />
      </div>
      <div onClick={closeDropdowns} style={{ flexGrow: '1', height: '100%' }} />
      <div id='right-nav' onClick={developerDropdownToggle}>
        <span >About the Developer</span>
        {(props.showDeveloperDropdown) && <ul id='developer-dropdown' onClick={() => props.setShowDeveloperDropdown(false)}>
          <a href='https://github.com/jrchew15/word-play-puzzles/' target='_blank' rel='noreferrer'>
            Project Github
            <img src='/static/images/icon_square.svg' alt='project_github' />
          </a>
          <a href='https://github.com/jrchew15' target='_blank' rel='noreferrer'>
            Dev Github
            <img src='/static/images/GitHub-Mark-64px.png' alt='github' />
          </a>
          <a href='https://www.linkedin.com/in/jason-r-chew/' target='_blank' rel='noreferrer'>
            Dev LinkedIn
            <img src='https://cdn-icons-png.flaticon.com/512/49/49408.png' alt='linkedin' />
          </a>
        </ul>}
      </div>
    </nav>
    {
      showModal && currentUser && <Modal onClose={() => setShowModal(false)}>
        <div>Hello</div>
        {/* <User userId={currentUser.id} setShowModal={setShowModal} /> */}
      </Modal>
    }
  </>);
}

export default NavBar;
