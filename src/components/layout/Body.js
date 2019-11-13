import React from 'react';
import UserDetails from '../userDetails/UserDetails';
import ChatWindow from '../chatWindow/ChatWindow';

export default function Body() {
  return (
    <div>
      <UserDetails />
      <ChatWindow />
    </div>
  );
}
