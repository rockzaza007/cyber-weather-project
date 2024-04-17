import {
  IconCopy,
  IconLayoutDashboard,
  IconLogin,
  IconMoodHappy,
  IconTypography,
  IconUserPlus,
} from '@tabler/icons';

import auth from 'src/firebase_config';

import { uniqueId } from 'lodash';

const Menuitems = [
  {
    navlabel: true,
    subheader: 'Home',
  },

  {
    id: uniqueId(),
    title: 'Dashboard',
    icon: IconLayoutDashboard,
    href: '/dashboard',
  },
  {
    navlabel: true,
    subheader: 'Management',
  },
  {
    id: uniqueId(),
    title: 'Weather',
    icon: IconTypography,
    href: '/sample-page',
  },  
  {
    id: uniqueId(),
    title: 'Station',
    icon: IconMoodHappy,
    href: '/stations',
  },  
  {
    navlabel: true,
    subheader: 'User Account',
  },
  {
    id: uniqueId(),
    title: 'Role',
    icon: IconCopy,
    href: '/admin',
  },
  {
    id: uniqueId(),
    title: 'Profile',
    icon: IconCopy,
    href: '/profile',
  },
  {
    id: uniqueId(),
    title: 'Feedback',
    icon: IconCopy,
    href: '/feedback',
  },
  // {
  //   navlabel: true,
  //   subheader: 'Auth',
  // },
  // {
  //   id: uniqueId(),
  //   title: 'Login',
  //   icon: IconLogin,
  //   href: '/auth/login',
  // },
  // {
  //   id: uniqueId(),
  //   title: 'Register',
  //   icon: IconUserPlus,
  //   href: '/auth/register',
  // },
  // {
  //   navlabel: true,
  //   subheader: 'Account',
  // },
  // {
  //   id: uniqueId(),
  //   title: 'Logout',
  //   icon: IconMoodHappy,
  //   href: '/icons',
  // },
  // {
  //   id: uniqueId(),
  //   title: 'Sample Page',
  //   icon: IconAperture,
  //   href: '/sample-page',
  // },
];

export default Menuitems;
