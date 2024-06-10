import React from 'react';

const Welcome: React.FC = () => {
  return (
    <section className="bg-cover bg-center h-screen" style={{backgroundImage: "url('/img/bg-shoes.jpg')"}}>
      <div className="flex flex-col items-center justify-center h-full text-white">
        <h1 className="text-5xl font-bold mb-4 p-4">Engaato Online</h1>
        <p className="text-lg mb-8 p-4">Step into Style, Comfort, and Confidence.</p>
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">
          Shop Now
          <svg
            className="h-5 w-5 ml-2 inline-block"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            ></path>
          </svg>
        </button>
      </div>
    </section>
  );
};

export default Welcome;
