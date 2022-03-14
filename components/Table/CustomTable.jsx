import { useState } from "react";
import {
  createStyles,
  Table,
  Checkbox,
  ScrollArea,
  Group,
  Pagination,
  UnstyledButton,
  Center,
  Avatar,
  Text,
  ActionIcon,
} from "@mantine/core";

import {
  Selector,
  ChevronDown,
  ChevronUp,
  Search,
  Pencil,
  Trash,
} from "tabler-icons-react";

const useStyles = createStyles((theme) => ({
  rowSelected: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.fn.rgba(theme.colors[theme.primaryColor][7], 0.2)
        : theme.colors[theme.primaryColor][0],
  },
  th: {
    padding: "0 !important",
  },

  control: {
    width: "100%",
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },

  icon: {
    width: 21,
    height: 21,
    borderRadius: 21,
  },
}));

function Th({ children, reversed, sorted, onSort, ...props }) {
  const { classes } = useStyles();
  const Icon = sorted ? (reversed ? ChevronUp : ChevronDown) : Selector;
  return (
    <th className={classes.th} {...props}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group position="apart">
          <Text weight={500} size="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon size={14} />
          </Center>
        </Group>
      </UnstyledButton>
    </th>
  );
}

const CustomTable = ({
  data,
  header,
  children,
  controls = {
    read: {
      visible: false,
      disabled: false,
      action: () => {},
    },
    update: {
      visible: false,
      disabled: false,
      action: () => {},
    },
    delete: {
      visible: false,
      disabled: false,
      action: () => {},
    },
  },
}) => {
  const { classes, cx } = useStyles();

  return (
    <ScrollArea>
      <Table sx={{ minWidth: 800 }} verticalSpacing="sm">
        <thead>
          <tr>
            {header.map((th) => {
              return <Th key={th.key}>{th.label}</Th>;
            })}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </Table>
    </ScrollArea>
  );
};

const Row = ({ children }) => {
  return <tr>{children}</tr>;
};

CustomTable.Row = Row;

const Col = ({ children }) => {
  return <td>{children}</td>;
};

CustomTable.Col = Col;

export { CustomTable };
