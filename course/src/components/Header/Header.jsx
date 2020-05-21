import {
  IconButton,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  SwipeableDrawer,
} from '@material-ui/core';
import { BugReport, Menu as MenuIcon } from '@material-ui/icons';
import LogOutButton from 'material-ui/svg-icons/action/power-settings-new';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { GITHUB_REPO } from '../../config';
import AppLogo from '../App/AppLogo';
import constants from '../constants';

const REPORT_BUG_PATH = `//github.com/${GITHUB_REPO}/issues`;

const VerticalAlignToolbar = styled(ToolbarGroup)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const VerticalAlignDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TabContainer = styled.div`
  display: flex;
  flex-direction: column;
  font-weight: ${constants.fontWeightNormal};
  height: 100%;
  justify-content: center;
  margin: 0 12px;
  text-align: center;
`;

const AppLogoWrapper = styled.div`
  @media screen and (max-width: 800px) {
    display: none;
  }
`;

const DropdownMenuItem = styled(MenuItem)`
  color: ${constants.primaryTextColor} !important;
  padding-bottom: 12px !important;
  padding-top: 12px !important;
`;

const ToolbarHeader = styled(Toolbar)`
  backdrop-filter: blur(16px);
  background-color: ${constants.defaultPrimaryColorSolid} !important;
  height: 56px;
  left: 0;
  padding: 8px 16px !important;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 100;

  & a {
    color: ${constants.primaryTextColor};

    &:hover {
      color: ${constants.primaryTextColor};
      opacity: 0.6;
    }
  }
`;

const MenuContent = styled.div`
  background: ${constants.primarySurfaceColor};
  max-width: 300px;
  height: 100%;
  overflow: auto;
  min-width: 220px;
`;

const MenuLogoWrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  padding: 24px 0;
`;

const DrawerLink = styled(Link)`
  color: ${constants.textColorPrimary};
`;

const LinkGroup = ({ navbarPages }) => (
  <VerticalAlignToolbar>
    {navbarPages.map((page) => (
      <TabContainer key={page.key}>
        <Link to={page.to}>{page.label}</Link>
      </TabContainer>
    ))}
  </VerticalAlignToolbar>
);

LinkGroup.propTypes = {
  navbarPages: PropTypes.shape([{}]),
};


const MenuButtonWrapper = styled.div`
  margin-right: 12px;
  display: none;
  @media (max-width: 768px) {
    display: block;
  }
`;

const LogoGroup = ({ onMenuClick }) => (
  <div style={{ marginRight: 16 }}>
    <VerticalAlignToolbar>
      <MenuButtonWrapper>
        <IconButton edge="start" color="inherit" onClick={onMenuClick}>
          <MenuIcon />
        </IconButton>
      </MenuButtonWrapper>
      <AppLogoWrapper>
        <AppLogo />
      </AppLogoWrapper>
    </VerticalAlignToolbar>
  </div>
);

LogoGroup.propTypes = {
  onMenuClick: PropTypes.func,
};

const ReportBug = ({ strings }) => (
  <DropdownMenuItem
    component="a"
    href={REPORT_BUG_PATH}
    target="_blank"
    rel="noopener noreferrer"
  >
    <BugReport style={{ marginRight: 32, width: 24, height: 24 }} />
    {strings.app_report_bug}
  </DropdownMenuItem>
);

ReportBug.propTypes = {
  strings: PropTypes.shape({}),
};

const LogOut = ({ strings }) => (
  <DropdownMenuItem
    component="a"
    href={`${process.env.REACT_APP_API_HOST}/logout`}
    rel="noopener noreferrer"
  >
    <LogOutButton style={{ marginRight: 32, width: 24, height: 24 }} />
    {strings.app_logout}
  </DropdownMenuItem>
);

LogOut.propTypes = {
  strings: PropTypes.shape({}),
};

const Header = () => {
  const [menuIsOpen, setMenuState] = useState(false);
  const small = useSelector((state) => state.browser.greaterThan.small);
  const strings = useSelector((state) => state.app.strings);

  const navbarPages = [
    {
      key: 'header_matches',
      to: '/matches',
      label: strings.header_matches,
    },
    {
      key: 'header_heroes',
      to: '/heroes',
      label: strings.header_heroes,
    },
    {
      key: 'header_records',
      to: '/records',
      label: strings.header_records,
    },
  ];

  return (
    <>
      <ToolbarHeader>
        <VerticalAlignDiv>
          <LogoGroup onMenuClick={() => setMenuState(true)} />
          {small && <LinkGroup navbarPages={navbarPages} />}
        </VerticalAlignDiv>
        <SwipeableDrawer
          onOpen={() => setMenuState(true)}
          onClose={() => setMenuState(false)}
          open={menuIsOpen}
        >
          <MenuContent>
            <MenuLogoWrapper>
              <div>
                <AppLogo onClick={() => setMenuState(false)} />
              </div>
            </MenuLogoWrapper>
            <List>
              {navbarPages.map((page) => (
                <DrawerLink key={`drawer__${page.to}`} to={page.to}>
                  <ListItem
                    button
                    key={`drawer__${page.to}`}
                    onClick={() => setMenuState(false)}
                  >
                    <ListItemText primary={page.label} />
                  </ListItem>
                </DrawerLink>
              ))}
            </List>
          </MenuContent>
        </SwipeableDrawer>
      </ToolbarHeader>
    </>
  );
};

Header.propTypes = {
  location: PropTypes.shape({}),
  disableSearch: PropTypes.bool,
  navbarPages: PropTypes.shape([{}]),
};

export default Header;
