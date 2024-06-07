import React from 'react';
import { MdiFacebook, MdiTwitter, MdiInstagram } from '@mdi/react';
import { mdiFacebook, mdiTwitter, mdiInstagram } from '@mdi/js';
import { MdiShoePrint, MdiBookOpen, MdiInformationOutline, MdiHeartOutline } from '@mdi/react';
import { mdiShoePrint, mdiBookOpen, mdiInformationOutline, mdiHeartOutline } from '@mdi/js';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Social Icons */}
          <div className="flex items-center">
            <a href="#" className="mr-4"><MdiFacebook path={mdiFacebook} /></a>
            <a href="#" className="mr-4"><MdiTwitter path={mdiTwitter} /></a>
            <a href="#"><MdiInstagram path={mdiInstagram} /></a>
          </div>
          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Categories</h4>
            <ul className="list-none">
              <li><a href="#" className="hover:underline"><MdiShoePrint path={mdiShoePrint} /> Men's Shoes</a></li>
              <li><a href="#" className="hover:underline"><MdiShoePrint path={mdiShoePrint} /> Women's Shoes</a></li>
              <li><a href="#" className="hover:underline"><MdiShoePrint path={mdiShoePrint} /> Kids</a></li>
            </ul>
          </div>
          {/* Topics */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Topics</h4>
            <ul className="list-none">
              <li><a href="#" className="hover:underline"><MdiInformationOutline path={mdiInformationOutline} /> Sneaker Care Tips</a></li>
              <li><a href="#" className="hover:underline"><MdiInformationOutline path={mdiInformationOutline} /> Latest Sneaker Trends</a></li>
              <li><a href="#" className="hover:underline"><MdiInformationOutline path={mdiInformationOutline} /> Release and Events</a></li>
            </ul>
          </div>
          {/* Culture */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Culture</h4>
            <ul className="list-none">
              <li><a href="#" className="hover:underline"><MdiHeartOutline path={mdiHeartOutline} /> Sneaker Customization</a></li>
              <li><a href="#" className="hover:underline"><MdiBookOpen path={mdiBookOpen} /> History of Iconic Brands</a></li>
              <li><a href="#" className="hover:underline"><MdiBookOpen path={mdiBookOpen} /> Influence of Sneakers</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
