import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Group,
  Box,
  Collapse,
  ThemeIcon,
  Text,
  UnstyledButton,
  createStyles,
} from "@mantine/core";

import { CalendarStats, ChevronLeft, ChevronRight } from "tabler-icons-react";
const useStyles = createStyles((theme) => ({
  control: {
    fontWeight: 500,
    display: "block",
    width: "100%",
    cursor: "pointer",
    userSelect: "none",
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
    fontSize: theme.fontSizes.sm,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[7]
          : theme.colors.gray[0],
      color: theme.colorScheme === "dark" ? theme.white : theme.black,
    },
  },

  link: {
    fontWeight: 500,
    display: "block",
    textDecoration: "none",
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
    paddingLeft: 31,
    marginLeft: 30,
    fontSize: theme.fontSizes.sm,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    borderLeft: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[7]
          : theme.colors.gray[0],
      color: theme.colorScheme === "dark" ? theme.white : theme.black,
    },
  },

  chevron: {
    transition: "transform 200ms ease",
  },
  chevronRotate: {
    transform: `rotate(${theme.dir === "rtl" ? -90 : 90}deg)`,
  },
}));

export function LinksGroup({
  icon: Icon,
  label,
  initiallyOpened,
  links,
  link,
  setMenuList,
  collapse,
  index,
}) {
  const { classes, theme, cx } = useStyles();
  const hasLinks = links && links.length > 0;

  const ChevronIcon = theme.dir === "ltr" ? ChevronRight : ChevronLeft;

  if (hasLinks) {
    const state = collapse.includes(index);
    return (
      <>
        <Box
          onClick={() => {
            setMenuList(index);
          }}
          className={classes.control}
        >
          <Group position="apart" spacing={0}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <ThemeIcon variant="light" size={30}>
                <Icon size={18} />
              </ThemeIcon>
              <Box ml="md">{label}</Box>
            </Box>
            <div
              className={cx(classes.chevron, {
                [classes.chevronRotate]: state,
              })}
            >
              <ChevronIcon size={14} />
            </div>
          </Group>
        </Box>
        <Collapse in={state} animateOpacity={false}>
          {links.map((link, index) => (
            <Link href={link.link} passHref key={link.label + "_" + link.link}>
              <Text component="a" className={classes.link} tabIndex={-1}>
                {link.label}
              </Text>
            </Link>
          ))}
        </Collapse>
      </>
    );
  }
  return (
    <Link href={link} passHref>
      <Box component="a" className={classes.control}>
        <Group position="apart" spacing={0}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <ThemeIcon variant="light" size={30}>
              <Icon size={18} />
            </ThemeIcon>
            <Box ml="md">{label}</Box>
          </Box>
        </Group>
      </Box>
    </Link>
  );
}
