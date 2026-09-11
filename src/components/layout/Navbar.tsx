import React from 'react';
import { TopBarControls, TopBarControlsProps } from './TopBarControls';

export type NavbarProps = TopBarControlsProps;

export const Navbar: React.FC<NavbarProps> = (props) => {
  return <TopBarControls {...props} />;
};

export default Navbar;
