import React from 'react';
const HomeContent: React.FC<{ userEmail?: string; lastName?: string }> = ({ userEmail, lastName }) => {
    const displayName = lastName || userEmail;
  
    return (
      <div>
        <h1 className="text-3xl font-bold">Home</h1>
        <p>Welcome, {displayName}</p>
        <h2 className="text-1xl font-bold mt-5 mb-5">Cool Feature Coming Up, Wait up</h2>
      </div>
    );
  };

  export default HomeContent;