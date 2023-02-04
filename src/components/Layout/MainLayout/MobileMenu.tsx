import {
  Button,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import React from 'react';
import { FiMenu } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import { mainMenu } from '@/config';

interface MobileMenuProps {}

export const MobileMenu = ({}: MobileMenuProps) => {
  const navigate = useNavigate();

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        variant="ghost"
        icon={<FiMenu fontSize="1.25rem" />}
        aria-label="Open Menu"
      />
      <MenuList>
        {mainMenu.map((menu) => (
          <MenuItem key={menu.label} onClick={() => navigate(menu.link)}>
            {menu.label}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};
