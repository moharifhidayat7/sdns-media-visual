import React, { useState } from 'react';
import { createStyles, Header, Container, Group, Burger, Paper, Transition, Button } from '@mantine/core';
import { useBooleanToggle } from '@mantine/hooks';
import Link from 'next/link';

const HEADER_HEIGHT = 80;

const useStyles = createStyles((theme) => ({
     root: {
          position: 'relative',
          zIndex: 2,
          backgroundColor: "rgba(0,0,0,0.8)",
          borderBottom: "none"
     },

     dropdown: {
          position: 'absolute',
          top: HEADER_HEIGHT,
          left: 0,
          right: 0,
          zIndex: 0,
          borderTopRightRadius: 0,
          borderTopLeftRadius: 0,
          borderTopWidth: 0,
          borderLeft:"none",
          overflow: 'hidden',
          backgroundColor: "rgba(0,0,0,0.8)",
          [theme.fn.largerThan('sm')]: {
               display: 'none',
          },
     },

     header: {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '100%',
     },

     links: {
          [theme.fn.smallerThan('sm')]: {
               display: 'none',
          },
     },

     burger: {
          [theme.fn.largerThan('sm')]: {
               display: 'none',
          },
     },

     link: {
          display: 'block',
          lineHeight: 1,
          padding: '8px 12px',
          borderRadius: theme.radius.sm,
          textDecoration: 'none',
          color: theme.colors.gray[2],
          fontSize: theme.fontSizes.sm,
          fontWeight: 500,

          '&:hover': {
               color: theme.colors.gray[8],
               backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
          },

          [theme.fn.smallerThan('sm')]: {
               borderRadius: 0,
               padding: theme.spacing.md,
          },
     },

     linkActive: {
          '&, &:hover': {
               // backgroundColor:
               //      theme.colorScheme === 'dark'
               //           ? theme.fn.rgba(theme.colors[theme.primaryColor][9], 0.25)
               //           : theme.colors[theme.primaryColor][0],
               color: theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 3 : 7],
          },
     },
}));



export function Navbar() {
     const links = [
          {
               "link": "/home",
               "label": "Home"
          },
          {
               "link": "/produk",
               "label": "Produk"
          },
          {
               "link": "/about",
               "label": "About"
          },
          {
               "link": "/contact",
               "label": "Contact"
          }
     ]

     const [opened, toggleOpened] = useBooleanToggle(false);
     const [active, setActive] = useState(links[0].link);
     const { classes, cx } = useStyles();

     const items = links.map((link) => (
          <a
               key={link.label}
               href={link.link}
               className={cx(classes.link, { [classes.linkActive]: active === link.link })}
               onClick={(event) => {
                    event.preventDefault();
                    setActive(link.link);
                    toggleOpened(false);
               }}
          >
               {link.label}
          </a>
     ));

     return (
          <Header height={HEADER_HEIGHT} mb={120} className={classes.root}>
               <Container className={classes.header} size="lg">
                    <img src="/mvb_head.png" width={400} className="hidden md:block" />
                    <img src="/mvb_icon.png" width={60} className="block md:hidden" />
                    <Group spacing={5} className={classes.links}>
                         {items}
                    </Group>

                    <Burger
                         opened={opened}
                         onClick={() => toggleOpened()}
                         className={classes.burger}
                         color="white"
                         size="sm"
                    />

                    <Transition transition="pop-top-right" duration={200} mounted={opened}>
                         {(styles) => (
                              <Paper className={classes.dropdown} withBorder style={styles}>
                                   {items}
                                   <Link href="/login" >
                                   <Button className='my-3 ml-3' radius="xl" sx={{ height: 30 }}>
                                        Login
                                   </Button>
                                   </Link>
                              </Paper>
                         )}

                    </Transition>
                    <Link href="/login" >
                         <Button className='hidden md:block' radius="xl" sx={{ height: 30 }}>
                              Login
                         </Button>
                    </Link>
               </Container>
          </Header>
     );
}