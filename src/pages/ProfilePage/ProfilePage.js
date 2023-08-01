import React from 'react';
import Header from '../../components/Header/Header'
import Profile from '../../components/Profile/Profile'

function ProfilePage({ onUpdate, onProfileEditStateChanged, editSubmitTitle, logOut, isLoading, loggedIn, profileIsEditing }) {
  return (
    <>
      <Header loggedIn={loggedIn} />
      <Profile
        onUpdate={onUpdate}
        onProfileEditStateChanged={onProfileEditStateChanged}
        editSubmitTitle={editSubmitTitle}
        logOut={logOut}
        isLoading={isLoading}
        profileIsEditing={profileIsEditing} />
    </>
  );
}

export default ProfilePage;
