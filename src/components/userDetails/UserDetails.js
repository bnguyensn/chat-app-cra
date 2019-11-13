import React from 'react';
import { connect } from 'react-redux';
import LogIn from './LogIn';

function UserDetails({ login, name, avatarUrl, githubUrl }) {
  // We assume that if the 'login' property doesn't exist, then the user is not
  // logged in.
  const isLoggedIn = !!login;

  if (!isLoggedIn) {
    return <LogIn />;
  }

  return (
    <div>
      <div>
        <a href={githubUrl}>
          <img src={avatarUrl} alt="User avatar" />
        </a>
      </div>
      <h2>{name}</h2>
    </div>
  );
}

const mapStateToProps = state => ({
  login: state.auth.user.login,
  name: state.auth.user.name,
  avatarUrl: state.auth.user.avatar_url,
  githubUrl: state.auth.user.html_url,
});

export default connect(mapStateToProps)(UserDetails);
