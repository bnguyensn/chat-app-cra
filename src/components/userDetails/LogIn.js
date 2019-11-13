import React from 'react';
import { connect } from 'react-redux';
import Button from '../layout/Button';
import authActions from '../../store/auth/actions';

function LogIn({
  tokens,
  isFetchingTokens,
  user,
  isFetchingUser,
  status,
  requestTokens,
  requestUserDetails,
}) {
  const handleLogIn = () => {
    if (!isFetchingTokens && !isFetchingUser) {
      requestTokens();
    }
  };

  return (
    <div>
      <Button
        disabled={isFetchingTokens || isFetchingUser}
        onClick={handleLogIn}
      >
        Log in with GitHub
      </Button>
      <div>Log in status</div>
      <div>{status}</div>
    </div>
  );
}

const mapStateToProps = state => ({
  tokens: state.auth.tokens,
  isFetchingTokens: state.auth.isFetchingTokens,
  user: state.auth.user,
  isFetchingUser: state.auth.isFetchingUser,
  status: state.auth.status,
});

const mapDispatchToProps = {
  requestTokens: authActions.REQUEST_TOKENS,
  requestUserDetails: authActions.REQUEST_USER,
};

export default connect(mapStateToProps, mapDispatchToProps)(LogIn);
