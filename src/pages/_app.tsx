import React , { useState } from 'react';
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { AlephiumWalletProvider } from '@alephium/web3-react'
import { GoldTokenConfig } from '@/services/utils'
import { AlephiumConnectButtonCustom } from '@alephium/web3-react';
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiscord, faTelegram, faTwitter } from '@fortawesome/free-brands-svg-icons';




interface DropdownProps {
  title: string; // Specify the type for the title prop
  children: React.ReactNode;
}
// Use DropdownProps interface as the type for props
const Dropdown: React.FC<DropdownProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  return (
    <div className="dropdown" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <span className="dropdown-title" onClick={toggleDropdown}>{title}</span>
      {isOpen && <div className="dropdown-menu">{children}</div>}
    </div>
  );
};


export default function App({ Component, pageProps }: AppProps) {
  return (
    
    <AlephiumWalletProvider
      theme="retro"
      network={GoldTokenConfig.network}
      addressGroup={GoldTokenConfig.groupIndex}
    >
        <nav>
        {/* Navigation links here */}
        <Link href="/">Home</Link>
        <Link href="/mycollection">My Collection</Link>
        <Link href="/fealty">
          <Dropdown title="Fealty">
                <Link href="/fealty/underlords">Underlords</Link>
                <Link href="/fealty/offers">Fealty offers</Link>
          </Dropdown>
          </Link>
          <Link href="/marriage">Marriage </Link>
        <Link href="/government">Government</Link>
        <Link href="/about">About and socials</Link>
        <a href="https://discord.gg/N2mrGu2g" target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faDiscord} className="discord-icon" /></a>
        <a href="https://t.me/goldcastleclub" target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faTelegram} className="telegram-icon" /></a>
        <a href="https://twitter.com/GoldCastleClub" target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faTwitter} className="twitter-icon" /></a>
        <AlephiumConnectButtonCustom>
            {({ show, isConnected, disconnect, truncatedAddress }) => {
                if (isConnected) {
                    return (
                        <div>
                            <span>The Emperor's Friend: {truncatedAddress}</span>
                            <button className = "connectButton" onClick={disconnect}>Connected</button>
                        </div>
                    );
                } else {
                    return ( <div> 
                      <span>The Emperor awaits you: {truncatedAddress}</span>
                      <button className = "toconnectButton" onClick={show}>Connect</button>
                      </div>
                    );
                }
            }}
        </AlephiumConnectButtonCustom>
        {/* Add more links as needed */}
      </nav>
      <Component {...pageProps} />
    </AlephiumWalletProvider>
  )
}
