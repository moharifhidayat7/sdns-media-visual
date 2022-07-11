import React from 'react';
import { createStyles, Overlay, Container, Title, Button, Text, Box, Checkbox, Group } from '@mantine/core';
import { Navbar } from '@components/FrontEnd/Navbar';
import Link from 'next/link';
import { FooterSocial } from '@components/FrontEnd/Footer';

const useStyles = createStyles((theme) => ({
  hero: {
    position: 'relative',
    backgroundImage:
      'url(https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },

  container: {
    height: "500px",
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    paddingBottom: theme.spacing.xl * 6,
    zIndex: 1,
    position: 'relative',

    [theme.fn.smallerThan('sm')]: {
      height: 500,
      paddingBottom: theme.spacing.xl * 1,
    },
  },

  title: {
    color: theme.white,
    fontSize: 60,
    fontWeight: 900,
    lineHeight: 1.1,

    [theme.fn.smallerThan('sm')]: {
      fontSize: 40,
      lineHeight: 1.2,
    },

    [theme.fn.smallerThan('xs')]: {
      fontSize: 28,
      lineHeight: 1.3,
    },
  },

  description: {
    color: theme.white,
    maxWidth: 600,

    [theme.fn.smallerThan('sm')]: {
      maxWidth: '100%',
      fontSize: theme.fontSizes.sm,
    },
  },
  produkFilter: {
    borderTop: '1.5px solid #d4cfcf',
    borderBottom: '1.5px solid #d4cfcf',
    padding: '10px 0',
    marginTop: '20px',

    span: {
      color: '#4f4d4d',
      fontSize: '17px',
      fontWeight: 'bold',
    }
  },
  control: {
    marginTop: theme.spacing.xl * 1.5,
    // padding: theme.spacing.xl ,
    // height:'auto',
    [theme.fn.smallerThan('sm')]: {
      width: '100%',
    },
  },
}));

const Index = () => {
  const { classes } = useStyles();

  return (
    <>
      <div className={classes.hero}>
        <Navbar />
        <Overlay
          gradient="linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, .65) 40%)"
          opacity={1}
          zIndex={1}
        />
        <Container className={classes.container}>
          <Title className={classes.title}>Be a Leading Star to Lead Indonesia’s Digital Ecosystem</Title>
          <Text className={classes.description} size="xl" mt="xl">
            Kami terus berinovasi mengikuti perkembangan digital pada sektor-sektor penting di Indonesia agar tetap relevan dan akan memberikan dampak yang berarti bagi masyarakat.
          </Text>

          <Link href="/register">
            <Button variant="gradient" size="xl" radius="xl" className={classes.control}>
              Bergabung
            </Button>
          </Link>
        </Container>
      </div>
      <Container mt={20}>
        <Title className='text-gray-800 text-center'>Produk</Title>
        <div className={classes.produkFilter}>
     <Group>
          <span >Filter</span>
     <Checkbox label="Analog" />
            <Checkbox label="Digital" />
     </Group>
        </div>
      </Container>
      <FooterSocial />
    </>
  );
}
export default Index;
