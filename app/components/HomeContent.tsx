import React from 'react';
import TabsRender from '../components/Dashboard/OrderTab';

const HomeContent: React.FC<{ userEmail?: string; lastName?: string }> = ({ userEmail, lastName }) => {
  const displayName = lastName || userEmail;

  const currentHour = new Date().getHours();

  const getGreeting = (): string => {
    if (currentHour < 12) return 'Good morning';
    if (currentHour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div>
      <h1 className="text-3xl font-bold">{getGreeting()}</h1>
      <p>Hi 👋🏽, {displayName}</p>
      <h2 className="text-2xl mt-5 mb-5">Orders</h2>
      <TabsRender />
    </div>
  );
};

export default HomeContent;
